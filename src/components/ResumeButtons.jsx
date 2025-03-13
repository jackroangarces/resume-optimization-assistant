import React, {useState} from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { ChatScreen } from './ResumeAI';

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
                <p>Current: {subtext}</p>
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

export function GenerateButtons(props) {

    // same with props here
    const {editName, onClick, userPrompt} = props;

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
            />
        </div>
    )
}