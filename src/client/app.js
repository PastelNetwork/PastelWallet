import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import { createStore, applyMiddleware, compose } from 'redux';
import { Router } from 'react-router-dom';
import reducer from './reducers';
import Main from './components/MainComponent';
import history from './history';
import './styles.scss';
import './ipc/index';


const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const store = createStore(reducer,
  composeEnhancers(applyMiddleware(thunkMiddleware))
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
