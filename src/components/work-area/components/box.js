import React from 'react';

const Box = ({
  scale,
  fill,
  x1,
  y1,
  x2,
  y2,
}) => {
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
      style={style}
    />
  );
};

export default Box;
