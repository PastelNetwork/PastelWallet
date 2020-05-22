import * as actionTypes from '../actionTypes';
import * as constants from '../constants';

const initialState = {
  cNodeStatus: constants.NODE_STATUS_PENDING,
  pyNodeStatus: constants.NODE_STATUS_PENDING,
  userDisplayMessages: [],
  pslSendError: null
};

export default function (state = initialState, action) {
  switch (action.type) {
    case actionTypes.SET_CNODE_STATUS:
      return { ...state, cNodeStatus: action.value };
    case actionTypes.SET_PYNODE_STATUS:
      return { ...state, pyNodeStatus: action.value };
    case actionTypes.ADD_MESSAGE:
      return { ...state, userDisplayMessages: [...state.userDisplayMessages, action.value] };
    case actionTypes.SET_PSL_SEND_ERROR:
      return { ...state, pslSendError: action.value };
    case actionTypes.RESET_STORE:
      return { ...initialState };
    default:
      return state;
  }
}
