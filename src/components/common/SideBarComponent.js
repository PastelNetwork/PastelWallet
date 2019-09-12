import React, {Component} from 'react';
import {withRouter} from 'react-router-dom'
import '../../styles.scss';
import history from '../../history';
import * as PastelFavicon from '../../assets/images/favicon.png';
import * as Feather from 'react-feather';
import {connect} from "react-redux";
import {Balances} from "../dashboard/BalancesComponent";

const LeftMenuPoint = (props) => {
    if (props.active) {
        return <li className="">
            {props.children}
        </li>
    } else {
        return <li className="">
            <a href="#" onClick={props.onClick}>
                {props.children}
            </a>
        </li>
    }
};

class SideBarWithoutRouter extends Component {
    onLinkClick = (address) => {
        if (this.props.currentPastelID !== null) {
            history.push(address);
        }
    };

    render() {
        const path = this.props.location.pathname;
        const sidebarMenu = this.props.currentPastelID !== null ? (<div className="sidebar-inner">
            <ul className="icon-menu">
                <LeftMenuPoint active={path === "/wallet"}
                               onClick={() => this.onLinkClick('/wallet')}>
                    <Feather.User/>
                </LeftMenuPoint>
                <LeftMenuPoint active={path === "/send_psl"}
                               onClick={() => this.onLinkClick('/send_psl')}>
                    <Feather.DollarSign/>
                </LeftMenuPoint>
                <LeftMenuPoint active={path === "/register"}
                               onClick={() => this.onLinkClick('/register')}>
                    <Feather.Plus/>
                </LeftMenuPoint>


                {/*TODO: the following menu points are just placeholders*/}
                {/*<LeftMenuPoint active={path === "/grid"} onClick={() => this.onLinkClick('/grid')}>*/}
                {/*<Feather.Grid/>*/}
                {/*</LeftMenuPoint>*/}
                {/*<LeftMenuPoint active={path === "/layers"} onClick={() => this.onLinkClick('/layers')}>*/}
                {/*<Feather.Layers/>*/}
                {/*</LeftMenuPoint>*/}
            </ul>
        </div>) : null;
        return <div className="main-sidebar">
            <div className="sidebar-brand">
                <img src={PastelFavicon} alt=""/>
            </div>
            {sidebarMenu}
        </div>;
    }
}

export const SideBar = withRouter(connect(state => ({
    currentPastelID: state.currentPastelID
}), null)(SideBarWithoutRouter));
