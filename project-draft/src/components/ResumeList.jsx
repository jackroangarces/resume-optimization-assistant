import React from 'react';
import {ResumeContainer} from './ResumeContainer';

export function ResumeList({ resumes }) {
    return (
        <div className="resume-list">
            {resumes.map(resume => (
                <ResumeContainer key={resume.id} resume={resume} />
            ))}
        </div>
    );
}