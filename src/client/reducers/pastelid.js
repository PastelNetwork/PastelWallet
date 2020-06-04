import * as actionTypes from '../actionTypes';
import * as constants from '../constants';

const initialState = {
  pastelIDs: null,
  pastelIDError: null,
  currentPastelID: null,
  // currentPastelID: 'jXYkL1nzrubvZNeRgH5hdma4Wry6FzqCNQ8dawyKMpzQrwjgieTAePYYfSLru5yhqGKzDbXbqP3MaxJWdAztas',
  currentPassphrase: '',
  // currentPassphrase: 'taksa',
  pastelIDMsg: null,
  selectedPastelId: null,
  passphrase: '',
  aniKeyError: null,
  aniKeyMsg: null
};

export default function (state = initialState, action) {
  switch (action.type) {
    case actionTypes.SET_PASTEL_ID_LIST:
      return { ...state, pastelIDs: action.value };
    case actionTypes.SET_PASTEL_ID_ERROR:
      return { ...state, pastelIDError: action.value };
    case actionTypes.SET_PASTEL_ID_MSG:
      return { ...state, pastelIDMsg: action.value };
    case actionTypes.SET_CURRENT_PASTEL_ID:
      return { ...state, currentPastelID: action.value };
    case actionTypes.SET_SELECTED_PASTEL_ID:
      return { ...state, selectedPastelId: action.value };
    case actionTypes.SET_SELECTED_PASSPHRASE:
      return { ...state, passphrase: action.value };
    case actionTypes.SET_CURRENT_PASSPHRASE:
      return { ...state, currentPassphrase: action.value };
    case actionTypes.SET_ANI_KEY_ERROR:
      return { ...state, aniKeyError: action.value };
    case actionTypes.SET_ANI_KEY_MSG:
      return { ...state, aniKeyMsg: action.value };
    case actionTypes.RESET_STORE:
      return { ...initialState };
    default:
      return state;
  }
}
