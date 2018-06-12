import _ from 'lodash';
import React, { Component } from 'react';

import { Box, CrossHair } from './components';
import getPosition from '../../util/get-position';

class WorkArea extends Component {
  constructor(...args) {
    super(...args);

    this.overlayRef = React.createRef();
    this.canvasRef = React.createRef();
    this.state = {
      // Current Mouse Pos
      mouseX: 0,
      mouseY: 0,

      // Current Drawing
      isDrawingBox: false,
      boxX: null,
      boxY: null,
    };

    this.onCanvasClick = this.onCanvasClick.bind(this);
    this.onCanvasMove = this.onCanvasMove.bind(this);
  }

  componentDidMount() {
    this.updateCanvas();
  }

  componentDidUpdate() {
    this.updateCanvas();
  }

  onCanvasClick() {
    const { scale, onSpriteUpdate } = this.props;
    const {
      isDrawingBox, mouseX, mouseY, boxX, boxY,
    } = this.state;

    const stateModification = {};
    if (!isDrawingBox) {
      // Starting to draw a box
      stateModification.isDrawingBox = true;
      stateModification.boxX = mouseX;
      stateModification.boxY = mouseY;
    } else {
      // Finished drawing a box
      stateModification.isDrawingBox = false;

      const x1 = boxX / scale;
      const y1 = boxY / scale;
      const x2 = mouseX / scale;
      const y2 = mouseY / scale;

      const newSprite = {
        name: _.uniqueId('sprite'),
        x1: Math.min(x1, x2),
        y1: Math.min(y1, y2),
        width: Math.abs(x1 - x2),
        height: Math.abs(y1 - y2),
      };

      stateModification.boxX = null;
      stateModification.boxY = null;

      onSpriteUpdate(newSprite);
    }

    this.setState(Object.assign(this.state, stateModification));
  }

  onCanvasMove(e) {
    // Calculate offset
    const canvasPos = getPosition(this.canvasRef.current);

    this.setState(Object.assign(this.state, {
      mouseX: e.clientX - canvasPos.x,
      mouseY: e.clientY - canvasPos.y,
    }));
  }

  updateCanvas() {
    const { image, scale } = this.props;

    const canvas = this.canvasRef.current;
    if (!image) return;

    canvas.getContext('2d')
      .drawImage(image, 0, 0, image.width * scale, image.height * scale);
  }

  render() {
    const {
      image,
      scale,
      sprites,
      drawDivRef,
    } = this.props;
    const {
      mouseX,
      mouseY,
      isDrawingBox,
      boxX,
      boxY,
    } = this.state;

    const workAreaStyle = {
      width: 0,
      height: 0,
      position: 'absolute',
    };

    if (image) workAreaStyle.width = drawDivRef.current.offsetWidth * scale;
    if (image) workAreaStyle.height = drawDivRef.current.offsetHeight * scale;

    const overlayStyle = {
      ...workAreaStyle,
      pointerEvents: 'none',
    };

    const spriteBoxes = _.values(sprites)
      .map(sprite =>
        (<Box
          scale={scale}
          fill={false}
          x1={sprite.x1}
          y1={sprite.y1}
          x2={sprite.x1 + sprite.width}
          y2={sprite.y1 + sprite.height}
          key={sprite.name}
        />));

    // Draw current box
    if (isDrawingBox) {
      spriteBoxes.push(<Box
        scale={1}
        fill
        x1={boxX}
        y1={boxY}
        x2={mouseX}
        y2={mouseY}
        key="currentBox"
      />);
    }

    return (
      <div className="work-area-container">
        <canvas
          onMouseMove={this.onCanvasMove}
          onClick={this.onCanvasClick}
          ref={this.canvasRef}
          width={workAreaStyle.width}
          height={workAreaStyle.height}
          style={workAreaStyle}
        />
        <CrossHair
          overlayStyle={overlayStyle}
          x={mouseX}
          y={mouseY}
        />
        <div
          ref={this.overlayRef}
          style={overlayStyle}
        >
          { spriteBoxes }
        </div>
      </div>
    );
  }
}

export default WorkArea;
