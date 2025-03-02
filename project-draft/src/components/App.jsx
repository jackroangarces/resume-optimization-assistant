import React, {useState} from 'react';
import { Routes, Route, Navigate } from 'react-router';
import { Navbar } from './Navbar.jsx';
import { Footer } from './Footer.jsx';
import { HomePage } from './StaticPages.jsx';
import { SignIn } from './SignIn.jsx';
import { MyResumes } from './MyResumes.jsx';
import { ResumeEditor } from './ResumeEditor.jsx';

import 'bootstrap/dist/css/bootstrap.min.css';
import '../index.css'
import { ExamplesPage } from './ExamplesPage.jsx';

function App(props) {


    // Global state variable for username 
    // (because its needed to access different user's resumes)  
    const [username, setUsername] = useState(null);

    // "login" function to set Global username from inside sign in 
    // component
    const login = (username) => {
      setUsername(username);
    };

    // simple logout that can be assigned to a button
    // (probably in the navbar)
    const logout = () => {
      setUsername(null);
    }

    const [resumes, setResumes] = useState([
      { id: 1, title: "Software Engineer Resume", lastEdited: "2025-02-25", image: null },
      { id: 2, title: "Data Scientist Resume", lastEdited: "2025-02-20", image: null },
    ]);
    {/* what is set in the state default is just sample resumes*/}

    return (
      <div>
        <Navbar username={username} logout={logout}/>
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<SignIn login={login}/>} />
            <Route path="/examples" element={<ExamplesPage />} />
            <Route path="*" element={<Navigate to="/"/>} /> {/* Catch-all for bad URLs */}
            <Route path="/myresumes/*" element={<MyResumes resumes={resumes} setResumes={setResumes} />} />
            <Route path="/resume/edit-resume/:id" element={<ResumeEditor resumes={resumes} setResumes={setResumes} />} />
          </Routes>
        </main>
        <Footer />
      </div>
    );
}

export default App;

