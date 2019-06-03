import React, {Component} from 'react';
import '../styles.scss';
import {store} from '../app';
import history from '../history';
import {setBalance, setBlockchainAddress, setBlockchainData, setPastelAddress} from "../actions";
import {RESPONSE_STATUS_OK} from "../constants";
import {MainWrapperContainer} from "../containers/MainWrapperContainer";

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
        return <MainWrapperContainer>
            <section className="flex-row wrap">
                <div className="flex-col half addreses">
                    <div className="pl-1 pt-1">
                        Balance
                    </div>
                    <div className="pl-1 pt-0_5 bc-address">
                        <div className="framed">
                            {this.props.balance === null ? 'Loading...' : +this.props.balance + ' PSL'}
                        </div>
                    </div>
                    <div className="pl-1 pt-1">
                        My wallet address
                    </div>
                    <div className="pl-1 pt-0_5 bc-address">
                        <div className="framed">
                            {this.props.address || 'Loading...'}
                        </div>
                    </div>
                    <div className="pl-1 pt-1">
                        My Pastel ID
                    </div>
                    <div className="pl-1 pt-0_5 bc-address">
                        <div className="framed">
                            {this.props.pastelID || 'Loading...'}
                        </div>
                    </div>
                </div>
                <div className="half flex-centered">
                    <div className="p-1">
                        <img src="https://i.pravatar.cc/200" alt="profile pic" className="avagar-pic"/>
                    </div>

                </div>
            </section>
            <section className="flex-col">
                <div className="flex-centered">
                    <h2>Artworks</h2>
                </div>
                <div className="wrap flex-row">
                    <div className="artwork-container p-1">
                        <div className="upload-btn flex-centered flex-row" onClick={this.onUploadClick}>
                            <div className="flex-centered flex-col">
                                <i className="fa fa-plus"></i>
                            </div>
                        </div>
                    </div>
                    <div className="artwork-container p-1">
                        <img src="https://via.placeholder.com/150" alt="artwork" className="artwork-img"/>
                    </div>
                    <div className="artwork-container p-1">
                        <img src="https://via.placeholder.com/150" alt="artwork" className="artwork-img"/>
                    </div>
                    <div className="artwork-container p-1">
                        <img src="https://via.placeholder.com/150" alt="artwork" className="artwork-img"/>
                    </div>
                    <div className="artwork-container p-1">
                        <img src="https://via.placeholder.com/150" alt="artwork" className="artwork-img"/>
                    </div>
                </div>
            </section>
        </MainWrapperContainer>;
    }
}