import React, { Component } from 'react';

function getPosition(elIncoming) {
  let el = elIncoming;

  let xPos = 0;
  let yPos = 0;

  while (el) {
    if (el.tagName === 'BODY') {
      // deal with browser quirks with body/window/document and page scroll
      const xScroll = el.scrollLeft || document.documentElement.scrollLeft;
      const yScroll = el.scrollTop || document.documentElement.scrollTop;

      xPos += ((el.offsetLeft - xScroll) + el.clientLeft);
      yPos += ((el.offsetTop - yScroll) + el.clientTop);
    } else {
      // for all other non-BODY elements
      xPos += ((el.offsetLeft - el.scrollLeft) + el.clientLeft);
      yPos += ((el.offsetTop - el.scrollTop) + el.clientTop);
    }

    el = el.offsetParent;
  }
  return {
    x: xPos,
    y: yPos,
  };
}

function drawBox(scale, fill, x1, y1, x2, y2, key) {
  const style = {
    width: Math.abs(x1 - x2) * scale,
    height: Math.abs(y1 - y2) * scale,
    top: Math.min(y1, y2) * scale,
    left: Math.min(x1, x2) * scale,
    position: 'absolute',
    display: 'inline-block',
    border: '1px solid #FF0000',
  };

  if (fill) {
    style.backgroundColor = 'white';
    style.opacity = 0.5;
  }

  return (
    <div
      key={key}
      style={style}
    />
  );
}

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
      .map((box, idx) => drawBox(scale, false, box.x1, box.y1, box.x2, box.y2, idx));
    const currentBox = null;

    // Draw current box
    if (isDrawingBox) {
      spriteBoxes.push(drawBox(1, true, boxX, boxY, mouseX, mouseY, -1));
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
          { currentBox }
          { spriteBoxes }
        </div>
      </div>
    );
  }
}

export default WorkArea;
