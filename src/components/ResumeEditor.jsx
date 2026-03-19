import React, {useState, useRef, useEffect} from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { useParams } from 'react-router';
import { getDatabase, ref, set } from 'firebase/database';
import { EditorButtons, GenerateButtons, MultiEditorButtons, PrivacyPopUp } from './ResumeButtons';
import { Document, Page, pdfjs} from 'react-pdf';
import { Document as DocxDocument, Packer, Paragraph, TextRun } from 'docx';
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import { saveAs } from 'file-saver';
import { blobToBase64, generatePdfFromDocx, base64ToBlob } from './Utils';


// json
// AI was used to format the classes into JSON
import courses from '../data/classes.json'

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
    const [projects, setProjects] = useState({
        name: [],
        skills: [],
        description: []
    });
    const [workExperience, setWorkExperience] = useState({
        company: [],
        role: [],
        description: []
    });
    const [skills, setSkills] = useState("");
    // Prompts
    const [userPrompt, setUserPrompt] = useState(null);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);


    // SET UP STATE VARS
    useEffect(() => {
        const selectedResume = resumes.find((r) => r.id === id);
        if (selectedResume) {    
            setJob(selectedResume.jobGoal);
            setBiography(selectedResume.biography);
            setAcademics(selectedResume.academics);
            setProjects(selectedResume.projects);
            setWorkExperience(selectedResume.workExperience);
            setSkills(selectedResume.skills);
        };
    }, []);

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
        } return () => {
            if (pdfUrl) URL.revokeObjectURL(pdfUrl);
            if (docxUrl) URL.revokeObjectURL(docxUrl);
        };
    }, [id, resumes, reloadTrigger]);

    // LISTEN FOR ADDING TEXT
    useEffect(() => {
        if(resume){
            handleAddTextToDocx();
        }
    }, [biography, academics, skills, projects, workExperience])

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

            const updatedResume = { ...resume, pdfBase64: updatedPdfBase64, docxBase64: updatedDocxBase64, 
                jobGoal: job, biography: biography, academics: academics, projects: projects, workExperience: workExperience, skills: skills };

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
                timestamp: new Date().toISOString().split("T")[0],
                jobObtained: job
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

            let formattedWorkExperience = "Enter your work experience...";
                if (workExperience && workExperience.company && workExperience.company.length > 1) {
                    formattedWorkExperience = workExperience.company.slice(1).map((company, index) => {
                    const workExperienceRole = workExperience.role[index + 1] || "";  
                    const workExperienceDescription = workExperience.description[index + 1] || "";
                    return `${company} | ${workExperienceRole}\n• ${workExperienceDescription}`;
                }).join('\n\n');
            }

            let formattedProjects = "Enter your projects...";
            if (projects && projects.name && projects.name.length > 1) {
                formattedProjects = projects.name.slice(1).map((name, index) => {
                    const projectSkills = projects.skills[index + 1] || "";
                    const projectDescription = projects.description[index + 1] || "";
                    return `${name} | ${projectSkills}\n• ${projectDescription}`;
                }).join('\n\n');
            }
        
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
                Experience: formattedWorkExperience || "Enter your work experience...",
                // PROJECTS
                Projects: formattedProjects  || "Enter your projects...",
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
    
    const handleGenerateQualityScore = async () => {
        const projectString = projects.name
        .map((name, index) => {
            const skills = projects.skills[index];
            const description = projects.description[index];
            return `${index + 1}. Name: ${name} | Skills: ${skills} | Description: ${description}`;
        })
        const workString = workExperience.company
        .map((company, index) => {
            const role = workExperience.role[index];
            const description = workExperience.description[index];
            return `${index + 1}. Company: ${company} | Role: ${role} | Description: ${description}`;
        })
        const prompt = `please give me a score from 1-10 based off
                        my resume ${resume.biography} ${resume.academics} ${projectString} ${workString} ${resume.skills}`;
        setUserPrompt(prompt);
    }

    const handleGenerateProjects = () => {
        const projectString = projects.name
        .map((name, index) => {
            const skills = projects.skills[index];
            const description = projects.description[index];
            return `${index + 1}. Name: ${name} | Skills: ${skills} | Description: ${description}`;
        })
    .join(' ');
        const prompt = `based off my current project ${projectString}
                        and my current skillset ${skills},
                        give me 3 example projects i could do to help
                        me become a ${job}`
        setUserPrompt(prompt);
    }
    

    // generate button handlers
    const handleGenerateClasses = () => {
        const classes = JSON.stringify(courses);
        console.log(classes);
        const prompt = `ive taken these classes ${academics},
                        give me 3 classes to take in ${classes}
                        based off me wanting a career in ${job}
                        format your answer as a list.`;

        setUserPrompt(prompt);
    };

    // ADD PROJECT
    const handleAddProject = (newProjectData) => {
        if (!newProjectData || newProjectData.length < 3) {
            console.error("Invalid project data:", newProjectData);
            return;
        }
        const [name, skills, description] = newProjectData;
        setProjects((prevProjects) => ({
            name: [...prevProjects.name, name],
            skills: [...prevProjects.skills, skills],
            description: [...prevProjects.description, description]
        }));
    };

    // ADD WORK EXPERIENCE
    const handleAddWork = (newWorkData) => {
        if (!newWorkData || newWorkData.length < 3) {
            console.error("Invalid work experience data:", newWorkData);
            return;
        }
        const [company, role, description] = newWorkData;
        setWorkExperience((prevWork) => ({
            company: [...prevWork.company, company],
            role: [...prevWork.role, role],
            description: [...prevWork.description, description]
        }));
    };

    // DELETE PROJECT
    function handleDeleteProject() {
        if (projects && projects.name && projects.name.length > 1) {
            setProjects((prevProjects) => ({
                name: prevProjects.name.slice(0, -1),
                skills: prevProjects.skills.slice(0, -1),
                description: prevProjects.description.slice(0, -1),
            }));
        } else {
            console.log("Cannot delete, there must be at least one project.");
        }
    }

    // DELETE WORK EXPERIENCE
    function handleDeleteWorkExperience() {
        if (workExperience && workExperience.company && workExperience.company.length > 1) {
            setWorkExperience((prevWork) => ({
                company: prevWork.company.slice(0, -1), 
                role: prevWork.role.slice(0, -1),
                description: prevWork.description.slice(0, -1)
            }));
        } else {
            console.log("Cannot delete, there must be at least one work experience.");
        }
    }

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
    
    const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
    const sendPromptToGemini = async (prompt) => {
        if (!prompt) return;

        try {
            setLoading(true);
            const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
            
            const result = await model.generateContent(prompt);
            
            if (result.response) {
                const responseText = result.response.text();
                addMessage(responseText);
                setLoading(false);
            } else {
                addMessage("No response received from AI");
                setLoading(false);
            }
        } catch (error) {
            console.error("Error details:", error );
            addMessage("Failed to get AI response: " + (error.message || "Unknown error"));
            setLoading(false);
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
                        <MultiEditorButtons name="Add Work Experience" modalName="Add Work Experience" subtext={"Fill in Company, Role, and Job Description"} onSave={(value) => handleAddWork(value)} numPrompts={3}/>
                        <button className="button" onClick={handleDeleteWorkExperience}>Delete Recent Work Experience</button>
                        <MultiEditorButtons name="Add Project" modalName="Add Project" subtext={"Fill in Project Name, Skills, and Project Description"} onSave={(value) => handleAddProject(value)} numPrompts={3}/>
                        <button className="button" onClick={handleDeleteProject}>Delete Recent Project</button>
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
                        <PrivacyPopUp /> {/* changed generate project ideas temporarily for testing */}
                        <GenerateButtons editName="Generate Class Recs" onClick={handleGenerateClasses} messages={messages} loading={loading}/>
                        <GenerateButtons editName="Generate Project Ideas" onClick={handleGenerateProjects} messages={messages} loading={loading}/>
                        <GenerateButtons editName="AI Quality Score" onClick={handleGenerateQualityScore} messages={messages} loading={loading}/>
                        <GenerateButtons editName="Open Chatpage" onClick={() => {}} messages={messages} />
                        <button className="button" onClick={() => window.open(pdfUrl, '_blank')}> Download Resume </button>
                        <button className="button" onClick={handleUploadResume}> Upload Resume </button>                    
                    </div>
                </div>
            </div>

            {/* WILL REENABLE MOBILE SCREEN AFTER FIXING AI*/}

            <div className='editMobile'>
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
                                    width={400} 
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
                <div className="d-flex justify-content-center">
                    <div className='button-container'>
                        <EditorButtons name="Edit Job Goal" modalName="Landing what kind of job is your goal for this resume? (be as specific as you like!)" subtext={`Current: ${job}`} onSave={setJob}/>
                        <MultiEditorButtons name="Edit Biography" modalName="Edit Biography" subtext={bioSubtext} onSave={setBiography} numPrompts={6}/>
                        <MultiEditorButtons name="Edit Academics" modalName="Edit Academics" subtext={academicsSubtext} onSave={setAcademics} numPrompts={4}/>
                        <MultiEditorButtons name="Add Work Experience" modalName="Add Work Experience" subtext={"Fill in Company, Role, and Job Description"} onSave={(value) => handleAddWork(value)} numPrompts={3}/>
                        <button className="button" onClick={handleDeleteWorkExperience}>Delete Recent Work Experience</button>
                        <MultiEditorButtons name="Add Project" modalName="Add Project" subtext={"Fill in Project Name, Skills, and Project Description"} onSave={(value) => handleAddProject(value)} numPrompts={3}/>
                        <button className="button" onClick={handleDeleteProject}>Delete Recent Project</button>
                        <MultiEditorButtons name="Edit Skills" modalName="Edit Skills" subtext={skillsSubtext} onSave={setSkills} numPrompts={3}/>
                        <button className="button" onClick={handleSaveResume}>Save Changes</button>
                    </div> 
                    <div className='button-container'>
                        <PrivacyPopUp />
                        <GenerateButtons editName="Generate Class Recs" onClick={handleGenerateClasses} messages={messages} loading={loading}/>
                        <GenerateButtons editName="Generate Project Ideas" onClick={handleGenerateProjects} messages={messages} loading={loading}/>
                        <GenerateButtons editName="AI Quality Score" onClick={handleGenerateQualityScore} messages={messages} loading={loading}/>
                        <GenerateButtons editName="Open Chatpage" onClick={() => {}} messages={messages} />
                        <button className="button" onClick={() => window.open(pdfUrl, '_blank')}> Download Resume </button>
                        <button className="button" onClick={handleUploadResume}> Upload Resume </button>                    
                    </div>
                </div>
            </div>
        </div>
    );
}