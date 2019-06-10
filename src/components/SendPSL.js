import React, {Component} from 'react';
import {RESPONSE_STATUS_ERROR, RESPONSE_STATUS_OK} from "../constants";
import {defaultSendPslStatusData, store} from "../app";
import {setPSLSendStatusData} from "../actions";
import {MainWrapper} from "./MainWrapperComponent";

const ipcRenderer = window.require('electron').ipcRenderer;

ipcRenderer.on('sendPSLResponse', (event, data) => {
    store.dispatch(setPSLSendStatusData(data));
    setTimeout(() => store.dispatch(setPSLSendStatusData(defaultSendPslStatusData)), 1000);
});

export class SendPSL extends Component {
    constructor(props) {
        super(props);
        this.state = {
            address: '',
            amount: 0.00
        }
    }

    onChange = (e) => {
        this.setState({[e.target.name]: e.target.value});
    };
    onClick = (e) => {
        e.preventDefault();
        let data = this.state;
        ipcRenderer.send('sendPSLRequest', data);
    };

    render() {
        let statusClassName = '';
        if (this.props.sendPslStatusData.status === RESPONSE_STATUS_OK) {
            statusClassName = 'send-psl-ok';
        }
        if (this.props.sendPslStatusData.status === RESPONSE_STATUS_ERROR) {
            statusClassName = 'send-psl-error';
        }

        const infoBlock = <div
            className={`send-psl-status-msg flex-centered ${statusClassName}`}>
            {this.props.sendPslStatusData.msg}
        </div>;

        return <MainWrapper>
            <div className="columns is-account-grid is-multiline">
                <div className="column">
                    <div className="flat-card profile-info-card is-auto">

                        <div className="card-title">
                            <h3>Send PSL</h3>
                        </div>

                        <div className="card-body send-psl-card-body">
                            <div className="columns">
                                <form className="send-psl-form">
                                    <div className="info-block">
                                        <span className="label-text">Address</span>
                                        <div className="control">
                                            <input type="text" className="input is-default" name="address"
                                                   value={this.state.address} onChange={this.onChange}/>
                                        </div>
                                    </div>
                                    <div className="info-block">
                                        <span className="label-text">Amount, PSL</span>
                                        <div className="control">
                                            <input type="number" step="0.0001"
                                                   value={this.state.amount} name="amount" onChange={this.onChange}
                                                   className="input is-default"/>
                                        </div>
                                    </div>
                                    {infoBlock}
                                    <div className="flex-centered">
                                        <button
                                            className="button
                                            cart-button secondary-button upper-button rounded is-bold raised"
                                        onClick={this.onClick}>
                                            Send PSL
                                        </button>
                                    </div>

                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MainWrapper>
            ;
    }
}
