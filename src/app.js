import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import Dropzone from 'react-dropzone';

import 'normalize.css';

import ToolBar from './components/tool-bar';
import WorkArea from './components/work-area';
import {
  setWorkAreaImage,
  setWorkAreaScale,
} from './actions/index';

import './app.css';

class App extends PureComponent {
  constructor(props) {
    super(props);

    // Bindies
    this.onZoomIn = this.onZoomIn.bind(this);
    this.onZoomOut = this.onZoomOut.bind(this);
    this.onCloseFile = this.onCloseFile.bind(this);
    this.onImageDrop = this.onImageDrop.bind(this);
  }

  onZoomIn() {
    const {
      workArea: { scale },
      actions: { scaleImage },
    } = this.props;
    const workAreaScale = scale + 0.1;

    scaleImage(workAreaScale);
  }

  onZoomOut() {
    const {
      workArea: { scale },
      actions: { scaleImage },
    } = this.props;
    let workAreaScale = scale - 0.1;

    if (workAreaScale < 0) workAreaScale = 0.1;

    scaleImage(workAreaScale);
  }

  onCloseFile() {
    const {
      actions: {
        setImage,
        scaleImage,
      },
    } = this.props;
    setImage(null);
    scaleImage(null);
  }

  onImageDrop(acceptedFiles) {
    const { actions: { setImage } } = this.props;

    if (!acceptedFiles
      || acceptedFiles.length === 0
      || acceptedFiles.length > 1
    ) return;

    const reader = new FileReader();
    const image = new Image();
    reader.addEventListener('load', () => {
      image.src = reader.result;
    });

    image.addEventListener('load', () => {
      setImage(image);
    });

    reader.addEventListener('error', () => {
      alert('handler file read error');
    });

    image.addEventListener('error', () => {
      alert('handle image load error');
    });

    reader.readAsDataURL(acceptedFiles[0]);
  }

  render() {
    const { workArea } = this.props;
    const { image, scale } = workArea;
    const imageIsLoaded = !!workArea.image;

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
            className={image === null ? 'drop-zone' : 'drop-zone-hidden'}
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
          <WorkArea image={image} scale={scale} />
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ workArea }) => ({
  workArea,
});

const mapDispatchToProps = dispatch => ({
  actions: {
    closeImage: () => dispatch(setWorkAreaImage(null)),
    scaleImage: scale => dispatch(setWorkAreaScale(scale)),
    setImage: image => dispatch(setWorkAreaImage(image)),
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);
