import React, {Component} from 'react';
import {toggleMessageBox} from "../../actions";
import {store} from "../../app";
import {addMessage} from "../../actions";

const ipcRenderer = window.require('electron').ipcRenderer;

ipcRenderer.on('addMessageToBox', (event, data) => {
    store.dispatch(addMessage(data.msg))
});


export class MessageBox extends Component {

    onBodyClick = () => {
        this.props.dispatch(toggleMessageBox());
    };

    render() {
        const bodyClassName = this.props.collapsed ? "message-box-body collapsed" : "message-box-body";
        const messages = this.props.collapsed ? null : this.props.messages.map((x, i) => <div
            className="message-box-item" key={i}>{x}</div>);

        return <div className="message-box-wrapper">
            <div className={bodyClassName} onClick={this.onBodyClick}>
                {messages}
            </div>
        </div>
    }
}