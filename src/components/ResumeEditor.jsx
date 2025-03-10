import React, {useState, useRef, useEffect} from 'react';
import { useParams } from 'react-router';
import { EditorButtons, GenerateButtons } from './ResumeButtons';
import { Document, Page, pdfjs} from 'react-pdf';
import { ChatScreen } from './ResumeAI.jsx';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;


export function ResumeEditor({ resumes, setResumes }) {
    const { id } = useParams();
    const resume = resumes.find(resume => resume.id === parseInt(id));
    const [numPages, setNumPages] = useState(null);
    let pdfUrl = null;
    if(resume.pdfUrl) {
        pdfUrl = resume.pdfUrl;
    } else {
        pdfUrl = "/swe-resume-template.pdf";
    }
    const [biography, setBiography] = useState("");
    const [projects, setProjects] = useState("");
    const [workExperience, setWorkExperience] = useState("");
    const [skills, setSkills] = useState("");
    // Reference to ChatScreen
    const chatScreenRef = useRef(null);

    // DECODE + LOAD RESUME
    useEffect(() => {
        const selectedResume = resumes.find((r) => r.id === id);
        
        if (selectedResume) {
            setResume(selectedResume);
            
            // Convert base64 PDF to Blob URL
            if (selectedResume.pdfBase64) {
                const pdfBlob = base64ToBlob(selectedResume.pdfBase64);
                const pdfBlobUrl = URL.createObjectURL(pdfBlob);
                setPdfUrl(pdfBlobUrl);
            }
            
            // Convert base64 DOCX to Blob URL
            if (selectedResume.docxBase64) {
                const docxBlob = base64ToBlob(selectedResume.docxBase64);
                const docxBlobUrl = URL.createObjectURL(docxBlob);
                setDocxUrl(docxBlobUrl);
            }

        } else {
            setResume(null);
            setPdfUrl(null);
            setDocxUrl(null);
        }
        
        return () => {
            if (pdfUrl) URL.revokeObjectURL(pdfUrl);
            if (docxUrl) URL.revokeObjectURL(docxUrl);
        };
    }, [id, resumes]);

    // CONVERT BASE64 TO BLOB
    const base64ToBlob = (base64Data) => {
        const base64Content = base64Data.includes('base64,') 
            ? base64Data.split('base64,')[1] 
            : base64Data;
        
        let contentType = 'application/octet-stream';
        if (base64Data.includes('data:')) {
            contentType = base64Data.split(';')[0].split(':')[1];
        }
        const byteCharacters = atob(base64Content);
        const byteArrays = [];
        for (let offset = 0; offset < byteCharacters.length; offset += 512) {
            const slice = byteCharacters.slice(offset, offset + 512);
            const byteNumbers = new Array(slice.length);
            for (let i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
        }
        return new Blob(byteArrays, { type: contentType });
    };

    if (!resume) {
        return <p>Resume not found!</p>;
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

    }


    return (
        <div>
            <h1 className="pt-4">{resume.title}</h1>
            <div className="editDesktop">
                <div className='d-flex justify-content-between'>
                    <div className='button-container'>
                        <EditorButtons name="Edit Biography" modalName="Edit Biography" subtext={biography} onSave={setBiography}/>
                        <EditorButtons name="Edit Work Experience" modalName="Edit Work Experience" subtext={workExperience} onSave={setWorkExperience}/>
                        <EditorButtons name="Edit Projects" modalName="Edit Projects" subtext={projects} onSave={setProjects}/>
                        <EditorButtons name="Edit Skills" modalName="Edit Skills" subtext={skills} onSave={setSkills}/>
                    </div>

                    {/* Resume Preview Card */}
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
                    </div>
                    <div className='button-container'>
                        <GenerateButtons editName="Generate Class Recs" onClick={handleGenerateClasses}/>
                        <GenerateButtons editName="Generate Project Ideas" onClick={handleGenerateProjects}/>
                        <GenerateButtons editName="AI Quality Score" onClick={handleGenerateQualityScore}/>
                        <button className="button" onClick={() => window.open(pdfUrl, '_blank')}> Download Resume </button>                    
                    </div>
                </div>
            </div>
        </div>
    );
}