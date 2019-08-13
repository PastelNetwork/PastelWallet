import React, {Component} from 'react';

export class MessageBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            collapsed: false
        }
    }

    onBodyClick = () => {
        this.setState({collapsed: !this.state.collapsed});
    };

    render() {
        const bodyClassName = this.state.collapsed ? "message-box-body collapsed" : "message-box-body";
        const messages = this.state.collapsed ? null : <React.Fragment>
            <div className="message-box-item">12;12;12 WARNING connected to cNode</div>
            <div className="message-box-item">12;12;12 WARNING connected to cNode</div>
            <div className="message-box-item">12;12;12 WARNING connected to cNode</div>
            <div className="message-box-item">12;12;12 WARNING connected to cNode</div>
        </React.Fragment>;
        return <div className="message-box-wrapper">
            <div className={bodyClassName} onClick={this.onBodyClick}>
                {messages}
            </div>
        </div>
    }
}