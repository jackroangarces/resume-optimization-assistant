import React from 'react';
import { useParams } from 'react-router';
import { EditorButtons, GenerateButtons } from './ResumeButtons';
import { ChatScreen } from './ResumeAI';


export function ResumeEditor({ resumes, setResumes }) {
    const { id } = useParams();
    const resume = resumes.find(resume => resume.id === parseInt(id));

    if (!resume) {
        return <p>Resume not found!</p>;
    }

    return (
        <div>
            <h1 className="pt-4">{resume.title}</h1>
            <div className='d-flex justify-content-between'>
                <div className='button-container'>
                    <EditorButtons name="Edit Biography"/> {/* Example Button */} 
                    <EditorButtons name="Edit Relevant Coursework"/> 
                    <EditorButtons name="Edit Work Experience"/> 
                    <EditorButtons name="Edit Projects"/> 
                    <EditorButtons name="Edit Skills"/> 
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
                    <GenerateButtons task="" editName="Generate Class Recs"/> {/* Example Button */} 
                    <GenerateButtons task="" editName="Generate Project Ideas"/> 
                    <GenerateButtons editName="AI Quality Score"/> 

                </div>
            </div>
        </div>
    );
}
