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
        <div>
            <h1>Example Templates</h1>
            <div className="d-flex flex-wrap">
                {templateCards}
            </div>
        </div>
    )

}