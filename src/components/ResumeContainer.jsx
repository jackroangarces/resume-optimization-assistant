import React from 'react';
import {Link} from 'react-router';
import { getDatabase, ref, set} from 'firebase/database';

export function ResumeContainer({ resume, resumes, setResumes, username }) {
    
    const handleDelete = (event) => {
        event.preventDefault();
        const db = getDatabase();
        const resumeRef = ref(db, `userData/${username}/resumes/${resume.id}`);
        set(resumeRef, null).catch(error => console.error("Error deleting resume:", error));
        console.log(`Deleting from Firebase path: userData/${username}/resumes/${resume.id}`);
        const updatedResumes = resumes.filter(r => r.id !== resume.id);
        setResumes(updatedResumes);
    };
    
    return (
        <Link to={`/resume/edit-resume/${resume.id}`} className="resume-container">
            <img src={resume.image} alt={resume.title} className="resume-image" />
            <div className="resume-info">
                <h3>{resume.title}</h3>
                <p>Created: {resume.lastEdited}</p>
            </div>
            <button className="delete-button" onClick={handleDelete}>✖</button>
        </Link>
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