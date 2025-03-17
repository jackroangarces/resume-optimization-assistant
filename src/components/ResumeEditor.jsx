import React, {useState, useRef, useEffect} from 'react';
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
    // Use States for Resume Items
    const [languages, setLanguages] = useState("");
    const [developerTools, setDeveloperTools] = useState("");
    const [concepts, setConcepts] = useState("");

    // Prompts
    const [userPrompt, setUserPrompt] = useState(null);

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

    // TESTING
    useEffect(() => {
        if(resume){
            handleAddTextToDocx();
        }
    }, [languages, skills])

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
                Biography: biography || "Enter your biography...",
                Experience: workExperience || "Enter your work experience...",
                Projects: projects || "Enter your projects...",
                Skills: skills || "Enter your skills...",
                Languages: skills[0] || "Enter your languages...",
                DeveloperTools: skills[1] || "Enter your languages...",
                Concepts: skills[2] || "Enter your languages..."
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
        setUserPrompt("What classes should i take to be a software engineer?")
    };

    const handleGenerateProjects = () => {
        setUserPrompt("What personal projects can i work on to improve my software engineering skills?")
    };

    // SUBTEXTS
    const skillsSubtext = `Fill in Languages, Developer Tools, and Concepts.\nCurrent:\nLanguages: ${skills[0]}\nDeveloper Tools: ${skills[1]}\nConcepts: ${skills[2]}`;

    return (
        <div>
            <h1 className="pt-4">{resume.title}</h1>
            <div className="editDesktop">
                <div className='d-flex justify-content-between'>
                    <div className='button-container'>
                        <EditorButtons name="Edit Job Goal" modalName="Landing what kind of job is your goal for this resume? (be as specific as you like!)" subtext={`Current: ${job}`} onSave={setJob}/>
                        <EditorButtons name="Edit Biography" modalName="Edit Biography" subtext={languages} onSave={setLanguages}/>
                        <EditorButtons name="Edit Academics" modalName="Edit Academics" subtext={academics} onSave={setAcademics}/>
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
                        <GenerateButtons editName="Generate Class Recs" onClick={handleGenerateClasses} />
                        <GenerateButtons editName="Generate Project Ideas" onClick={handleGenerateProjects}/>
                        <GenerateButtons editName="AI Quality Score" onClick={handleGenerateQualityScore}/>
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