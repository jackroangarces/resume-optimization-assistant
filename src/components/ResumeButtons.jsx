import React, {useState} from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { CloseButton } from 'react-bootstrap';
import { ChatScreen } from './ResumeAI';

// SINGLE PROMPT EDITOR BUTTONS
export function EditorButtons({name, modalName, subtext, onSave}) {
    
    //modal state
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    //input value state to input into forms
    const [buttonInput, setButtonInput] = useState('');
    const handleButtonInput = (event) => {
        setButtonInput(event.target.value);
    }
    
    //Pass the input value to the parent component
    const handleSave = () => {
        if (onSave) {
            onSave(buttonInput);
        }
        handleClose();
    };

    return (
        <>
            <button className="button" onClick={handleShow}>
                {name}
            </button>

            {/* Modal component from React Bootstrap */}
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                <Modal.Title>{modalName}</Modal.Title>
                </Modal.Header>
            <Modal.Body>
                <p>{subtext}</p>
                <br />
                <input 
                type="text" 
                placeholder="input here" 
                onChange={handleButtonInput}
                />
                
            </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleSave}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </>

    ) 
}

// GENERATE BUTTONS
export function GenerateButtons(props) {

    // same with props here
    const {editName, onClick, messages, loading} = props;

    // opens chatscreen when generate buttons are clicked
    const [showChat, setShowChat] = useState('chatGone');
    const handleShowChat = () => setShowChat('chatscreen');

    // close chatscreen
    const handleCloseChat = () => {
        setShowChat('chatGone');
        setItemsDisplay('chatGone');
    };
    
    // displays chatscreen contents
    const [itemsDisplay, setItemsDisplay] = useState("chatGone");
    const handleDisplayItems = () => setItemsDisplay('');


    return (
        <div>
            <button className="button" onClick={() => {onClick(); handleShowChat(); handleDisplayItems();}}>
                {editName}
            </button>
            <ChatScreen 
                showChat={showChat} 
                setShowChat={setShowChat} 
                itemsDisplay={itemsDisplay} 
                setItemsDisplay={setItemsDisplay}
                userPrompt={onClick}
                messages={messages || []}
                loading={loading}
            />
        </div>
    )
}

export function PrivacyPopUp(props) {
    const [showChat, setShowChat] = useState('chatGone');
    const handleShowChat = () => {
        if(showChat === 'chatGone') {
            setShowChat('chatscreen');
        }
        else {
            setShowChat('chatGone')
        }
        
    }

    // close chatscreen
    const handleCloseChat = () => {
        setShowChat('chatGone');
        setItemsDisplay('chatGone');
    };

    const handleFollowUp = () => {

    };

    return (
        <>
            <button className="button" onClick={handleShowChat}>
                Privacy Disclaimer
            </button>     
            <div className={showChat + " "}>
                <div className='d-flex'> {/* Chatscreen header */}
                    <CloseButton className={"m-1 p-2"} onClick={() => {handleFollowUp(), handleShowChat()}} />
                </div>
                <div>
                    <h2>Privacy Disclaimer</h2>
                    <p className='p-4'>
                        The Resume Optimization System (ROS) prioritizes your privacy. Here's
                        how we use your information and data:
                    </p>
                        <ol className=''>
                            <li>
                                Use of AI for Recommendations
                                <ul>
                                    <li>
                                        To provide you with better course and project recomendations
                                        we may share details about the courses you've taken and projects
                                        you've completed to Google's Gemini ChatBot.
                                    </li>
                                    <li>
                                        No personal data (such as your name, contact information, 
                                        or other identifying details) is shared.
                                    </li>
                                </ul>
                            </li>
                            <li>
                                Resume Database (Optional Sharing)
                                <ul>
                                    <li>
                                        You have the option to share your resume 
                                        with our database to contribute to industry insights 
                                        and trends.
                                    </li>
                                    <li>
                                        No personal data is included in these shared resumes.
                                    </li>
                                </ul>
                            </li>
                            <li>
                                Data Protection
                                <ul>
                                    <li>
                                        We do not sell, rent, or distribute any personal information.
                                    </li>
                                    <li>
                                        Any data shared is strictly used to improve your resume-building experience.
                                    </li>
                                </ul>
                            </li>
                        </ol>
                        By using our platform, you acknowledge and agree to these terms. Thank you for
                        utilizing the Resume Optimization System!
                </div>
            </div>
        </>
    )
}

// MULTI PROMPT EDITOR BUTTONS
export function MultiEditorButtons({ name, modalName, subtext, numPrompts, onSave }) {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [buttonInputs, setButtonInputs] = useState(Array(numPrompts).fill(""));
    
    const handleButtonInput = (index, event) => {
        const newInputs = [...buttonInputs];
        newInputs[index] = event.target.value;
        setButtonInputs(newInputs);
    };

    const handleSave = () => {
        if (onSave) {
            onSave(buttonInputs);
        }
        handleClose();
    };

    return (
        <>
            <button className="button" onClick={handleShow}>
                {name}
            </button>

            {/* Modal component from React Bootstrap */}
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{modalName}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p style={{ whiteSpace: 'pre-line' }}>{subtext}</p>
                    <br />
                    {Array.from({ length: numPrompts }, (_, index) => (
                        <div key={index}>
                            <input 
                                key={index} 
                                type="text" 
                                placeholder={`Input ${index + 1}`} 
                                onChange={(event) => handleButtonInput(index, event)}
                            />
                            <br />
                        </div>
                    ))}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleSave}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}