import React, {Component} from 'react';


export class MessageBox extends Component {
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