import * as constants from '../constants';
import * as actionTypes from '../actionTypes';

const initialState = {
  regFormState: constants.IMAGE_REG_FORM_STATE_DEFAULT,
  regFormError: {},
  regticketId: null,
  regFormFee: 0,
  regFormTxid: null,
  regFormTxidAct: null,
  workerFee: null,
  imageRegFormMessage: ''
};

export default function(state = initialState, action) {
  switch (action.type) {
    case actionTypes.SET_IMAGE_REGISTER_FORM_ERROR:
      return { ...state, regFormError: { ...state.regFormError, [action.key]: action.value } };
    case actionTypes.RESET_IMAGE_REGISTER_FORM_ERRORS:
      return { ...state, regFormError: {} };
    case actionTypes.SET_IMAGE_REGTICKET_ID:
      return { ...state, regticketId: action.value };
    case actionTypes.SET_IMAGE_REGISTER_FORM_STATE:
      return { ...state, regFormState: action.value };
    case actionTypes.SET_IMAGE_REGISTER_FORM_FEE:
      return { ...state, regFormFee: action.value };
    case actionTypes.SET_IMAGE_REGISTER_FORM_TXID:
      return { ...state, regFormTxid: action.value };
    case actionTypes.SET_IMAGE_REGISTER_FORM_TXID_ACT_TICKET:
      return { ...state, regFormTxidAct: action.value };
    case actionTypes.SET_IMAGE_REGISTER_WORKER_FEE:
      return { ...state, workerFee: action.value };
    case actionTypes.SET_IMAGE_REGISTER_MESSAGE:
      return { ...state, imageRegFormMessage: action.value };

    default:
      return state;
  }
}
