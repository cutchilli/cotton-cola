import React, { Component } from 'react';
import './styles.css';

function getPosition(elIncoming) {
  let el = elIncoming;

  let xPos = 0;
  let yPos = 0;

  while (el) {
    if (el.tagName === 'BODY') {
      // deal with browser quirks with body/window/document and page scroll
      const xScroll = el.scrollLeft || document.documentElement.scrollLeft;
      const yScroll = el.scrollTop || document.documentElement.scrollTop;

      xPos += (el.offsetLeft - xScroll + el.clientLeft);
      yPos += (el.offsetTop - yScroll + el.clientTop);
    } else {
      // for all other non-BODY elements
      xPos += (el.offsetLeft - el.scrollLeft + el.clientLeft);
      yPos += (el.offsetTop - el.scrollTop + el.clientTop);
    }

    el = el.offsetParent;
  }
  return {
    x: xPos,
    y: yPos,
  };
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
        x1: boxX,
        y1: boxY,
        x2: mouseX,
        y2: mouseY,
        createdAtScale: scale,
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

  // eslint-disable-next-line class-methods-use-this
  drawBox(x1, y1, x2, y2, key) {
    return (
      <div
        key={key}
        style={{
          width: Math.abs(x1 - x2),
          height: Math.abs(y1 - y2),
          top: Math.min(y1, y2),
          left: Math.min(x1, x2),
          position: 'absolute',
          display: 'inline-block',
          float: 'left',
          border: '1px solid #FF0000',
        }}
      />
    );
  }

  render() {
    const { image, scale } = this.props;
    const { boxes } = this.state;

    const workAreaStyle = {
      width: 0,
      height: 0,
      position: 'absolute',
    };

    if (image) workAreaStyle.width = image.width * scale;
    if (image) workAreaStyle.height = image.height * scale;

    // Todo scale created at scale, to now scale
    const spriteBoxes = boxes.map((box, idx) => this.drawBox(box.x1, box.y1, box.x2, box.y2, idx));
    const currentBox = null;

    const overlayStyle = {
      ...workAreaStyle,
      pointerEvents: 'none',
    };

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
        <div
          ref={this.overlayRef}
          style={overlayStyle}
        >
          { currentBox }
          { spriteBoxes }
        </div>
      </div>
    );
  }
}

export default WorkArea;
