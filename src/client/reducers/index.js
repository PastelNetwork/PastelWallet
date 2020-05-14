import { combineReducers } from 'redux';
import registration from './registration';
import others from './others';
import artworks from './artworks';

export default combineReducers({
  registration,
  others,
  artworks
});
