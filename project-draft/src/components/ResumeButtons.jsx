import React from 'react';

export function EditorButtons(props) {
    
    const {editName} = props;
    
    return (
        <button className="resume-buttons">
            {editName}
        </button>
    ) 
}

export function GenerateButtons(props) {

    // same with props here
    const {editName} = props;

    return (
        <button className="resume-buttons">
            {editName}
        </button>
    )
}