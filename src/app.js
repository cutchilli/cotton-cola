import React, { Component } from 'react';
import Dropzone from 'react-dropzone';
import ReactJson from 'react-json-view';
import styled, { css } from 'react-emotion';

import 'normalize.css';

import ToolBar from './components/tool-bar';
import WorkArea from './components/work-area';
import sampleJson from './samples/sample.json';

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
        workAreaScale: 1,
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
    let { workAreaScale } = this.state;

    workAreaScale += 0.1;

    this.setState(Object.assign(this.state, {
      workAreaScale,
    }));
  }

  onZoomOut() {
    let { workAreaScale } = this.state;

    workAreaScale -= 0.1;

    if (workAreaScale < 0) workAreaScale = 0.1;

    this.setState(Object.assign(this.state, {
      workAreaScale,
    }));
  }

  onCloseFile() {
    this.setState(Object.assign(this.state, {
      workAreaImage: null,
      workAreaScale: 1,
    }));
  }

  render() {
    const { workAreaImage, workAreaScale } = this.state;
    const imageIsLoaded = !!workAreaImage;

    const mainContainer = css`
      display: flex;
      position: absolute;
      height: 100%;
      width: 100%;
    `;

    const leftSection = css`
      margin-top: 3.5rem;
      flex-grow: 3;
    `;

    const rightSection = css`
      background-color: rgb(39, 40, 34);
      margin-top: 3.5rem;
      padding-left: 1rem;
      width: 30%;
      height: 100%;
      line-height: 1rem;
    `;

    const EmbossedTitle = styled('div')`
      color: white;
      text-align: center;
      padding: 1rem;
      margin-right: 1rem;
      background: #272822;
      border-left: 1px solid #363831;
      border-top: 1px solid #363831;
      border-right: 1px solid #1b1c17;
      border-bottom:  1px solid #1b1c17;
    `;

    return (
      <div className="app">
        <ToolBar
          imageIsLoaded={imageIsLoaded}
          onZoomInClick={this.onZoomIn}
          onZoomOutClick={this.onZoomOut}
          onCloseFileClick={this.onCloseFile}
        />
        <div className={mainContainer}>
          <div className={leftSection}>
            <Dropzone
              disabled={imageIsLoaded}
              className={workAreaImage === null ? 'drop-zone' : 'drop-zone-hidden'}
              activeClassName="active"
              acceptClassName="accept"
              rejectClassName="reject"
              multiple={false}
              accept="image/jpeg, image/png, image/gif"
              onDrop={this.onImageDrop}
            >
              {({ isDragActive, isDragReject }) => {
                if (isDragReject) {
                  return 'Invalid file.';
                }
                if (isDragActive) {
                  return 'Drop this file to get started';
                }
                return 'Drag a sprite sheet image file on me.';
              }}
            </Dropzone>
            <WorkArea image={workAreaImage} scale={workAreaScale} />
          </div>
          <div className={rightSection}>
            <EmbossedTitle>Json view</EmbossedTitle>
            <ReactJson theme="monokai" src={sampleJson} enableClipboard={false} displayDataTypes={false} />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
