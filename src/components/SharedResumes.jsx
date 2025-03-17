import React, { useEffect, useState } from 'react';
import { getDatabase, ref, get } from 'firebase/database';

export function SharedResumes() {
    const [resumes, setResumes] = useState([]);

    useEffect(() => {
        const fetchResumes = async () => {
            const db = getDatabase();
            const resumesRef = ref(db, "resumeData"); // Fetch all resumes
            const snapshot = await get(resumesRef);

            if (snapshot.exists()) {
                const resumeArray = Object.entries(snapshot.val()).map(([id, resume]) => ({
                    id,
                    title: resume.title,
                    pdfBase64: resume.pdfBase64
                }));
                setResumes(resumeArray);
            } else {
                console.log("No resumes found.");
            }
        };

        fetchResumes();
    }, []);

    return (
        <div>
            <h1>Shared Resumes</h1>
            <ul>
                {resumes.map((resume) => (
                    <li key={resume.id}>
                        <a href={resume.pdfBase64} target="_blank" rel="noopener noreferrer">
                            {resume.title}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
}
