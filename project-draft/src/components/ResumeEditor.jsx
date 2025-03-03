import React, {useState} from 'react';
import { useParams } from 'react-router';
import { EditorButtons, GenerateButtons } from './ResumeButtons';
import { Document, Page, pdfjs} from 'react-pdf';
import {ChatScreen} from './ResumeAi.jsx';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;


export function ResumeEditor({ resumes, setResumes }) {
    const { id } = useParams();
    const resume = resumes.find(resume => resume.id === parseInt(id));
    const [numPages, setNumPages] = useState(null);
    const pdfUrl = "/swe-resume-template.pdf";

    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
    }

    if (!resume) {
        return <p>Resume not found!</p>;
    }

    return (
        <div>
            <h1 className="pt-4">{resume.title}</h1>
            <div className='d-flex justify-content-between'>
                <div className='button-container'>
                    <EditorButtons name="Edit Biography" />
                    <EditorButtons name="Edit Work Experience" />
                    <EditorButtons name="Edit Projects" />
                    <EditorButtons name="Edit Skills" />
                </div>

                {/* Resume Preview Card */}
                <div className="resume-editor d-flex">
                    <div className="card p-3 mt-3 shadow-lg" style={{ width: "50rem" }}>
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
                    <GenerateButtons editName="Generate Class Recs" />
                    <GenerateButtons editName="Generate Project Ideas" />
                    <GenerateButtons editName="AI Quality Score" />
                    <button className="button" onClick={() => window.open(pdfUrl, '_blank')}> Download Resume </button>
                </div>
            </div>
        </div>
    );
}