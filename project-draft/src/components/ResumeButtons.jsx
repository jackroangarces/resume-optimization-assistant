import React from 'react';

export function EditorButtons(props) {
    
    const {editName} = props;
    
    return (
        <button className="m-3 p-3 min-50">
            Edit {editName}
        </button>
    ) 
}

export function GenerateButtons(props) {

    // same with props here

    return (
        <button>
            Generate
        </button>
    )
}