import React from 'react';

const AboutPage = () => {
    // Current assignment snapshot requirements
    const formattedDate = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <div className="card p-4 shadow-sm my-3 mx-auto" style={{maxWidth: '42rem'}}>
            <h2 className="fw-bold mb-3">About</h2>
            <p className="text-secondary mb-4">
                The Aurora CS Course Scheduler shows the CS Developer Track catalog,
                tracks which courses you have completed, and shows which courses you are
                eligible to take next based on prerequisites.
            </p>

            <div className="row g-2 border-top pt-3">
                <div className="col-4 text-dark fw-bold">Author(s):</div>
                <div className="col-8 text-secondary">Johnny Christiansen & Jaedon Vaughn</div>

                <div className="col-4 text-dark fw-bold">Date:</div>
                <div className="col-8 text-secondary">{formattedDate}</div>

                <div className="col-4 text-dark fw-bold">Version:</div>
                <div className="col-8 text-secondary">1.0.0</div>
            </div>
        </div>
    );
};

export default AboutPage;