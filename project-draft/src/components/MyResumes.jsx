import React, { useState } from 'react';
import { jsPDF } from "jspdf";
import {ResumeList} from './ResumeList';
import { EditorButtons, GenerateButtons } from './ResumeButtons';


export function MyResumes({ resumes, setResumes }) {

    const handleCreateResume = (name) => {
        const title = name;
        if (!title) return; 
        
        const doc = new jsPDF();
        doc.text(title, 10, 10);

        const pdfBlob = doc.output("blob");
        const pdfUrl = URL.createObjectURL(pdfBlob);
        
        const newResume = {
          id: resumes.length + 1,
          title,
          lastEdited: new Date().toISOString().split("T")[0],
          image: null,
          pdfUrl: pdfUrl,
          pdf: doc,
        };

        setResumes([...resumes, newResume]);
    };

    return (
        <div>
            <h1>My Resumes</h1>
            <div className="my-resumes-page">
                <EditorButtons name="Create Resume" modalName="Enter Resume Title" onSave={handleCreateResume}/>
                <ResumeList resumes={resumes} />
            </div>
        </div>
    );
}