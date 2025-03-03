import React from 'react';
import { TemplateContainer } from './ResumeContainer';

import SAMPLE_RESUMES from '../data/examples.json';

export function ExamplesPage(props) {
    let templateCards = SAMPLE_RESUMES.map((resume) => {
        return <TemplateContainer 
                name={resume.name}
                alt={resume.alt}
                link={resume.link}
                img={resume.img}
                target={resume.target} />
    });

    return (
        <div className="examples-page">
            <h1 className="page-title">Example Resume Templates</h1>
            <p className="page-subtitle">
                Browse through these professionally designed resume templates to find the perfect fit for your career.
            </p>
            <div className="templates-container">
                {templateCards}
            </div>
        </div>
    );

}