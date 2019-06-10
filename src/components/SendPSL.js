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
            className={`send-psl-status-msg ${statusClassName}`}>
            {this.props.sendPslStatusData.msg}
        </div>;
        return <MainWrapper>
            <form>
                <input type="text" className="psl-send-input" placeholder="Address" name="address"
                       value={this.state.address} onChange={this.onChange}
                />
                <input type="number" step="0.0001" className="psl-send-input" placeholder="Amount, PSL"
                       value={this.state.amount} name="amount" onChange={this.onChange}
                />
                {infoBlock}
                <div className="flex-centered">
                    <button className="send-psl-button" onClick={this.onClick}>Send</button>
                </div>
            </form>
        </MainWrapper>;
    }
}
