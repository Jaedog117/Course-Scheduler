import React, {useState} from 'react';
import useFetch from '../hooks/useFetch';
import CourseList from '../components/CourseList';
import ProgressSummary from '../components/ProgressSummary';

// Call useFetch using environment variable
const HomePage = () => {
    const apiEndpoint = `${import.meta.env.VITE_API_BASE_URL}/courses`;
    const {data: rawCourses, isPending, error} = useFetch(apiEndpoint);

// Make all ids numbers so comparisons like completed.includes(prereqId) work
    const courses = rawCourses
        ? rawCourses.map(c => ({
            ...c,
            id: Number(c.id),
            prerequisites: c.prerequisites.map(Number),
        }))
        : null;
    // Shared completed status state (persisted via localStorage)
    const [completed, setCompleted] = useState(() => {
        try {
            const saved = localStorage.getItem('completed_courses');
            const parsed = saved ? JSON.parse(saved) : [];
            return Array.isArray(parsed) ? parsed.map(Number) : [];
        } catch {
            return [];
        }
    });

    const [filter, setFilter] = useState('All');

    const handleSave = () => {
        try {
            localStorage.setItem('completed_courses', JSON.stringify(completed));
            alert('Progress saved successfully!');
        } catch {
            alert('Could not save progress. Check your browser storage settings.');
        }
    };

    return (
        <div className="container mt-4">
            {/* Show an error message if the fetch fails */}
            {error && (
                <div className="alert alert-danger my-3" role="alert">
                    <strong>Error loading catalog:</strong> {error}. Please make sure JSON Server is
                    running and that VITE_API_BASE_URL in your .env file is correct.
                </div>
            )}

            {/* Show a loading indicator while isPending is true */}
            {isPending && (
                <div className="d-flex justify-content-center align-items-center my-5 gap-3">
                    <div className="spinner-border text-primary" role="status"></div>
                    <span className="fs-5 text-secondary">Loading course catalog...</span>
                </div>
            )}

            {/* Only render content once the courses array has successfully loaded */}
            {courses && (
                <>
                    <ProgressSummary courses={courses} completed={completed}/>

                    <div className="d-flex justify-content-between my-3">
                        <div className="btn-group">
                            <button className={`btn btn-outline-dark ${filter === 'All' ? 'active' : ''}`}
                                    onClick={() => setFilter('All')}>All Courses
                            </button>
                            <button className={`btn btn-outline-dark ${filter === 'Completed Only' ? 'active' : ''}`}
                                    onClick={() => setFilter('Completed Only')}>Completed Only
                            </button>
                            <button className={`btn btn-outline-dark ${filter === 'Remaining' ? 'active' : ''}`}
                                    onClick={() => setFilter('Remaining')}>Remaining
                            </button>
                        </div>
                        <button className="btn btn-success px-4" onClick={handleSave}>Save</button>
                    </div>

                    {/* Pass the courses down as a prop */}
                    <CourseList
                        courses={courses}
                        completed={completed}
                        setCompleted={setCompleted}
                        filter={filter}
                    />
                </>
            )}
        </div>
    );
};

export default HomePage;
