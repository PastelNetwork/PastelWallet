import React, {Component} from 'react';
import '../../styles.scss';

export class LeftMenu extends Component {
    render() {
        return <aside className={this.props.show ? "aside flex-col" : "display-none"}>
            <div className="left-menu-point selected">Dashboard</div>
            <div className="left-menu-point">Profile</div>
            <div className="left-menu-point">My Art (Wallet)</div>
            <div className="left-menu-point">Messages</div>
            <div className="left-menu-point">Activity</div>
            <div className="left-menu-point">Transactions</div>
            <div className="left-menu-point">Masternode</div>
        </aside>
    }
}
