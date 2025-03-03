import React, {useState, useEffect} from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';

export function ChatScreen(props) {
    const [messages, setMessages] = useState("hello");
    const [input, setInput] = useState("");

    // Will need to hide this for security purposes
    const apiKey = "AIzaSyALULJ4WeAf7y-p5Xc_rai0Z5jDGLtndc4";

    // from lecture demo

    //for debugging

    const [messageStateArray, setMessageStateArray] = useState([{text:"Hello"},{text:"This is example text blah blah blah blah"}]);
    const [genAI, setGenAI] = useState(null);
    

    // useEffect() and sendPromptToGemini was coded with the assistance of claude.ai
    // it was to understand and learn how to implement AI chat prompts
    // into the webpage.

    useEffect(() => {
        const API_KEY = "AIzaSyALULJ4WeAf7y-p5Xc_rai0Z5jDGLtndc4"; 
        if (API_KEY) {
            const ai = new GoogleGenerativeAI(API_KEY);
            setGenAI(ai);
        }
    }, []);

    const sendPromptToGemini = async (prompt) => {
        try {
            const model = genAI.getGenerativeModel({ model:"gemini-pro" });
            const result = await model.generateContent(prompt);
            const response = result.response;
            const text = response.text();
            addMessage(text);
        }
        catch (error) {
            console.error("Error")
            addMessage("Error");
        }
    }

    // when user presses "Generate Classes" button
    const handleGenerateClasses = () => {
        // prompts will be refined later
        const prompt = "What classes should i take to be a software engineer?"

        sendPromptToGemini(prompt);
    }

    // when user presses "Generate Projects" button
    const handleGenerateProjects = () => {
        
        // AI will eventually look through a database of other user resumes to determine
        // project examples. Same with classes
        const prompt = "What projects should I do to improve my resume as a software engineer."
        sendPromptToGemini(prompt);
    }

    // add message to message obj array
    const addMessage = (messageText) => {
        const newMessage = {text: messageText}
        setMessageStateArray((prevMessages) => [...prevMessages, newMessage]);
    }

    // format message to readable content
    const messageItemArray = messageStateArray.map((chatObj, index) => {
        return <MessageItem key={index} messageData={chatObj} />
    });    

    console.log(messageItemArray)
    return (
        <div className="scrollable-pane pt-2 my-2 bg-primary">
            {/* conditional rendering */}
            {messageItemArray.length === 0 && 
            <p>No messages yet</p>
            }

            {/* Messages */}
            
            {messageItemArray}
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

