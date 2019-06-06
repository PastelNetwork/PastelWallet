import React, {Component} from 'react';
import '../styles.scss';
import {store} from '../app';
import history from '../history';
import {setBalance, setBlockchainData} from "../actions";
import {RESPONSE_STATUS_OK} from "../constants";
import * as PastelLogo from '../assets2/image/pastel_logo.png';
import '../assets/scss/core.scss';
import '../assets/scss/custom.scss';
import {MainWrapperContainer} from "../containers/MainWrapperContainer";
import 'bulma/bulma.sass';

const ipcRenderer = window.require('electron').ipcRenderer;

ipcRenderer.on('blockchainDataResponse', (event, data) => {
    if (data.status === RESPONSE_STATUS_OK) {
        store.dispatch(setBlockchainData(data));
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
    constructor(props) {
        super(props);
        this.fileInputRef = React.createRef();
        this.state = {
            file: null
        }
    }

    componentDidMount() {
        document.title = 'Pastel wallet';
        ipcRenderer.send('blockchainDataRequest', {});
        ipcRenderer.send('getBalanceRequest', {});
    }

    onUploadClick = () => {
        history.push('/register');
        // this.fileInputRef.current.click();
    };
    onAddFile = (e) => {
        let file = this.fileInputRef.current.files[0];
        this.setState({file: URL.createObjectURL(file)});
    };
    onSubmitClick = (e) => {
        let file = this.fileInputRef.current.files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
            const data = e.targer.result;
            //TODO: push result to django backend
            // axios.post()
        };
        reader.readAsBinaryString(file);
    };

    render() {
        const mainPageClass = this.props.leftMenuShow ? "main-page flex-col menu-expanded" : "main-page flex-col";
        return <div className="section">
            <div className="container">
                <div className="columns account-header">
                    <div className="column is-10 is-offset-1 is-tablet-landscape-padded">

                        <div className="account-title">
                            <img className="brand-filigrane" src={PastelLogo} alt=""/>
                        </div>

                        <div className="columns is-account-grid is-multiline">



                            <div className="column is-7">
                                <div className="flat-card profile-info-card is-auto">

                                    <div className="card-title">
                                        <h3>Balances</h3>
                                    </div>

                                    <div className="card-body">
                                        <div className="columns">
                                            <div className="column balance-col">
                                                {this.props.balance} PSL
                                            </div>
                                            <div className="column balance-col">
                                                {this.props.artworks} Artworks
                                            </div>
                                            <div className="column balance-col">
                                                {this.props.masternodes} Masternodes
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="column is-5">

                                <div className="flat-card profile-card is-auto">
                                    <div className="card-body">
                                        <div className="profile-image">
                                            <img src="http://via.placeholder.com/250x250" alt=""/>
                                        </div>
                                        <div className="username has-text-centered">
                                            <span>Elie Daniels</span>
                                            <small>Member since Sep 23 2017</small>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>;
    }
}
