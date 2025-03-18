import React, { useState } from 'react';
import { CloseButton } from 'react-bootstrap';

export function ChatScreen(props) {

    const {showChat, setShowChat, itemsDisplay, setItemsDisplay, messages, loading} = props;

    //console.log(userPrompt) // TURNED OFF FOR DEBUGGING BECAUSE IT PRINTS TOO MANY THINGS IN CONSOLE FEEL FREE TO TURN BACK ON

    // closes chat screen
    const handleClose = () => {
        if (setShowChat) setShowChat('chatGone');
        if (setItemsDisplay) setItemsDisplay('chatGone');
    };

    // add message to message obj array
    const addMessage = (messageText) => {
        const newMessage = {text: messageText}
        setMessages((prevMessages) => [...prevMessages, newMessage]);
    }

    // follow up pop up
    const handleFollowUp = () => {

    };

    // MESSAGE STUFF

    // will map these into a "messageArray"
    const [input, setInput] = useState("");

    //for debugging (will not be using state for array of messages)
    const [messageArray, setMessageArray] = useState([{text:"Hello"},{text:"This is example text blah blah blah blah"}]);

    // format message to readable content
    const messageItemArray = messages?.map((chatObj, index) => {
        return <MessageItem key={index} messageData={chatObj} />
    }) || [];    

    return (     
        <div className={showChat + " "}>
            <div className='d-flex'> {/* Chatscreen header */}
                <CloseButton className={"m-1 p-2" + itemsDisplay} onClick={() => {handleFollowUp(), handleClose()}} />
            </div>
            <div className={itemsDisplay}>
                {/* conditional rendering */}
                {messageItemArray.length === 0 && 
                <p className='p-1'>No messages yet</p>
                }
                {loading === true &&
                <p className='p-1'>LOADING ...</p>}
                {/* Messages */}
                {messageItemArray}
            </div>
        </div>
    )
}

function MessageItem({messageData}) {
    return (
        <div className="message d-flex mb-3">
            <p>{messageData.text}</p>
        </div> 
    )
}

