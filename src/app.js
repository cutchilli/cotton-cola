import React, { Component } from 'react';
import Dropzone from 'react-dropzone';
import ReactJson from 'react-json-view';
import styled, { css } from 'react-emotion';

import 'normalize.css';

import ToolBar from './components/tool-bar';
import WorkArea from './components/work-area';
import sampleJson from './samples/sample.json';

import './dropzone.css';

class App extends Component {
  constructor(...args) {
    super(...args);

    this.drawDivRef = React.createRef();

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
      height: 100%;
      width: 100%;
    `;

    const leftSection = css`
      flex: 2;
      padding: 1rem;
    `;

    const rightSection = css`
      background-color: rgb(39, 40, 34);
      padding-left: 1rem;
      height: 100%;
      line-height: 1rem;
      flex: 1;
    `;

    const EmbossedTitle = styled('div')`
      color: white;
      text-align: center;
      padding: 1rem;
      margin-top: 1rem;
      margin-bottom: 1rem;
      margin-right: 1rem;
      background: #272822;
      border-left: 1px solid #363831;
      border-top: 1px solid #363831;
      border-right: 1px solid #1b1c17;
      border-bottom:  1px solid #1b1c17;
    `;

    const pageContainer = css`
      display: flex;
      flex-direction: column;
      height: 100%;
      width: 100%;
    `;

    return (
      <div className={pageContainer}>
        <ToolBar
          imageIsLoaded={imageIsLoaded}
          onZoomInClick={this.onZoomIn}
          onZoomOutClick={this.onZoomOut}
          onCloseFileClick={this.onCloseFile}
        />
        <div className={mainContainer}>
          <div className={leftSection} ref={this.drawDivRef}>
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
            <WorkArea image={workAreaImage} scale={workAreaScale} drawDivRef={this.drawDivRef} />
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
