import React, {Component} from 'react';
import '../styles.scss';
import {FlexRow} from "./common/FlexRowComponent";
import {LeftMenu} from "./common/LeftMenuComponent";
import axios from 'axios';
import {store} from '../app';
import history from '../history';
import {setBlockchainAddress} from "../actions";
import {HeaderContainer} from "../containers/HeaderContainer";

const ipcRenderer = window.require('electron').ipcRenderer;

ipcRenderer.on('walletAddress', (event, wallet) => {
    store.dispatch(setBlockchainAddress(wallet));
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

        if (this.props.address === null) {
            ipcRenderer.send('requestWalletAddress', {});
        }
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
        return <React.Fragment>
            <HeaderContainer/>
            <FlexRow>
                <LeftMenu/>
                <div className="main-page flex-col">
                    <section className="flex-col pt-3 pb-2 wrap">
                        <div className={this.state.file ? '' : 'display-none'}>
                            <div className="flex-col pb-2">
                                <div className="flex-row flex-centered">
                                    <img src={this.state.file} className="img-preview pb-1" alt=""/>
                                </div>
                                <div className="flex-row flex-centered">
                                    <button onClick={this.onSubmitClick}>Submit</button>
                                </div>
                            </div>
                        </div>
                        <div className="flex-centered">
                            <div className="upload-btn flex-col flex-centered">
                                <div className="flex-row flex-centered" onClick={this.onUploadClick}>
                                    <i className="fa fa-arrow-up"></i>
                                    Upload artwork
                                    <input type="file" className="display-none" ref={this.fileInputRef}
                                           accept="image/*" onChange={this.onAddFile}/>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </FlexRow>
        </React.Fragment>
    }
}