import React, {Component} from 'react';
import '../../styles.scss';
import history from '../../history';

export class LeftMenu extends Component {
    render() {
        return <aside className={this.props.show ? "aside flex-col" : "aside flex-col aside-hidden"}>
            <div className="left-menu-point selected" onClick={() => history.push('/')}>Profile</div>
            <div className="left-menu-point">Dashboard</div>
            <div className="left-menu-point">My Art (Wallet)</div>
            <div className="left-menu-point">Messages</div>
            <div className="left-menu-point">Activity</div>
            <div className="left-menu-point">Transactions</div>
            <div className="left-menu-point">Masternode</div>
        </aside>
    }
}

export const LeftDummy = (props) => {
    return <aside className={props.show ? "left-dummy" : "left-dummy-hidden"}>
    </aside>;
};