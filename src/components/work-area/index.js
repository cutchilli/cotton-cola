import React, { Component } from 'react';

import Box from './components/box';
import getPosition from '../../util/get-position';

function drawCrossHair(overlayStyle, x, y) {
  if (!x || !y) return (<div />);

  const verticalCrossHairStyle = {
    display: 'inline-block',
    height: '100%',
    position: 'absolute',
    borderLeft: '1px solid cyan',
    left: x,
  };

  const horizontalCrossHairStyle = {
    display: 'inline-block',
    width: '100%',
    position: 'absolute',
    borderTop: '1px solid cyan',
    top: y,
  };

  return (
    <div style={overlayStyle}>
      <div style={verticalCrossHairStyle} />
      <div style={horizontalCrossHairStyle} />
    </div>
  );
}

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

      // Historical Boxes
      boxes: [],
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
    const { scale } = this.props;
    const {
      isDrawingBox, mouseX, mouseY, boxX, boxY, boxes,
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
      const newBox = {
        x1: boxX / scale,
        y1: boxY / scale,
        x2: mouseX / scale,
        y2: mouseY / scale,
      };

      stateModification.boxes = [...boxes, newBox];
      stateModification.boxX = null;
      stateModification.boxY = null;
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

    canvas.getContext('2d').drawImage(image, 0, 0, image.width * scale, image.height * scale);
  }

  render() {
    const {
      image,
      scale,
      drawDivRef,
    } = this.props;
    const {
      boxes,
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

    // Draw cross hair
    const crossHair = drawCrossHair(overlayStyle, mouseX, mouseY);

    const spriteBoxes = boxes
      .map((box, idx) =>
        (<Box
          scale={scale}
          fill={false}
          x1={box.x1}
          y1={box.y1}
          x2={box.x2}
          y2={box.y2}
          key={`sprite_${idx}`} //eslint-disable-line
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
        { crossHair }
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
