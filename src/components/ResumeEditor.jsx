import React, {useState, useRef, useEffect} from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { useParams } from 'react-router';
import { getDatabase, ref, set } from 'firebase/database';
import { EditorButtons, GenerateButtons, MultiEditorButtons } from './ResumeButtons';
import { Document, Page, pdfjs} from 'react-pdf';
import { Document as DocxDocument, Packer, Paragraph, TextRun } from 'docx';
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import { saveAs } from 'file-saver';
import { blobToBase64, generatePdfFromDocx, base64ToBlob } from './Utils';
import { ChatScreen } from './ResumeAI.jsx';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;


export function ResumeEditor({ resumes, setResumes, username }) {
    const { id } = useParams();
    const [resume, setResume] = useState(null); 
    const [numPages, setNumPages] = useState(null);
    const [pdfUrl, setPdfUrl] = useState(null);
    const [docxUrl, setDocxUrl] = useState(null);
    const [docxBlob, setDocxBlob] = useState(null);
    const [reloadTrigger, setReloadTrigger] = useState(0);
    // Edit Buttons
    const [job, setJob] = useState(""); 
    const [biography, setBiography] = useState(""); 
    const [academics, setAcademics] = useState(""); 
    const [projects, setProjects] = useState("");
    const [workExperience, setWorkExperience] = useState("");
    const [skills, setSkills] = useState("");

    // Prompts
    const [userPrompt, setUserPrompt] = useState(null);
    const [messages, setMessages] = useState([{text:"example message"}]);

    // DECODE + LOAD RESUME
    useEffect(() => {
        const selectedResume = resumes.find((r) => r.id === id);
        if (selectedResume) {
            setResume(selectedResume);
            setJob(selectedResume.jobGoal);
            if (selectedResume.pdfBase64) {
                const pdfBlob = base64ToBlob(selectedResume.pdfBase64, "pdf");
                const pdfBlobUrl = URL.createObjectURL(pdfBlob);
                setPdfUrl(pdfBlobUrl);
            }
            if (selectedResume.docxBase64) {
                const docxBlob = base64ToBlob(selectedResume.docxBase64, "docx");
                setDocxBlob(docxBlob);
                const docxBlobUrl = URL.createObjectURL(docxBlob);
                setDocxUrl(docxBlobUrl);
            }
        } else {
            setResume(null);
            setPdfUrl(null);
            setDocxUrl(null);
            setDocxBlob(null);
        } return () => {
            if (pdfUrl) URL.revokeObjectURL(pdfUrl);
            if (docxUrl) URL.revokeObjectURL(docxUrl);
        };
    }, [id, resumes, reloadTrigger]);

    // TESTING
    useEffect(() => {
        if(resume){
            handleAddTextToDocx();
        }
    }, [biography, academics, skills])

    // prompt sender
    useEffect(() => {
        if (userPrompt) {
            sendPromptToGemini(userPrompt);
        }
    }, [userPrompt]);

    // SAVE RESUME
    const handleSaveResume = async () => {
        if (resume) {
            const updatedPdfBase64 = await generatePdfFromDocx(docxBlob);
            const updatedDocxBase64 = await blobToBase64(docxBlob);

            const updatedResume = { ...resume, pdfBase64: updatedPdfBase64, docxBase64: updatedDocxBase64, jobGoal: job };

            const db = getDatabase();
            const resumeRef = ref(db, `userData/${username}/resumes/${resume.id}`);
            set(resumeRef, updatedResume);

            setResumes(prevResumes => prevResumes.map(r => r.id === resume.id ? updatedResume : r));
        }
    };

    // UPLOAD RESUME

    const handleUploadResume = async () => {
        if (resume) {
            await handleSaveResume();
            const db = getDatabase();
            const updatedPdfBase64 = await generatePdfFromDocx(docxBlob);
            const uploadRef = ref(db, `resumeData/${"title: " + resume.id + " username: " + username}`);
            set(uploadRef, {
                pdfBase64: updatedPdfBase64,
                username: username,
                timestamp: Date.now()
            });
        }
    };

    // ADD TEXT TO DOCX
    const handleAddTextToDocx = async () => {
        if (!docxBlob) return;
        const originalPdfUrl = pdfUrl;  
        try {
            setPdfUrl(null); // trigger the loading indicator
            const templateResponse = await fetch('/template_formatted.docx');
            const templateArrayBuffer = await templateResponse.arrayBuffer();
            const templateBlob = new Blob([templateArrayBuffer], { 
                type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' 
            });
            const arrayBuffer = await templateBlob.arrayBuffer();
            const zip = new PizZip(arrayBuffer);
            const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true });
        
            doc.render({
                // BIOGRAPHY
                First: biography[0] || "First",
                Last: biography[1] || "Last",
                PhoneNumber: biography[2] || "Phone Number",
                Email: biography[3] || "Email",
                LinkedIn: biography[4] || "LinkedIn",
                Github: biography[5] || "Github",
                // ACADEMICS
                University: academics[0] || "Enter your university...",
                Degree: academics[1] || "Enter your degree name...",
                GPA: academics[2] || "Enter your GPA...",
                Classes: academics[3] || "Enter your relevant coursework...",
                // EXPERIENCE
                Experience: workExperience || "Enter your work experience...",
                // PROJECTS
                Projects: projects || "Enter your projects...",
                // SKILLS
                Languages: skills[0] || "Enter your languages (ex. Python)...",
                DeveloperTools: skills[1] || "Enter your developer tools (ex. React)...",
                Concepts: skills[2] || "Enter your concepts (ex. Agile Methodology)..."
            });
        
            const updatedBlob = new Blob([doc.getZip().generate({ type: 'arraybuffer' })], {
                type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            });
            setDocxBlob(updatedBlob);
            const updatedDocxBase64 = await blobToBase64(updatedBlob);
            const updatedPdfBase64 = await generatePdfFromDocx(updatedBlob);
            if (!updatedPdfBase64 || !updatedDocxBase64) {
                throw new Error("Failed to generate PDF or DOCX base64");
            }
            const pdfBlob = await base64ToBlob(updatedPdfBase64, "pdf");
            const newPdfUrl = URL.createObjectURL(pdfBlob);
            setPdfUrl(newPdfUrl);
            const updatedResume = { 
                ...resume, 
                pdfBase64: updatedPdfBase64, 
                docxBase64: updatedDocxBase64 
            };
            setResumes(prevResumes => prevResumes.map(r => r.id === resume.id ? updatedResume : r));
            console.log("PDF and DOCX updated successfully");
        } catch (error) {
            console.error("Error generating PDF:", error);
            setPdfUrl(originalPdfUrl);
        }
    };

    

    // ERROR IF NO RESUME
    if (!resume) {
        return <p>Resume not found!</p>;
    }

    // LOAD PAGE #
    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
    }

    const handleGenerateQualityScore = () => {
        return "Generate a score out of 10 for the following resume";
    }

    // debugging
    const Classes = "What classes should i take to be a software engineer?";
    
    // generate button handlers
    const handleGenerateClasses = () => {
        setUserPrompt("classes for software engineer");
    };

    const handleGenerateProjects = () => {
        setUserPrompt("projects for software engineer");
    };

    // SUBTEXTS
    const bioSubtext = `Fill in First Name, Last Name, Phone Number, Email, LinkedIn, and Github.
    \nCurrent:\nFirst Name: ${biography[0]}\nLast Name: ${biography[1]}\nPhone Number: ${biography[2]}\nEmail: ${biography[3]}\nLinkedIn: ${biography[4]}\nGithub: ${biography[5]}`;
    const academicsSubtext = `Fill in University, Degree, GPA, and Relevant Classes.
    \nCurrent:\nUniversity: ${academics[0]}\nDegree: ${academics[1]}\nGPA: ${academics[2]}\nClasses: ${academics[3]}`;
    const skillsSubtext = `Fill in Languages, Developer Tools, and Concepts.
    \nCurrent:\nLanguages: ${skills[0]}\nDeveloper Tools: ${skills[1]}\nConcepts: ${skills[2]}`;

    
    // AI STUFF

    // useEffect() and sendPromptToGemini was coded with the assistance of claude.ai
    // it was to understand and learn how to implement AI chat prompts
    // into the webpage.


    const addMessage = (messageText) => {
        const newMessage = {text: messageText}
        setMessages((prevMessages) => [...prevMessages, newMessage]);
    }
    
    const sendPromptToGemini = async (prompt) => {
        if (!prompt) return;

        try {
            const genAI = new GoogleGenerativeAI("AIzaSyALULJ4WeAf7y-p5Xc_rai0Z5jDGLtndc4", { apiVersion: "v1" });
            const model = genAI.getGenerativeModel({ model: "gemini-pro" });

            console.log(genAI);
            console.log(model);
            console.log(prompt);
            
            const result = await model.generateContent({
                contents: [{parts: [{ text: prompt }]}] });
            
            console.log("RESULT IS:", result);
            
            if (result.response) {
                const responseText = result.response.text();
                addMessage(responseText);
            } else {
                addMessage("No response received from AI");
            }
        } catch (error) {
            console.error("Error details:", error );
            addMessage("Failed to get AI response: " + (error.message || "Unknown error"));
        }
    };

    return (
        <div>
            <h1 className="pt-4">{resume.title}</h1>
            <div className="editDesktop">
                <div className='d-flex justify-content-between'>
                    <div className='button-container'>
                        <EditorButtons name="Edit Job Goal" modalName="Landing what kind of job is your goal for this resume? (be as specific as you like!)" subtext={`Current: ${job}`} onSave={setJob}/>
                        <MultiEditorButtons name="Edit Biography" modalName="Edit Biography" subtext={bioSubtext} onSave={setBiography} numPrompts={6}/>
                        <MultiEditorButtons name="Edit Academics" modalName="Edit Academics" subtext={academicsSubtext} onSave={setAcademics} numPrompts={4}/>
                        <EditorButtons name="Edit Work Experience" modalName="Edit Work Experience" subtext={workExperience} onSave={setWorkExperience}/>
                        <EditorButtons name="Edit Projects" modalName="Edit Projects" subtext={projects} onSave={setProjects}/>
                        <MultiEditorButtons name="Edit Skills" modalName="Edit Skills" subtext={skillsSubtext} onSave={setSkills} numPrompts={3}/>
                        <button className="button" onClick={handleSaveResume}>Save Changes</button>
                    </div>  

                    <div className="resume-editor d-flex">
                        <div className="card p-3 mt-3 shadow-lg" style={{ width: "40rem" }}>
                            <h5 className="card-title text-center">Resume Preview</h5>
                            <div className="card-body d-flex justify-content-center">
                                <Document
                                    file={pdfUrl}
                                    onLoadSuccess={onDocumentLoadSuccess}
                                    loading={<p>Loading PDF...</p>}
                                    error={<p>Failed to load PDF. Please ensure the file exists.</p>}
                                >
                                    <Page 
                                        pageNumber={1} 
                                        width={600} 
                                        renderTextLayer={false}
                                        renderAnnotationLayer={false}
                                    />
                                </Document>
                            </div>
                            {numPages && (
                                <div className="text-center mt-2">
                                    Page 1 of {numPages}
                                </div>
                            )}
                            <button className="reload-button mt-3" onClick={() => setReloadTrigger(prev => prev + 1)}>Reload</button>
                        </div>  
                    </div>

                    <div className='button-container'>
                        <GenerateButtons editName="Generate Class Recs" onClick={handleGenerateClasses} messages={messages}/>
                        <GenerateButtons editName="Generate Project Ideas" onClick={handleGenerateProjects} messages={messages}/>
                        <GenerateButtons editName="AI Quality Score" onClick={handleGenerateQualityScore} messages={messages}/>
                        <GenerateButtons editName="Open Chatpage" onClick={() => {}} />
                        <button className="button" onClick={() => window.open(pdfUrl, '_blank')}> Download Resume </button>
                        <button className="button" onClick={handleUploadResume}> Upload Resume </button>                    
                    </div>
                </div>
            </div>

            {/* WILL REENABLE MOBILE SCREEN AFTER FIXING AI*/}

            {/* <div className="editMobile">
                <div className="resume-editor d-flex justify-content-center">
                    <div className="card p-3 mt-3 shadow-lg" style={{ width: "40rem" }}>
                        <h5 className="card-title text-center">Resume Preview</h5>
                        <div className="card-body d-flex justify-content-center">
                            <Document
                                file={pdfUrl}
                                onLoadSuccess={onDocumentLoadSuccess}
                                loading={<p>Loading PDF...</p>}
                                error={<p>Failed to load PDF. Please ensure the file exists.</p>}
                            >
                                <Page 
                                    pageNumber={1} 
                                    width={600} 
                                    renderTextLayer={false}
                                    renderAnnotationLayer={false}
                                />
                            </Document>
                        </div>
                        {numPages && (
                            <div className="text-center mt-2">
                                Page 1 of {numPages}
                            </div>
                        )}
                    </div>
                </div>
                <div className="d-flex justify-content-center">
                    <div className='button-container'>
                        <EditorButtons name="Edit Biography" modalName="Edit Biography" subtext={biography} onSave={setBiography}/>
                        <EditorButtons name="Edit Work Experience" modalName="Edit Work Experience" subtext={workExperience} onSave={setWorkExperience}/>
                        <EditorButtons name="Edit Projects" modalName="Edit Projects" subtext={projects} onSave={setProjects}/>
                        <EditorButtons name="Edit Skills" modalName="Edit Skills" subtext={skills} onSave={setSkills}/>
                        <button className="button" onClick={handleSaveResume}>Save Changes</button>
                    </div>
                    <div className='button-container'>
                        <GenerateButtons editName="Generate Class Recs" onClick={handleGenerateClasses}/>
                        <GenerateButtons editName="Generate Project Ideas" onClick={handleGenerateProjects}/>
                        <GenerateButtons editName="AI Quality Score" onClick={handleGenerateQualityScore}/>
                        <button className="button" onClick={() => window.open(resume.pdfUrl, '_blank')}> Download Resume </button>                    
                    </div>
                </div>
            </div> */}
        </div>
    );
}