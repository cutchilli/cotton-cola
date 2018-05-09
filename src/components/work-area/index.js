import React, { Component } from 'react';
import './styles.css';

class WorkArea extends Component {
    constructor(...args) {
        super(...args);

        this.canvasRef = React.createRef();
        this.state = {
            canvasTop: 0,
            canvasLeft: 0,
            canvasRight: 0,
            canvasBottom: 0,

            // Current Mouse Pos
            mouseX: 0,
            mouseY: 0,

            // Current Drawing
            isDrawingBox: false,
            boxX: null,
            boxY: null,

            // Historical Boxes
            boxes: []
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

    updateCanvas() {
        const { image, scale } = this.props;

        const canvas = this.canvasRef.current;
        if (!image) return;

        canvas.getContext('2d').drawImage(image, 0, 0, image.width * scale, image.height * scale);
    }

    onCanvasClick(e) {
        const { scale } = this.props;
        const { isDrawingBox, mouseX, mouseY, boxX, boxY, boxes } = this.state;

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
                createdAtScale: scale
            };

            stateModification.boxes = [...boxes, newBox];
            stateModification.boxX = null;
            stateModification.boxY = null;
        }

        this.setState(Object.assign(this.state, stateModification));
        console.log(this.state);
    }

    onCanvasMove(e) {
        this.setState(Object.assign(this.state, {
            mouseX: e.clientX,
            mouseY: e.clientY
        }));
    }

    render() {
        const { image, scale } = this.props;
        const { boxes, canvasBottom, canvasLeft, canvasRight, canvasTop } = this.state;

        const canvasStyle = {
            width: 0,
            height: 0
        };

        if (image) canvasStyle.width = image.width * scale;
        if (image) canvasStyle.height = image.height * scale;
        
        // Todo scale created at scale, to now scale
        const spriteBoxes = boxes.map(box => <div style={{
            width: Math.abs(box.x1 - box.x2),
            height: Math.abs(box.y1 - box.y2),
            top: Math.min(box.y1, box.y2),
            left: Math.min(box.x1, box.x2),
            position: "relative",
            border: "1px solid #FF0000"
        }}></div>);
        const currentBox = null;

        const spriteBoxStyle = {
            pointerEvents: 'none',
            position: 'absolute',
            top: canvasTop,
            bottom: canvasBottom,
            right: canvasRight,
            left: canvasLeft
        };

        return (
            <div>
                <canvas 
                    className="work-area-canvas"
                    onMouseMove={this.onCanvasMove}
                    onClick={this.onCanvasClick}
                    ref={this.canvasRef} 
                    width={canvasStyle.width} 
                    height={canvasStyle.height} 
                    style={canvasStyle}
                />                
                <div style={spriteBoxStyle}>
                    { currentBox }
                    { spriteBoxes }
                </div>
            </div>
        );
    }
}

export default WorkArea;
