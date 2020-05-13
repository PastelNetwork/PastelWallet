import * as actionTypes from '../actionTypes';
import * as constants from '../constants';

const initialState = {
  userProfile: null,
  blockchainAddress: null,
  balance: null,
  artworks: 0,
  masternodes: 0,
  cNodeStatus: constants.NODE_STATUS_PENDING,
  pyNodeStatus: constants.NODE_STATUS_PENDING,
  userDisplayMessages: [],
  pastelIDs: null,
  pastelIDError: null,
  currentPastelID: null,
  currentPassphrase: '',
  artworksData: null,
  artworksDataLoading: false,
  blockchainInfo: null,
  pslSendError: null
};

export default function (state = initialState, action) {
  switch (action.type) {
    case actionTypes.SET_BLOCKCHAIN_ADDRESS:
      return { ...state, blockchainAddress: action.value };
    case actionTypes.SET_MASTERNODE_QUANTITY:
      return { ...state, masternodes: action.value };
    case actionTypes.SET_ARTWORK_QUANTITY:
      return { ...state, artworks: action.value };
    case actionTypes.SET_BALANCE:
      return { ...state, balance: action.value };
    case actionTypes.SET_USER_PROFILE:
      return { ...state, userProfile: action.value };
    case actionTypes.SET_CNODE_STATUS:
      return { ...state, cNodeStatus: action.value };
    case actionTypes.SET_PYNODE_STATUS:
      return { ...state, pyNodeStatus: action.value };
    case actionTypes.ADD_MESSAGE:
      return { ...state, userDisplayMessages: [...state.userDisplayMessages, action.value] };
    case actionTypes.SET_PASTEL_ID_LIST:
      return { ...state, pastelIDs: action.value };
    case actionTypes.SET_PASTEL_ID_ERROR:
      return { ...state, pastelIDError: JSON.stringify(action.value) };
    case actionTypes.SET_CURRENT_PASTEL_ID:
      return { ...state, currentPastelID: action.value };
    case actionTypes.SET_CURRENT_PASSPHRASE:
      return { ...state, currentPassphrase: action.value };
    case actionTypes.SET_ARTWORKS_DATA:
      return { ...state, artworksData: action.value };
    case actionTypes.SET_ARTWORKS_DATA_LOADING:
      return { ...state, artworksDataLoading: action.value };
    case actionTypes.SET_BLOCKCHAIN_INFO:
      return { ...state, blockchainInfo: action.value };
    case actionTypes.SET_PSL_SEND_ERROR:
      return { ...state, pslSendError: action.value };
    case actionTypes.RESET_STORE:
      return { ...initialState };
    default:
      return state;
  }
}
