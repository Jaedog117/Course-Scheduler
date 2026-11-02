import React from 'react';

const ProgressSummary = ({courses, completed}) => {
    const totalCourses = courses.length;

    const isCompleted = (course) => completed.includes(course.id);
    const prereqsMet = (course) =>
        course.prerequisites.every(prereqId => completed.includes(prereqId));

    // All three counts are derived from state with .filter()
    const completedCount = courses.filter(course => isCompleted(course)).length;
    const availableCount = courses.filter(course => !isCompleted(course) && prereqsMet(course)).length;
    const lockedCount = courses.filter(course => !isCompleted(course) && !prereqsMet(course)).length;

    const progressPercent = totalCourses > 0
        ? Math.round((completedCount / totalCourses) * 100)
        : 0;

    return (
        <div className="card p-3 my-3 shadow-sm bg-body rounded">
            <div className="d-flex justify-content-start align-items-center gap-4 mb-2 fw-semibold">
        <span className="text-success">
          <strong className="fs-4">{completedCount}</strong> of {totalCourses} Courses Completed
        </span>
                <span className="text-primary">
          <strong className="fs-4">{availableCount}</strong> Available
        </span>
                <span className="text-secondary">
          <strong className="fs-4">{lockedCount}</strong> Locked
        </span>
            </div>

            <div className="progress" style={{height: '24px'}}>
                <div
                    className="progress-bar bg-success text-white fw-bold"
                    role="progressbar"
                    style={{width: `${progressPercent}%`}}
                    aria-valuenow={progressPercent}
                    aria-valuemin="0"
                    aria-valuemax="100"
                >
                    {progressPercent}%
                </div>
            </div>
        </div>
    );
};

export default ProgressSummary;