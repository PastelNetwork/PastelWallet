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
import 'bulma/bulma.sass';
import {BalancesContainer} from "../containers/dashboard/BalancesContainer";
import {Profile} from "./dashboard/ProfileComponent";
import {SideBar} from "./common/SideBarComponent";
import {MainWrapper} from "./MainWrapperComponent";

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
        return <MainWrapper>
            <div className="columns is-account-grid is-multiline">
                <BalancesContainer/>
                <Profile/>
            </div>
        </MainWrapper>;
    }
}
