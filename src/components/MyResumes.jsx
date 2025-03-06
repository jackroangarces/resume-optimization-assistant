import React from 'react';
import { jsPDF } from "jspdf";
import { Document, Packer, Paragraph } from "docx";
import {ResumeList} from './ResumeList';
import { EditorButtons } from './ResumeButtons';
import { getDatabase, ref, set} from 'firebase/database';

const blobToBase64 = (blob) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });
};

export function MyResumes({ resumes, setResumes, username }) {

    const handleCreateResume = async (name) => {
        const title = name.trim();
        if (!title) return; 
        const resumeId = title;

        const db = getDatabase();
        
        // CREATE PDF
        const pdf = new jsPDF();
        pdf.text(title, 10, 10);
        const pdfBlob = pdf.output("blob");
        const pdfBase64 = await blobToBase64(pdfBlob);

        // CREATE DOCX  
        const docx = new Document({
            sections: [{
                properties: {},
                children: [new Paragraph(title)]
            }]
        });
        const docxBlob = await Packer.toBlob(docx);
        const docxBase64 = await blobToBase64(docxBlob);

        // CREATE RESUME OBJECT
        const newResume = {
            id: resumeId,
            title,
            lastEdited: new Date().toISOString().split("T")[0],
            image: null,
            pdfBase64,
            docxBase64,
        };
        setResumes([...resumes, newResume]);

        // UPDATE FIREBASE
        const resumeRef = ref(db, `userData/${username}/resumes/${resumeId}`);
        set(resumeRef, newResume)
            .then(() => {
                console.log("Resume added to Firebase successfully!");
            })
            .catch((error) => {
                console.error("Error adding resume to Firebase: ", error);
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



  