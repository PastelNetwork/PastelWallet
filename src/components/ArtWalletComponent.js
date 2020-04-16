import React, {Component} from 'react';
import '../styles.scss';
import {store} from '../app';
import {setBalance, setBlockchainAddress} from "../actions";
import {RESPONSE_STATUS_OK} from "../constants";
import '../assets/scss/core.scss';
import '../assets/scss/custom.scss';
import 'bulma/bulma.sass';
import {BalancesContainer} from "../containers/dashboard/BalancesContainer";
import {Profile} from "./dashboard/ProfileComponent";
import {MainWrapper} from "./MainWrapperComponent";
import { SET_ARTWORK_QUANTITY, SET_MASTERNODE_QUANTITY } from '../actionTypes';

const ipcRenderer = window.require('electron').ipcRenderer;

ipcRenderer.on('blockchainDataResponse', (event, data) => {
    if (data.status === RESPONSE_STATUS_OK) {
        console.log(data);
        store.dispatch({type: SET_MASTERNODE_QUANTITY, value: data.mnQuantity});
        store.dispatch({type: SET_ARTWORK_QUANTITY, value: data.artworkAmount});
        store.dispatch(setBlockchainAddress(data.address));
    } else {
        // if error - try until service will start

        setTimeout(() => {
            ipcRenderer.send('blockchainDataRequest', {})
        }, 500);
    }
});

ipcRenderer.on('getBalanceResponse', (event, data) => {
    if (data.status === RESPONSE_STATUS_OK) {
        store.dispatch(setBalance(data.balance));
    } else {
        // if error - try until service will start
        setTimeout(() => {
            ipcRenderer.send('getBalanceResponse', {})
        }, 1000);
    }
});


export class ArtWallet extends Component {
    componentDidMount() {
        document.title = 'Pastel wallet';
        ipcRenderer.send('blockchainDataRequest', {});
        ipcRenderer.send('getBalanceRequest', {});
    }

    render() {
        return <MainWrapper>
            <div className="columns is-account-grid is-multiline">
                <BalancesContainer/>
                <Profile/>
            </div>
        </MainWrapper>;
    }
}
