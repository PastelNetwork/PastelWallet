import React, {Component} from 'react';
import {MainWrapperContainer} from "../containers/MainWrapperContainer";
const ipcRenderer = window.require('electron').ipcRenderer;

export class SendPSL extends Component {
    constructor(props) {
        super(props);
        this.state = {
            address: '',
            amount: 0.00
        }
    }
    onChange = (e) => {
        const val = e.target.value;
        this.setState({[e.target.name]: e.target.value});
    };
    onClick = (e) => {
        e.preventDefault();
        let data = this.state;
        ipcRenderer.send('sendPSLRequest', data);
    };
    render() {
        return <MainWrapperContainer>
            <section className="flex-col pt-3 pb-2 wrap">
                <form>
                    <input type="text" className="psl-send-input" placeholder="Address" name="address"
                           value={this.state.address} onChange={this.onChange}
                    />
                    <input type="number" step="0.0001" className="psl-send-input" placeholder="Amount, PSL"
                           value={this.state.amount} name="amount" onChange={this.onChange}
                    />
                    <div className="flex-centered">
                        <button className="send-psl-button" onClick={this.onClick}>Send</button>
                    </div>
                </form>
            </section>
        </MainWrapperContainer>;
    }
}
