import React from 'react';
import styled from 'react-emotion';

const ToolbarComp = styled('div')`
  width: 100%;
  height: 3.5rem;
  background-color: #9B51E0;
  box-shadow: rgba(0, 0, 0, 0.137255) 0px 0px 4px 0px, rgba(0, 0, 0, 0.278431) 0px 4px 8px 0px;
  position: fixed;
  overflow: hidden;
  z-index: 9999;
`;

const AppName = styled('span')`
  color: white;
  line-height: 3.5rem;
  font-size: 1.25rem;
  margin-left: 0.5rem;
`;

const ToolBar = ({
  imageIsLoaded,
  onZoomInClick,
  onZoomOutClick,
  onCloseFileClick,
}) => {
  const toolbarButtons = [
    <button key="zoomInButton" onClick={() => onZoomInClick()}>Zoom In</button>,
    <button key="zoomOutButton" onClick={() => onZoomOutClick()}>Zoom Out</button>,
    <button key="closeFileButton" onClick={() => onCloseFileClick()}>Close File</button>,
  ];

  return (
    <ToolbarComp>
      <AppName>Cotton Cola</AppName>
      { imageIsLoaded && toolbarButtons }
    </ToolbarComp>
  );
};

export default ToolBar;
