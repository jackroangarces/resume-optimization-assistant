import React from 'react';
import { jsPDF } from "jspdf";
import { Document, Packer, Paragraph } from "docx";
import { ResumeList } from './ResumeList';
import { EditorButtons } from './ResumeButtons';
import { getDatabase, ref, set} from 'firebase/database';
import { blobToBase64, generatePdfFromDocx } from './Utils';

export function MyResumes({ resumes, setResumes, username }) {

    const handleCreateResume = async (name) => {
        const title = name.trim();
        if (!title) return; 
        const resumeId = title;
        const db = getDatabase();

        // FETCH TEMPLATE FROM PUBLIC FOLDER
        const templateResponse = await fetch('/template_formatted.docx');
        const templateArrayBuffer = await templateResponse.arrayBuffer();
        const templateBlob = new Blob([templateArrayBuffer], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });

        // CREATE DOCX  
        const docxBase64 = await blobToBase64(templateBlob);

        // CREATE PDF FROM DOCX
        const pdfBase64 = await generatePdfFromDocx(templateBlob);

        // CREATE RESUME OBJECT
        const newResume = {
            id: resumeId,
            title,
            lastEdited: new Date().toISOString().split("T")[0],
            image: null,
            pdfBase64,
            docxBase64,
            jobGoal: "nothing yet!",
            biography: ["nothing", "nothing", "nothing", "nothing", "nothing", "nothing"], 
            academics: ["nothing", "nothing", "nothing", "nothing"], 
            projects: "nothing", 
            workExperience: "nothing",
            skills: ["nothing", "nothing", "nothing"] 
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
                
                <ResumeList resumes={resumes} setResumes={setResumes} username={username}/>
            </div>
        </div>
    );
}



  