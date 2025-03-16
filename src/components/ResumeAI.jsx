import React, { useState, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { CloseButton } from 'react-bootstrap';

export function ChatScreen(props) {

    const {showChat, setShowChat, itemsDisplay, setItemsDisplay, userPrompt} = props;

    console.log(userPrompt) // TURNED OFF FOR DEBUGGING BECAUSE IT PRINTS TOO MANY THINGS IN CONSOLE FEEL FREE TO TURN BACK ON

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
    const API_KEY = "AIzaSyALULJ4WeAf7y-p5Xc_rai0Z5jDGLtndc4";
    
    const sendPromptToGemini = async (prompt) => {
        if (!prompt) return;
        
        try {
            const genAI = new GoogleGenerativeAI(API_KEY);
            const model = genAI.getGenerativeModel({ model: "gemini-pro" });

            const result = await model.generateContent({
                contents: [{parts: [{ text: prompt }]}] });
            
            if (result.response) {
                const responseText = result.response.text();
                addMessage(responseText);
            } else {
                addMessage("No response received from AI");
            }
        } catch (error) {
            console.error("Error details:", error );
            addMessage("Failed to get AI response: " + (error.message || "Unknown error"));
        }
    };
    
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
        <div className={showChat + " "}>
            <div className='d-flex'> {/* Chatscreen header */}
                <CloseButton className={"m-1 p-2" + itemsDisplay} onClick={handleClose} />
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

