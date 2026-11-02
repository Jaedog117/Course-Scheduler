import React from 'react';

const CourseCard = ({course, status, coursesCatalog, onStatusToggle}) => {

    // Map prerequisite IDs to actual course code strings (e.g. 1 -> "CSC1700")
    const prereqCodes = course.prerequisites.map(prereqId => {
        const matchedCourse = coursesCatalog.find(c => c.id === prereqId);
        return matchedCourse ? matchedCourse.number : prereqId;
    });

    // Determine Bootstrap color themes based on the state label
    let badgeColor = 'bg-secondary text-white'; // Locked default
    let borderStyle = 'border-secondary-subtle';

    if (status === 'Completed') {
        badgeColor = 'bg-success text-white';
        borderStyle = 'border-success';
    } else if (status === 'Available') {
        badgeColor = 'bg-primary text-white';
        borderStyle = 'border-primary';
    }

    return (
        <div className={`card h-100 shadow-sm border-2 ${borderStyle}`}>
            <div className="card-body d-flex flex-column justify-content-between">

                <div>
                    {/* Class Label Title/Header */}
                    <div className="d-flex justify-content-between align-items-center mb-2">
                        <h5 className="card-title mb-0 fw-bold">{course.number}</h5>
                        <span className={`badge fw-bold ${badgeColor}`}>{status}</span>
                    </div>

                    {/* Class Description Block */}
                    <h6 className="card-subtitle mb-2 text-muted">{course.title} ({course.credits} Credits)</h6>
                    <p className="card-text text-secondary small">{course.description}</p>
                </div>

                {/* Footer Relationship & Input Block */}
                <div className="mt-3 pt-2 border-top">
                    <p className="small mb-2 text-dark">
                        <strong>Prerequisites:</strong> {prereqCodes.length > 0 ? prereqCodes.join(', ') : 'None'}
                    </p>

                    <div className="form-check">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            id={`check-${course.id}`}
                            checked={status === 'Completed'}
                            disabled={status === 'Locked'} // Enforce: clicking locked does nothing
                            onChange={(e) => onStatusToggle(e.target.checked)}
                        />
                        <label className="form-check-label text-muted small user-select-none"
                               htmlFor={`check-${course.id}`}>
                            {status === 'Locked' ? 'Complete prerequisites first' : 'Mark Completed'}
                        </label>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default CourseCard;
