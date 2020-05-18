import * as actionTypes from '../actionTypes';

const initialState = {
  data: null,
  loading: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case actionTypes.SET_ARTWORKS_DATA:
      return { ...state, data: action.value };
    case actionTypes.SET_ARTWORKS_DATA_LOADING:
      return { ...state, loading: action.value };
    default:
      return state;
  }
}
