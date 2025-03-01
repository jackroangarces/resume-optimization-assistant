import React, {useState} from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

export function EditorButtons(props) {
    
    const {editName} = props;

    //modal state
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    
    return (
        <>
            <button className="button" onClick={handleShow}>
                Edit {editName}
            </button>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                <Modal.Title>Modal heading</Modal.Title>
                </Modal.Header>
            <Modal.Body>
                <input type="text" placeholder="input here" />
            </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleClose}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </>

    ) 
}

export function GenerateButtons(props) {

    // same with props here
    const {editName} = props;

    return (
        <button className="button">
            {editName}
        </button>
    )
}