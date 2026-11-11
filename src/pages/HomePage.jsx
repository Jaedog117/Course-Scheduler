import React, {useState, useEffect} from 'react';
import useFetch from '../hooks/useFetch';
import CourseList from '../components/CourseList';
import ProgressSummary from '../components/ProgressSummary';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const HomePage = () => {
    // Course catalog comes from the Express API through the useFetch hook
    const {data: rawCourses, isPending, error} = useFetch(`${BASE_URL}/api/courses`);

    // Make all ids numbers so comparisons like completed.includes(prereqId) work
    const courses = rawCourses
        ? rawCourses.map(c => ({
            ...c,
            id: Number(c.id),
            prerequisites: c.prerequisites.map(Number),
        }))
        : null;

    // Saved completions come from the database
    const {
        data: savedCompletions,
        isPending: completionsPending,
        error: completionsError,
    } = useFetch(`${BASE_URL}/api/completions`);

    // Editable copy of the completed list that the checkboxes change
    const [completed, setCompleted] = useState([]);

    // When the fetch finishes, copy the server's list into editable state
    useEffect(() => {
        if (Array.isArray(savedCompletions)) setCompleted(savedCompletions.map(Number));
    }, [savedCompletions]);

    const [filter, setFilter] = useState('All');
    const [saveMessage, setSaveMessage] = useState(null); // { type: 'success' | 'danger', text }
    const [isSaving, setIsSaving] = useState(false);

    // Save the current completed array to the database
    const handleSave = async () => {
        setIsSaving(true);
        setSaveMessage(null);
        try {
            const res = await fetch(`${BASE_URL}/api/completions`, {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(completed),
            });
            const body = await res.json().catch(() => null);

            if (!res.ok) {
                // A 400 carries the server's own error message
                setSaveMessage({
                    type: 'danger',
                    text: body?.error || 'Could not save progress.',
                });
            } else {
                setCompleted(body.map(Number));
                setSaveMessage({type: 'success', text: 'Progress saved successfully!'});
            }
        } catch {
            setSaveMessage({
                type: 'danger',
                text: 'Could not reach the server. Make sure the Express API is running.',
            });
        } finally {
            setIsSaving(false);
        }
    };

    const loadError = error || completionsError;
    const loading = isPending || completionsPending;

    return (
        <div className="container mt-4">
            {/* Show an error message if either fetch fails */}
            {loadError && (
                <div className="alert alert-danger my-3" role="alert">
                    <strong>Error loading catalog:</strong> {loadError}. Please make sure the Express
                    server is running and that VITE_API_BASE_URL in your .env file is correct.
                </div>
            )}

            {/* Show a loading indicator while the data is on its way */}
            {loading && !loadError && (
                <div className="d-flex justify-content-center align-items-center my-5 gap-3">
                    <div className="spinner-border text-primary" role="status"></div>
                    <span className="fs-5 text-secondary">Loading course catalog...</span>
                </div>
            )}

            {/* Only render content once courses AND saved completions have loaded */}
            {courses && !completionsPending && !completionsError && (
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
                        <button className="btn btn-success px-4" onClick={handleSave} disabled={isSaving}>
                            {isSaving ? 'Saving...' : 'Save'}
                        </button>
                    </div>

                    {saveMessage && (
                        <div className={`alert alert-${saveMessage.type} alert-dismissible my-3`} role="alert">
                            {saveMessage.text}
                            <button type="button" className="btn-close" aria-label="Close"
                                    onClick={() => setSaveMessage(null)}></button>
                        </div>
                    )}

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
