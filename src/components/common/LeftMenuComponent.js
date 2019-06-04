import React, {Component} from 'react';
import {withRouter} from 'react-router-dom'
import '../../styles.scss';
import history from '../../history';

class LeftMenuWithoutRouter extends Component {
    render() {
        const path = this.props.location.pathname;
        return <aside className={this.props.show ? "aside flex-col" : "aside flex-col aside-hidden"}>
            <div className={"left-menu-point " + (path==="/" ? "selected": "")} onClick={() => history.push('/')}>Profile</div>
            <div className={"left-menu-point " + (path==="/send_psl" ? "selected": "")} onClick={() => history.push('/send_psl')}>Send PSL</div>
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

export const LeftMenu = withRouter(LeftMenuWithoutRouter);
