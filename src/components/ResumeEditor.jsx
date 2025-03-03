import React, {useState, useRef} from 'react';
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

    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
    }

    if (!resume) {
        return <p>Resume not found!</p>;
    }

    // reference to ChatScreen
    const chatScreenRef = useRef(null);
    
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

    return (
        <div>
            <h1 className="pt-4">{resume.title}</h1>
            <div className='d-flex justify-content-between'>
                <div className='button-container'>
                    <EditorButtons name="Edit Biography" modalName="Edit Biography" subtext={biography} onSave={setBiography}/>
                    <EditorButtons name="Edit Work Experience" modalName="Edit Work Experience" subtext={workExperience} onSave={setWorkExperience}/>
                    <EditorButtons name="Edit Projects" modalName="Edit Projects" subtext={projects} onSave={setProjects} />
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
                    <GenerateButtons editName="Generate Class Recs" onCLick={handleGenerateClasses}/>
                    <GenerateButtons editName="Generate Project Ideas" onCLick={handleGenerateProjects}/>
                    <GenerateButtons editName="AI Quality Score" />
                    <button className="button" onClick={() => window.open(pdfUrl, '_blank')}> Download Resume </button>                    
                    <ChatScreen ref={chatScreenRef}/>
                </div>
            </div>
        </div>
    );
}