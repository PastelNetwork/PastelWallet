import * as actionTypes from '../actionTypes';

// const getSampleSaleData = () => {
//   if (Math.random() <= 0.00001) {
//     return {
//       forSale: true,
//       price: Math.floor(Math.random()*10000)
//     };
//   } else {
//     return {
//       forSale: false,
//       price: -1
//     };
//   }
// };
const initialState = {
  data: null,
  loading: false,
  artwork_sell_loading: [],
  sell_error: undefined
};

export default function(state = initialState, action) {
  switch (action.type) {
    case actionTypes.SET_ARTWORKS_DATA:
      return { ...state, data: action.value };
    case actionTypes.SET_ARTWORKS_DATA_LOADING:
      return { ...state, loading: action.value };
    case actionTypes.RESET_STORE:
      return { ...initialState };
    case actionTypes.ADD_ARTWORK_TO_SELL_LOADING:
      return { ...state,  artwork_sell_loading: [...state.artwork_sell_loading, action.artwork_hash]};
    case actionTypes.REMOVE_ARTWORK_FROM_SELL_LOADING:
      return { ...state,  artwork_sell_loading: []};
    case actionTypes.SET_TICKET_ERROR:
      return { ...state,  sell_error: action.error};
    case actionTypes.SET_TICKET_MSG:
      return { ...state,  sell_message: action.message};
    default:
      return state;
  }
}
