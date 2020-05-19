import * as actionTypes from '../actionTypes';

const getSampleSaleData = () => {
  if (Math.random() <= 0.33) {
    return {
      forSale: true,
      price: Math.floor(Math.random()*10000)
    };
  } else {
    return {
      forSale: false,
      price: -1
    };
  }
};
const initialState = {
  data: null,
  loading: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case actionTypes.SET_ARTWORKS_DATA:
      const artworksData = action.value.map(x => ({...x, saleData: getSampleSaleData()}));
      return { ...state, data: artworksData };
    case actionTypes.SET_ARTWORKS_DATA_LOADING:
      return { ...state, loading: action.value };
    default:
      return state;
  }
}
