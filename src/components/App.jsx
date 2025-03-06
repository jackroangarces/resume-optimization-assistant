import React, {useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router';
import { getDatabase, ref, onValue, push, set } from 'firebase/database';
import { Navbar } from './Navbar.jsx';
import { Footer } from './Footer.jsx';
import { HomePage } from './StaticPages.jsx';
import { SignIn } from './SignIn.jsx';  
import { MyResumes } from './MyResumes.jsx';
import { ResumeEditor } from './ResumeEditor.jsx';
import { Register } from './Register.jsx';

import 'bootstrap/dist/css/bootstrap.min.css';
import '../index.css'
import { ExamplesPage } from './ExamplesPage.jsx';

function App(props) {

    // GET USERS AND UPDATE USERS
    const [users, setUsers] = useState([]);
    useEffect(() => {
      const db = getDatabase();
      const usersRef = ref(db, 'userData');
      const unsubscribe = onValue(usersRef, (snapshot) => {
        const usersData = snapshot.val();
        if (usersData) {
          setUsers(usersData);
        } else {
          setUsers([]);
        }
      });
      return () => unsubscribe();
    }, []);
    
    // UPDATE USERNAME
    const [username, setUsername] = useState(null);
    
    const login = (username) => {
      setUsername(username);
    }

    const logout = () => {
      setUsername(null);
    }

    // INITIALIZE RESUMES
    const [resumes, setResumes] = useState([]);
    useEffect(() => {
      if (username) {
        const db = getDatabase();
        const resumesRef = ref(db, `userData/${username}/resumes`);
        const unsubscribeResumes = onValue(resumesRef, (snapshot) => {
          const resumesData = snapshot.val();
          if (resumesData) {
            setResumes(Object.values(resumesData));
          } else {
            setResumes([]);
          }
        });
        return () => unsubscribeResumes();
      } else {
        setResumes([]); 
      }
    }, [username]); 

    // ROUTING
    return (
      <div>
        <Navbar username={username} logout={logout}/>
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<SignIn login={login} />} />
            <Route path="/register" element={<Register login={login} />} />
            <Route path="/templates" element={<ExamplesPage />} />
            <Route path="*" element={<Navigate to="/"/>} /> {/* Catch-all for bad URLs */}
            <Route path="/myresumes/*" element={<MyResumes resumes={resumes} setResumes={setResumes} username={username}/>} />
            <Route path="/resume/edit-resume/:id" element={<ResumeEditor resumes={resumes} setResumes={setResumes} />} />
          </Routes>
        </main>
        <Footer />
      </div>
    );
}

export default App;

