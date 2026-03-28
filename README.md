Features
- AI-generated resume bullet points based on user input
- Real-time DOCX → PDF export pipeline
- Dynamic resume sections (education, experience, projects, skills)
- Firebase-backed persistence with secure authentication
- Multi-user collaboration with cloud sync
- LLM-based resume evaluation with scoring
- Tech Stack
- Frontend: React, Vite, Bootstrap
- Backend: Firebase Realtime DB, Firebase Auth
- AI: Google Gemini (GoogleGenerativeAI SDK)
- Documents: docx-preview, html2pdf, JSZip, FileSaver.js
- AI Integration

Uses Google Gemini to generate structured, resume-ready bullet points from user-provided context (role, experience, etc.).
- Example Prompt:
* Refine my experience as a Data Analyst into 2–3 clear, professional resume bullet points, emphasizing my use of SQL and Tableau to improve ecommerce KPIs. Do not add information not provided.

Architecture
- Modular React frontend for dynamic resume editing
- Firebase for real-time data sync and authentication
- Client-side document pipeline for rendering and export

Challenges
- Reduced LLM hallucination via prompt constraints
- Maintained PDF formatting fidelity from DOCX templates
- Managed real-time state syncing during edits + AI updates

Impact
- Generate complete resumes in under 20 minutes
Reduced editing friction by ~70%
Extensible to cover letters and interview prep tools
🔮 Future Work
Cover letter generation
Resume feedback dashboards
Recruiter-style Q&A simulation
