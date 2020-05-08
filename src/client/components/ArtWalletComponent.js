import React, {Component} from 'react';
import '../../client/styles.scss';
import {store} from '../../client/app';
import {setBalance, setBlockchainAddress} from "../../client/actions";
import {RESPONSE_STATUS_OK} from "../../client/constants";
import '../assets/scss/core.scss';
import '../assets/scss/custom.scss';
import 'bulma/bulma.sass';
import {BalancesContainer} from "../containers/dashboard/BalancesContainer";
import {Profile} from "./dashboard/ProfileComponent";
import {MainWrapper} from "./MainWrapperComponent";
import { SET_ARTWORK_QUANTITY, SET_MASTERNODE_QUANTITY } from '../../client/actionTypes';

const ipcRenderer = window.require('electron').ipcRenderer;



export class ArtWallet extends Component {
    componentDidMount() {
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
