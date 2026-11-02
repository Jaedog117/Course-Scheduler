import React from 'react';
import CourseCard from './CourseCard';

const CourseList = ({courses, completed, setCompleted, filter}) => {

    // Helper function to check if all prerequisites of a course are met
    const isAvailable = (course) => {
        return course.prerequisites.every(prereqId => completed.includes(prereqId));
    };

    // Cascade Uncheck Logic: Recursively unchecks any courses that depend on the unchecked course
    const handleToggleCompleted = (courseId, isChecked) => {
        if (isChecked) {
            // Check if eligible to complete (double-enforce)
            const course = courses.find(c => c.id === courseId);
            if (course && isAvailable(course)) {
                setCompleted(prev => [...prev, courseId]);
            }
        } else {
            // Remove the course from completed array
            let updatedCompleted = completed.filter(id => id !== courseId);

            // Cascade effect loop to find and remove downstream locked courses
            let keepChecking = true;
            while (keepChecking) {
                const structuralLength = updatedCompleted.length;

                // Filter out courses whose prerequisites are no longer fully met
                updatedCompleted = updatedCompleted.filter(id => {
                    const currentCourse = courses.find(c => c.id === id);
                    if (!currentCourse) return false;
                    // Every prerequisite must still exist in the updated array
                    return currentCourse.prerequisites.every(prereqId => updatedCompleted.includes(prereqId));
                });

                // If no more courses were dropped in this pass, cascade evaluation is complete
                if (updatedCompleted.length === structuralLength) {
                    keepChecking = false;
                }
            }
            setCompleted(updatedCompleted);
        }
    };

    // 3. Filter your view list depending on the active top controls
    const filteredCourses = courses.filter(course => {
        const isDone = completed.includes(course.id);
        if (filter === 'Completed Only') return isDone;
        if (filter === 'Remaining') return !isDone;
        return true; // 'All'
    });

    return (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 my-2">
            {filteredCourses.map(course => {
                const isDone = completed.includes(course.id);
                const canTake = isAvailable(course);

                // Determine explicit status tag string
                let status = 'Locked';
                if (isDone) status = 'Completed';
                else if (canTake) status = 'Available';

                return (
                    <div className="col" key={course.id}>
                        <CourseCard
                            course={course}
                            status={status}
                            coursesCatalog={courses}
                            onStatusToggle={(isChecked) => handleToggleCompleted(course.id, isChecked)}
                        />
                    </div>
                );
            })}
            {filteredCourses.length === 0 && (
                <div className="col-12 text-center text-muted my-4">
                    No courses match this filter category view.
                </div>
            )}
        </div>
    );
};

export default CourseList;
