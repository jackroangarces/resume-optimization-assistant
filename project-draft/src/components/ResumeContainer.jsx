import React from 'react';
import {Link} from 'react-router';

export function ResumeContainer({ resume }) {
    return (
        <Link to={`/resume/edit-resume/${resume.id}`} className="resume-container">
            <img src={resume.image} alt={resume.title} className="resume-image" />
            <div className="resume-info">
                <h3>{resume.title}</h3>
                <p>Last Edited: {resume.lastEdited}</p>
            </div>
        </Link>
    );
};

export function TemplateContainer(props) {

    // State variables here:

    return (
        <div className="card">
            <img src="img/foster-resume-template.png" alt="Resume Preview" className="card-image"></img>
            <h3 className="card-title">Jacks SWE Resume</h3>
            <p className="last-modified">Last Modified: February 2, 2025</p>
        </div>
    );
};