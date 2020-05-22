import * as actionTypes from '../actionTypes';

const initialState = {
  photo: null,
  firstName: '',
  lastName: '',
  phone: '',
  email: '',
  errors: []
};

const editFields = ['photo', 'firstName', 'lastName', 'phone', 'email'];

export default function (state = initialState, action) {
  switch (action.type) {
    case actionTypes.SET_USER_PROFILE_DATA:
      if (editFields.includes(action.field)) {
        return { ...state, [action.field]: action.value };
      } else {
        return state;
      }
    case actionTypes.SET_USER_PROFILE_EDIT_DATA:
      return { ...state, [action.field]: action.value };
    case actionTypes.RESET_STORE:
      return { ...initialState };
    default:
      return state;
  }
}
