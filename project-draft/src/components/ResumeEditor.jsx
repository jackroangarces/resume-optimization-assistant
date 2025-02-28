import React from 'react';
import { useParams } from 'react-router';
import { EditorButtons } from './ResumeButtons';


export function ResumeEditor({ resumes, setResumes }) {
    const { id } = useParams();
    const resume = resumes.find(resume => resume.id === parseInt(id));

    if (!resume) {
        return <p>Resume not found!</p>;
    }

    return (
        <div>
            <h1>{resume.title}</h1>
            <div className='d-flex justify-content-between'>
                <div className='button-container'>
                    <EditorButtons editName="Biography"/> {/* Example Button */} 
                    <EditorButtons editName="Relevant Coursework"/> 
                    <EditorButtons editName="Work Experience"/> 
                    <EditorButtons editName="Projects"/> 
                    <EditorButtons editName="Skills"/> 
                </div>
                <div className="resume-editor d-flex">
                    <div className="resume-preview">
                        <p><strong>Title:</strong> {resume.title}</p>
                        <p><strong>Last Edited:</strong> {resume.lastEdited}</p>
                        {/* Placeholder for .docx file preview */}
                        <p>Resume content (this will be the .docx file in the future):</p>
                        <div className="docx-placeholder">
                            {/* Placeholder */}
                            <p>Document Preview: {resume.title} (PDF or DOCX Viewer goes here)</p>
                        </div>
                    </div>
                </div>
                <div className='button-container'>
                    <EditorButtons editName="Generate Class Recs"/> {/* Example Button */} 
                    <EditorButtons editName="Generate Project Ideas"/> 
                    <EditorButtons editName="AI Quality Score"/> 
                </div>
            </div>
        </div>
    );
}
