import React, {Component} from 'react';
import '../styles.scss';
import {store} from '../app';
import history from '../history';
import {setBalance, setBlockchainData} from "../actions";
import {RESPONSE_STATUS_OK} from "../constants";
import * as PastelLogo from '../assets2/image/pastel_logo.png';
import * as PastelFavicon from '../assets/images/favicon.png';
import '../assets/scss/core.scss';
import '../assets/scss/custom.scss';
import {MainWrapperContainer} from "../containers/MainWrapperContainer";
import 'bulma/bulma.sass';
import {BalancesContainer} from "../containers/dashboard/BalancesContainer";
import {Profile} from "./dashboard/ProfileComponent";
import * as Feather from 'react-feather';

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
        return <React.Fragment>
            <div className="main-sidebar">
                <div className="sidebar-brand">
                    <a href="pastel-.html"><img src={PastelFavicon} alt=""/></a>
                </div>
                <div className="sidebar-inner">
                    <ul className="icon-menu">
                        <li>
                            <a href="javascript:void(0);" id="open-shop" className="has-popover-top"
                               data-placement="right">
                                <Feather.User/>
                            </a>
                        </li>
                        <li className=" ">
                            <a href="/pastel-wallet" className="has-popover-top" data-placement="right">
                                <Feather.Folder/>
                            </a>
                        </li>

                        <li className="">
                            <a href="pastel-categories.html" className="has-popover-top" data-placement="right">
                                <Feather.Grid/>
                            </a>
                        </li>
                        
                        <li className="">
                            <a href="pastel-sell.html" className="has-popover-top" data-placement="right">
                                <Feather.UploadCloud/>
                            </a>
                        </li>
                        <li className="">
                            <a href="pastel-masternodes.html" className="has-popover-top" data-placement="right">
                                <Feather.Layers/>
                            </a>
                        </li>
                        
                        <li className="is-hidden-desktop is-hidden-tablet">
                            <a href="javascript:void(0);" id="mobile-mode"><i data-feather="smartphone"></i></a>
                        </li>
                    </ul>
                    
                    <ul className="bottom-menu is-hidden-mobile">
                        <li>
                            <a href="authentication.html"><i data-feather="log-out"></i></a>
                        </li>
                    </ul>
                </div>
            </div>


            <div className="section">
                <div className="container">
                    <div className="columns account-header">
                        <div className="column is-10 is-offset-1 is-tablet-landscape-padded">

                            <div className="account-title">
                                <img className="brand-filigrane" src={PastelLogo} alt=""/>
                            </div>

                            <div className="columns is-account-grid is-multiline">
                                <BalancesContainer/>
                                <Profile/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>;
    }
}
