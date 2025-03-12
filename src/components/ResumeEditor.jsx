import React, {useState, useRef, useEffect} from 'react';
import { useParams } from 'react-router';
import { getDatabase, ref, set } from 'firebase/database';
import { EditorButtons, GenerateButtons } from './ResumeButtons';
import { Document, Page, pdfjs} from 'react-pdf';
import { Document as DocxDocument, Packer, Paragraph, TextRun } from 'docx';
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import { saveAs } from 'file-saver';
import { blobToBase64, generatePdfFromDocx } from './Utils';
import { ChatScreen } from './ResumeAI.jsx';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;


export function ResumeEditor({ resumes, setResumes, username }) {
    const { id } = useParams();
    const [resume, setResume] = useState(null); 
    const [numPages, setNumPages] = useState(null);
    const [pdfUrl, setPdfUrl] = useState(null);
    const [docxUrl, setDocxUrl] = useState(null);
    const [docxBlob, setDocxBlob] = useState(null);
    // Edit Buttons
    const [biography, setBiography] = useState(""); 
    const [projects, setProjects] = useState("");
    const [workExperience, setWorkExperience] = useState("");
    const [skills, setSkills] = useState("");
    // Use States for Resume Items
    const [languages, setLanguages] = useState("");
    const [developerTools, setDeveloperTools] = useState("");
    const [concepts, setConcepts] = useState("");
    // Reference to ChatScreen
    const chatScreenRef = useRef(null);
    // Template Blob

    // DECODE + LOAD RESUME
    useEffect(() => {
        const selectedResume = resumes.find((r) => r.id === id);
        if (selectedResume) {
            setResume(selectedResume);
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
        }

        
        
        return () => {
            if (pdfUrl) URL.revokeObjectURL(pdfUrl);
            if (docxUrl) URL.revokeObjectURL(docxUrl);
        };
    }, [id, resumes]);

    // SAVE RESUME
    const handleSaveResume = async () => {
        if (resume) {
            const updatedPdfBase64 = await generatePdfFromDocx(docxBlob);
            const updatedDocxBase64 = await blobToBase64(docxBlob);

            const updatedResume = { ...resume, pdfBase64: updatedPdfBase64, docxBase64: updatedDocxBase64 };

            const db = getDatabase();
            const resumeRef = ref(db, `userData/${username}/resumes/${resume.id}`);
            set(resumeRef, updatedResume);

            setResumes(prevResumes => prevResumes.map(r => r.id === resume.id ? updatedResume : r));
        }
    };

    // TESTING
    useEffect(() => {
        if(languages){
            handleAddTextToDocx();
        }
    }, [languages])

    // ADD TEXT TO DOCX
    const handleAddTextToDocx = async () => {
        if (!docxBlob) return;
        const templateResponse = await fetch('/template_formatted.docx');
        const templateArrayBuffer = await templateResponse.arrayBuffer();
        const templateBlob = new Blob([templateArrayBuffer], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
        const arrayBuffer = await templateBlob.arrayBuffer();
        const zip = new PizZip(arrayBuffer);
        const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true });
    
        doc.render({
            Biography: biography || "Enter your biography...",
            Experience: workExperience || "Enter your work experience...",
            Projects: projects || "Enter your projects...",
            Skills: skills || "Enter your skills...",
            Languages: languages.toString() || "Enter your languages..."
        });
    
        const updatedBlob = new Blob([doc.getZip().generate({ type: 'arraybuffer' })], {
            type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        });
        setDocxBlob(updatedBlob);
        const updatedDocxBase64 = await blobToBase64(updatedBlob);
        const updatedPdfBase64 = await generatePdfFromDocx(updatedBlob);
        const pdfBlob = base64ToBlob(updatedPdfBase64, "pdf");
        const newPdfUrl = URL.createObjectURL(pdfBlob);
        setPdfUrl(newPdfUrl);
        const updatedResume = { 
            ...resume, 
            pdfBase64: updatedPdfBase64, 
            docxBase64: updatedDocxBase64 
        };
        setResumes(prevResumes => prevResumes.map(r => r.id === resume.id ? updatedResume : r));
    };

    // CONVERT BASE64 TO BLOB
    const base64ToBlob = (base64Data, type) => {
        const base64Content = base64Data.split('base64,')[1];
        const byteCharacters = atob(base64Content) ;
        const byteArrays = [];
        for (let offset = 0; offset < byteCharacters.length; offset += 512) {
            const slice = byteCharacters.slice(offset, offset + 512);
            const byteNumbers = Array.from(slice).map(char => char.charCodeAt(0));
            const byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
        }
        if (type === "pdf") {
            return new Blob(byteArrays, { type: 'application/pdf' });
        } else {
            return new Blob(byteArrays, { type: 'application/docx' });
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
        if (chatScreenRef.current) {
            const resumeContent = resume.content;
            chatScreenRef.current.getAIQualityScore(resumeContent);
        }
    }
    
    // generate button handlers
    const handleGenerateClasses = () => {
        if (chatScreenRef.current) {
            chatScreenRef.current.handleGenerateClasses();
        }
    };

    const handleGenerateProjects = () => {
        if (chatScreenRef.current) {
            chatScreenRef.current.handleGenerateProjects();
        }
    };

    // ai quality score goes here
    const  generateQualityScore = async () => {
        /// ???
    }

    return (
        <div>
            <h1 className="pt-4">{resume.title}</h1>
            <div className="editDesktop">
                <div className='d-flex justify-content-between'>
                    <div className='button-container'>
                        <EditorButtons name="Edit Biography" modalName="Edit Biography" subtext={biography} onSave={setLanguages}/>
                        <EditorButtons name="Edit Work Experience" modalName="Edit Work Experience" subtext={workExperience} onSave={setWorkExperience}/>
                        <EditorButtons name="Edit Projects" modalName="Edit Projects" subtext={projects} onSave={setProjects}/>
                        <EditorButtons name="Edit Skills" modalName="Edit Skills" subtext={skills} onSave={setSkills}/>
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
                        </div>
                    </div>

                    <div className='button-container'>
                        <GenerateButtons editName="Generate Class Recs" onClick={handleGenerateClasses}/>
                        <GenerateButtons editName="Generate Project Ideas" onClick={handleGenerateProjects}/>
                        <GenerateButtons editName="AI Quality Score" onClick={handleGenerateQualityScore}/>
                        <button className="button" onClick={() => window.open(pdfUrl, '_blank')}> Download Resume </button>                    
                        <ChatScreen ref={chatScreenRef}/>
                    </div>
                </div>
            </div>
            <div className="editMobile">
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
            </div>
        </div>
    );
}