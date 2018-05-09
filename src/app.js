import React, { Component } from 'react';
import Dropzone from 'react-dropzone';

import ToolBar from './components/tool-bar';
import WorkArea from './components/work-area';

import 'normalize.css';
import './app.css';

class App extends Component {
  constructor(...args) {
    super(...args);

    // Set up app state
    this.state = {
      workAreaImage: null,
      workAreaScale: 1,
    };

    // Bind up dem crispy events bruz
    this.onImageDrop = this.onImageDrop.bind(this);
    this.onZoomIn = this.onZoomIn.bind(this);
    this.onZoomOut = this.onZoomOut.bind(this);
    this.onCloseFile = this.onCloseFile.bind(this);
  }

  // Event handlers
  onImageDrop(acceptedFiles) {
    if (!acceptedFiles || acceptedFiles.length === 0 || acceptedFiles.length > 1) return;

    const reader = new FileReader();
    const image = new Image();
    reader.addEventListener('load', () => {      
      image.src = reader.result;
    });

    image.addEventListener('load', () => {
      this.setState(Object.assign(this.state, {
        workAreaImage: image,
        workAreaScale: 1
      }));
    });

    reader.addEventListener('error', () => {
      alert('handler file read error');
    });

    image.addEventListener('error', () => {
      alert('handle image load error');
    });

    reader.readAsDataURL(acceptedFiles[0]);
  }
  
  onZoomIn() {
    let workAreaScale = this.state.workAreaScale;

    workAreaScale += 0.1;

    this.setState(Object.assign(this.state, {
      workAreaScale
    }));
  }

  onZoomOut() {
    let workAreaScale = this.state.workAreaScale;

    workAreaScale -= 0.1;

    if (workAreaScale < 0) workAreaScale = 0.1;

    this.setState(Object.assign(this.state, {
      workAreaScale
    }));
  }

  onCloseFile() {
    this.setState(Object.assign(this.state, {
      workAreaImage: null,
      workAreaScale: 1
    }));
  }

  render() {
    const { workAreaImage, workAreaScale } = this.state;
    const imageIsLoaded = !!workAreaImage;

    return (
      <div className="app">
        <ToolBar
          imageIsLoaded={imageIsLoaded}
          onZoomInClick={this.onZoomIn}
          onZoomOutClick={this.onZoomOut}
          onCloseFileClick={this.onCloseFile}
        />
        <div className="app-work-area">
          <Dropzone
            disabled={imageIsLoaded}
            className={workAreaImage === null ? "drop-zone" : "drop-zone-hidden"}
            activeClassName="active"
            acceptClassName="accept"
            rejectClassName="reject"
            multiple={false}
            accept="image/jpeg, image/png, image/gif" 
            onDrop={this.onImageDrop}>
            {({ isDragActive, isDragReject, acceptedFiles, rejectedFiles }) => {
              if (isDragReject) {
                return "Invalid file.";
              }
              if (isDragActive) {
                return "Drop this file to get started";
              }
              return "Drag a sprite sheet image file on me.";
            }}
          </Dropzone>
          <WorkArea image={workAreaImage} scale={workAreaScale} />
        </div>
      </div>
    );
  }
}

export default App;
