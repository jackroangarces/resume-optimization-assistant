import React, {useState, useEffect } from 'react';
import { Routes, Route, Navigate, Outlet, Link } from 'react-router';
import { getDatabase, ref, onValue, push, set } from 'firebase/database';
import { Navbar } from './Navbar.jsx';
import { Footer } from './Footer.jsx';
import { HomePage } from './StaticPages.jsx';
import { SignIn } from './SignIn.jsx';  
import { MyResumes } from './MyResumes.jsx';
import { ResumeEditor } from './ResumeEditor.jsx';
// import { Register } from './Register.jsx';
import { SharedResumes } from './SharedResumes.jsx'; 
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';

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

    /*
    useEffect(() => {

      const auth = getAuth();
      onAuthStateChanged(auth, (firebaseUser) => {
        console.log("login status changed");
        console.log(firebaseUser);

        if(firebaseUser){ // if defined
          firebaseUser.userId = firebaseUser.uid; //rename keys
          firebaseUser.userName = firebaseUser.displayName;
          login(firebaseUser.displayName);
          loginId(firebaseUser.uid);
          setUsers(firebaseUser);
        } else {
          setUsers([]);
        }
      });
      return () => unsubscribe();
    }, []);
    */

    // UPDATE USERNAME
    const [user, setUser] = useState(null);
    const [username, setUsername] = useState(null);
    
    const login = (username) => {
      setUsername(username);
    }

    const loginId = (user) => {
      setUser(user);
    }

    const logout = () => {
      setUsername(null);
      signOut(getAuth());
    }

    // INITIALIZE RESUMES
    const [resumes, setResumes] = useState([]);
    useEffect(() => {
      if (user) {
        const db = getDatabase();
        const resumesRef = ref(db, `userData/${user}/resumes`);
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
        <Navbar username={username} users={users} logout={logout}/>
        <main>
          <Routes>
            <Route path="/" element={<HomePage username={username} />} />
            <Route path="/login" element={<SignIn login={login} users={users} />} />
            <Route path="/templates" element={<ExamplesPage />} />
            <Route path="/shared-resumes" element={<SharedResumes />} />
            <Route path="*" element={<Navigate to="/"/>} /> {/* Catch-all for bad URLs */}
            
            <Route element={<ProtectedPage username={username} />} >
            <Route path="/myresumes/*" element={<MyResumes resumes={resumes} setResumes={setResumes} username={user}/>} />
            <Route path="/resume/edit-resume/:id" element={<ResumeEditor resumes={resumes} setResumes={setResumes} username={user} />} />
            </Route>
          </Routes>
        </main>
        <Footer />
      </div>
    );
}

function ProtectedPage(props) {
  if(props.username == null) {
    return (
      <div className="sign-in-text">
      <p className="sign-in-text">Sign in to see your resumes.</p>
      <Link className="button" to="/login">Sign In</Link>
      </div>
    )
  } else {
    return <Outlet />
  }
}

export default App;

