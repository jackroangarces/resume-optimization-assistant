import React, { useEffect, useState } from "react";
import { getDatabase, ref, get } from "firebase/database";

export function SharedResumes() {
    const [resumes, setResumes] = useState([]);

    useEffect(() => {
        const fetchResumes = async () => {
            const db = getDatabase();
            const resumesRef = ref(db, "resumeData");
            const snapshot = await get(resumesRef);

            if (snapshot.exists()) {
                const resumesObject = snapshot.val();
                let resumeArray = Object.keys(resumesObject).map((key) => ({
                    id: key,
                    title: key.split("username:")[0].replace("title:", "").trim(),
                    pdfBase64: resumesObject[key].pdfBase64 || null,
                }));

                setResumes(resumeArray);
            } else {
                console.log("No resumes found.");
            }
        };

        fetchResumes();
    }, []);

    // **Function to Open PDF in a New Tab**
    const openPdf = (base64Data) => {
        if (!base64Data) return;
        const byteCharacters = atob(base64Data.split(",")[1]);
        const byteArray = new Uint8Array(new Array(byteCharacters.length).fill(0).map((_, i) => byteCharacters.charCodeAt(i)));

        const blob = new Blob([byteArray], { type: "application/pdf" });
        const blobUrl = URL.createObjectURL(blob);
        window.open(blobUrl, "_blank");
    };

    return (
        <>
            <div className="examples-page">
                <h1 className="page-title">Shared Resumes</h1>
                <p className="page-subtitle">
                    Browse resumes from professionals who have succeeded in the field.
                </p>
                <div className="templates-container">
                    {resumes.length === 0 ? (
                        <p>No resumes available.</p>
                    ) : (
                        resumes.map((resume) => (
                            <div key={resume.id} className="template-card w-50">
                                <button
                                    onClick={() => openPdf(resume.pdfBase64)}
                                    className="resume-button"
                                >
                                    <h2>{resume.title}</h2>
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </>
    );
}
