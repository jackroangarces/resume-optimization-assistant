import React, { useState } from 'react';
import { jsPDF } from "jspdf";
import { Document, Packer, Paragraph } from "docx";
import {ResumeList} from './ResumeList';
import { EditorButtons, GenerateButtons } from './ResumeButtons';
import { getDatabase, ref, set, child } from 'firebase/database';


export function MyResumes({ resumes, setResumes, username }) {

    const handleCreateResume = (name) => {
        const title = name.trim();
        if (!title) return; 
        const resumeId = title;
        
        // CREATE PDF
        const pdf = new jsPDF();
        pdf.text(title, 10, 10);
        const pdfBlob = pdf.output("blob");
        const pdfUrl = URL.createObjectURL(pdfBlob);

        // CREATE DOCX
        const docx = new Document({
            sections: [{
                properties: {},
                children: [new Paragraph(title)]
            }]
        });
        Packer.toBlob(docx).then((docxBlob) => {
            const docxUrl = URL.createObjectURL(docxBlob);

            // CREATE RESUME OBJECT
            const newResume = {
                id: resumeId,
                title,
                lastEdited: new Date().toISOString().split("T")[0],
                image: null,
                pdfUrl,
                docxUrl,
            };
            setResumes([...resumes, newResume]);

            // UPDATE FIREBASE
            const db = getDatabase();
            const userResumesRef = ref(db, `userData/${username}/resumes`);
            const newResumeRef = child(userResumesRef, resumeId.toString());
            set(newResumeRef, newResume)
                .then(() => {
                    console.log("Resume added to Firebase successfully!");
                })
                .catch((error) => {
                    console.error("Error adding resume to Firebase: ", error);
                });
        });
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



  