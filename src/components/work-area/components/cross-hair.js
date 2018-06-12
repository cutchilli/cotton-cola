import React from 'react';

const CrossHair = ({ overlayStyle, x, y }) => {
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
};

export default CrossHair;
