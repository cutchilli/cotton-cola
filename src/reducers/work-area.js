import {
  SET_WORK_AREA_IMAGE,
  SET_WORK_AREA_SCALE,
  UPDATE_SPRITE,
} from '../actions';

const defaultState = {
  image: null,
  scale: 1,

  imageName: null,
  sprites: {},
  snimations: {},
};

const workArea = (state = defaultState, action) => {
  switch (action.type) {
    case SET_WORK_AREA_IMAGE:
      return {
        ...state,
        image: action.image,
        imageName: action.imageName,
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
