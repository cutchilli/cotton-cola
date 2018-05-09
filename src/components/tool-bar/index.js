import React from 'react';
import './styles.css';

const ToolBar = ({imageIsLoaded, onZoomInClick, onZoomOutClick, onCloseFileClick}) => {    
    const toolbarButtons = [
        <button key="zoomInButton" onClick={() => onZoomInClick()}>Zoom In</button>,
        <button key="zoomOutButton" onClick={() => onZoomOutClick()}>Zoom Out</button>,
        <button key="closeFileButton" onClick={() => onCloseFileClick()}>Close File</button>,
    ];

    return (
        <div className="tool-bar">
            <span className="app-name">Cotton Cola</span>
            { imageIsLoaded && toolbarButtons }
        </div>
    );
};

export default ToolBar;
