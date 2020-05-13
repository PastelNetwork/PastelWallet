import { combineReducers } from 'redux';
import registration from './registration';
import others from './others';

export default combineReducers({
  registration,
  others
});
