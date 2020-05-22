import * as actionTypes from '../actionTypes';

const initialState = {
  blockchainAddress: null,
  balance: null,
  artworks: 0,
  masternodes: 0,
  blockchainInfo: null,
  peerInfo: null
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
    case actionTypes.SET_BLOCKCHAIN_INFO:
      return { ...state, blockchainInfo: action.value };
    case actionTypes.SET_PEER_INFO:
      return { ...state, peerInfo: action.value };
    case actionTypes.RESET_STORE:
      return { ...initialState };
    default:
      return state;
  }
}
