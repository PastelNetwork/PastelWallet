import React, {Component} from 'react';
import {toggleMessageBox} from "../../actions";

export class MessageBox extends Component {

    onBodyClick = () => {
        this.props.dispatch(toggleMessageBox());
    };

    render() {
        const bodyClassName = this.props.collapsed ? "message-box-body collapsed" : "message-box-body";
        const messages = this.props.collapsed ? null : this.props.messages.map(x => <div
            className="message-box-item">{x}</div>);

        return <div className="message-box-wrapper">
            <div className={bodyClassName} onClick={this.onBodyClick}>
                {messages}
            </div>
        </div>
    }
}