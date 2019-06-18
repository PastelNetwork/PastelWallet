import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import thunkMiddleware from 'redux-thunk'
import {createStore, applyMiddleware, compose} from 'redux';
import {Router} from 'react-router-dom';
import reducer from './reducers';
import * as ajaxEntities from './ajaxEntities';
import 'font-awesome/css/font-awesome.css';
import Main from "./components/MainComponent";
import history from './history';


let defaultAjaxInProgress = Object.getOwnPropertyNames(ajaxEntities).filter(a => a !== '__esModule').reduce((acc, curr) => {
    acc[ajaxEntities[curr]] = false;
    return acc;
}, {});

export const defaultProfileEditMode = {
    picture: false,
    details: false,
    billingAddress: false
};

export const defaultDetailsToEdit = {
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
};

export const defaultSendPslStatusData = {status: null, msg: ''};

export const initialState = {
    ajaxInProgress: defaultAjaxInProgress,
    userProfile: null,
    profileEditMode: defaultProfileEditMode,
    detailsToEdit: defaultDetailsToEdit,
    blockchainData: {address: null, pastelID: null},
    balance: null,
    sendPslStatusData: defaultSendPslStatusData,
    artworks: 16, // TODO: fetch amount of artworks from pastel network when backend is ready
    masternodes: 2 // TODO: fetch amount of masternodes from pastel network when backend is ready
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
