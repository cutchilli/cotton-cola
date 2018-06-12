import {
  SET_WORK_AREA_IMAGE,
  SET_WORK_AREA_SCALE,
  UPDATE_SPRITE,
} from '../actions';

const defaultState = {
  image: null,
  scale: 1,
  sprites: {},
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
    case UPDATE_SPRITE:
      return {
        ...state,
        sprites: {
          ...state.sprites,
          [action.sprite.name]: action.sprite,
        },
      };
    default:
      return state;
  }
};

export default workArea;
