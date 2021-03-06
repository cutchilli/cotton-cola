import _ from 'lodash';
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import Dropzone from 'react-dropzone';
import ReactJson from 'react-json-view';
import styled, { css } from 'react-emotion';

import ToolBar from './components/tool-bar';
import WorkArea from './components/work-area';
import {
  setWorkAreaImage,
  setWorkAreaScale,
  addOrUpdateSprite,
} from './actions/index';

import './dropzone.css';

class App extends PureComponent {
  constructor(props) {
    super(props);

    // Bindies
    this.drawDivRef = React.createRef();

    // Bind up dem crispy events bruz
    this.onZoomIn = this.onZoomIn.bind(this);
    this.onZoomOut = this.onZoomOut.bind(this);
    this.onCloseFile = this.onCloseFile.bind(this);
    this.onImageDrop = this.onImageDrop.bind(this);
    this.onSpriteUpdate = this.onSpriteUpdate.bind(this);
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
    let imageFile = null;

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
      setImage(image, imageFile.name);
    });

    reader.addEventListener('error', () => {
      alert('handler file read error');
    });

    image.addEventListener('error', () => {
      alert('handle image load error');
    });

    [imageFile] = acceptedFiles;
    reader.readAsDataURL(imageFile);
  }

  onSpriteUpdate(sprite) {
    const {
      actions: {
        updateSprite,
      },
    } = this.props;

    updateSprite(sprite);
  }

  mapSpriteSheetJson() {
    const { workArea: { imageName, sprites, animations } } = this.props;
    const spriteSheet = {};

    if (imageName) {
      spriteSheet.imageUrl = `./${imageName}`;
    }

    const animationValues = _.values(animations);
    const spriteValues = _.values(sprites);

    if (animationValues && animationValues.length > 0) {
      spriteSheet.animations = animationValues;
    }

    if (spriteValues && spriteValues.length > 0) {
      spriteSheet.sprites = spriteValues;
    }

    return spriteSheet;
  }

  render() {
    const { workArea } = this.props;
    const { image, scale } = workArea;
    const imageIsLoaded = !!workArea.image;

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
            <WorkArea
              sprites={workArea.sprites}
              onSpriteUpdate={this.onSpriteUpdate}
              image={image}
              scale={scale}
              drawDivRef={this.drawDivRef}
            />
          </div>
          <div className={rightSection}>
            <EmbossedTitle>Json view</EmbossedTitle>
            <ReactJson theme="monokai" src={this.mapSpriteSheetJson()} enableClipboard={false} displayDataTypes={false} />
          </div>
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
    closeImage: () => dispatch(setWorkAreaImage(null, null)),
    scaleImage: scale => dispatch(setWorkAreaScale(scale)),
    setImage: (image, imageName) => dispatch(setWorkAreaImage(image, imageName)),
    updateSprite: sprite => dispatch(addOrUpdateSprite(sprite)),
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);
