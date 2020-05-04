import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import { createStore, applyMiddleware, compose } from 'redux';
import { Router } from 'react-router-dom';
import reducer from './reducers';
import * as ajaxEntities from './ajaxEntities';
import Main from './components/MainComponent';
import history from './history';
import * as constants from './constants';
import './styles.scss';
import './ipc/index';

let defaultAjaxInProgress = Object.getOwnPropertyNames(ajaxEntities).filter(a => a !== '__esModule').reduce((acc, curr) => {
  acc[ajaxEntities[curr]] = false;
  return acc;
}, {});

export const defaultSendPslStatusData = { status: null, msg: '' };

export const initialState = {
  ajaxInProgress: defaultAjaxInProgress,
  userProfile: null,
  blockchainAddress: null,
  balance: null,
  sendPslStatusData: defaultSendPslStatusData,
  artworks: 0,
  masternodes: 0,
  regFormError: {},
  regFormState: constants.IMAGE_REG_FORM_STATE_DEFAULT,
  cNodeStatus: constants.CNODE_STATUS_PENDING,
  pyNodeStatus: constants.PYNODE_STATUS_PENDING,
  userDisplayMessages: [],
  messageBoxCollaped: true,
  pastelIDs: null,
  pastelIDError: null,
  currentPastelID: null,
  currentPassphrase: '',
  artworksData: null,
  artworksDataLoading: false
};

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const store = createStore(reducer,
  initialState,
  composeEnhancers(applyMiddleware(thunkMiddleware))
  // applyMiddleware(thunkMiddleware)
);

// const store = createStore(reducer,
//     defaultStore,
//     window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <Main/>
    </Router>
  </Provider>,
  document.getElementById('root'));
