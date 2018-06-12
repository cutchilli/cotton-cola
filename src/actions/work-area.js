export const SET_WORK_AREA_IMAGE = 'SET_WORK_AREA_IMAGE';
export const SET_WORK_AREA_SCALE = 'SET_WORK_AREA_SCALE';

export const UPDATE_SPRITE = 'UPDATE_SPRITE';

export const setWorkAreaImage = image => ({
  type: SET_WORK_AREA_IMAGE,
  image,
});

export const setWorkAreaScale = scale => ({
  type: SET_WORK_AREA_SCALE,
  scale,
});

export const addOrUpdateSprite = sprite => ({
  type: UPDATE_SPRITE,
  sprite,
});

