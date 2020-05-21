import { combineReducers } from 'redux';
import registration from './registration';
import others from './others';
import artworks from './artworks';
import blockchain from './blockchain';
import pastelid from './pastelid';
import profile from './profile';

export default combineReducers({
  registration,
  others,
  artworks,
  blockchain,
  pastelid,
  profile
});
