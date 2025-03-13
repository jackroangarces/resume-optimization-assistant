import React, { useState, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';

export function ChatScreen(props) {

    const {showChat, setShowChat, itemsDisplay, setItemsDisplay, userPrompt} = props;

    console.log(userPrompt)

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

    // AI STUFF

    // useEffect() and sendPromptToGemini was coded with the assistance of claude.ai
    // it was to understand and learn how to implement AI chat prompts
    // into the webpage.
    
    // Will need to hide this for security purposes
    const apiKey = "AIzaSyALULJ4WeAf7y-p5Xc_rai0Z5jDGLtndc4";
    const [genAI, setGenAI] = useState(null);

    useEffect(() => {
        const API_KEY = "AIzaSyALULJ4WeAf7y-p5Xc_rai0Z5jDGLtndc4"; 
        if (API_KEY) {
            const ai = new GoogleGenerativeAI(API_KEY);
            setGenAI(ai);
        }
    }, []);

    const sendPromptToGemini = async (prompt) => {
        if (!genAI) {
            console.error("bruh wya");
            return;
        }
        try {
            const model = genAI.getGenerativeModel({ model:"gemini-pro", apiVersion: "v1" });
            const result = await model.generateContent(prompt);
            const response = result.response;
            const text = await response.getContent();
            addMessage(text);
        }
        catch (error) {
            console.error("Error boi ain no way")
            addMessage("Error boi ain no way");
        }
    }

    useEffect(() => {
        if (userPrompt) {
            sendPromptToGemini(userPrompt);
        }
    }, [userPrompt]);

    // MESSAGE STUFF

    // will map these into a "messageArray"
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");

    //for debugging (will not be using state for array of messages)
    const [messageArray, setMessageArray] = useState([{text:"Hello"},{text:"This is example text blah blah blah blah"}]);

    // format message to readable content
    const messageItemArray = messages.map((chatObj, index) => {
        return <MessageItem key={index} messageData={chatObj} />
    });    

    return (     
        <div className={showChat}>
            <div className='d-flex'> {/* Chatscreen header */}
                <button className={"closeButton " + itemsDisplay} onClick={handleClose}>
                    X
                </button>
            </div>
            <div className={itemsDisplay}>
                {/* conditional rendering */}
                {messageItemArray.length === 0 && 
                <p>No messages yet</p>
                }
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

