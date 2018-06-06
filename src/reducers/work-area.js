import {
  SET_WORK_AREA_IMAGE,
  SET_WORK_AREA_SCALE,
 } from '../actions';

const defaultState = {
  image: null,
  scale: 1,
};

const workArea = (state = defaultState, action) => {
  switch (action.type) {
    case SET_WORK_AREA_IMAGE:
      return {
        ...state,
        image: action.image,
      };
    case SET_WORK_AREA_SCALE:
      return {
        ...state,
        scale: action.scale,
      };
    default:
      return state;
  }
};

export default workArea;
