import * as actionTypes from '../actionTypes';

const initialState = {
  fetched: false,
  photo: null,
  firstName: '',
  lastName: '',
  phone: '',
  email: ''
};

export default function (state = initialState, action) {
  switch (action.type) {
    case actionTypes.SET_USER_PROFILE_DATA:
      return { ...state, [action.field]: action.value };
    case actionTypes.RESET_STORE:
      return { ...initialState };
    default:
      return state;
  }
}
