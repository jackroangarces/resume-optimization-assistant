import React from 'react';
import {Link} from 'react-router';

export function ResumeContainer({ resume }) {
    return (
        <Link to={`/resume/edit-resume/${resume.id}`} className="resume-container">
            <img src={resume.image} alt={resume.title} className="resume-image" />
            <div className="resume-info">
                <h3>{resume.title}</h3>
                <p>Created: {resume.lastEdited}</p>
            </div>
        </Link>
        // Add "X" to delete resume
    );
};

export function TemplateContainer(props) {

    // State variables here:
    const {name, img, alt, target, link} = props;

    return (
        <div className="template-card w-50">
            <a href={link} target={target}>
                <img src={img} alt={alt} className="template-img" />
                <h2>{name}</h2>
            </a>
        </div>
    );
};