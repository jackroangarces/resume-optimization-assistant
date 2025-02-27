import React, { useState } from 'react';
import {ResumeList} from './ResumeList';
import {ResumeEditor} from './ResumeEditor';

export function MyResumes({ resumes, setResumes }) {

    const handleCreateResume = () => {
        const title = window.prompt("Enter resume title:");
        if (!title) return; 
        const newResume = {
          id: resumes.length + 1,
          title,
          lastEdited: new Date().toISOString().split("T")[0],
          image: null,
        };
        setResumes([...resumes, newResume]);
    };

    return (
        <div className="my-resumes-page">
                <h1>My Resumes</h1>
                <button onClick={handleCreateResume}>Create New Resume</button>
                <ResumeList resumes={resumes} />
        </div>
    );
}