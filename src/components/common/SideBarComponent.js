import React, {Component} from 'react';
import {withRouter} from 'react-router-dom'
import '../../styles.scss';
import history from '../../history';
import * as PastelFavicon from '../../assets/images/favicon.png';
import * as Feather from 'react-feather';

const LeftMenuPoint = (props) => {
    if (props.active) {
        return <li className="">
            {props.children}
        </li>
    } else {
        return <li className="">
            <a href="#" className="has-popover-top" data-placement="right" onClick={props.onClick}>
                {props.children}
            </a>
        </li>
    }
};

class SideBarWithoutRouter extends Component {
    render() {
        const path = this.props.location.pathname;
        return <div className="main-sidebar">
            <div className="sidebar-brand">
                <img src={PastelFavicon} alt=""/>
            </div>
            <div className="sidebar-inner">
                <ul className="icon-menu">
                    <LeftMenuPoint active={path === "/"} onClick={() => history.push('/')}>
                        <Feather.User/>
                    </LeftMenuPoint>
                    <LeftMenuPoint active={path === "/send_psl"} onClick={() => history.push('/send_psl')}>
                        <Feather.DollarSign/>
                    </LeftMenuPoint>
                    <LeftMenuPoint active={path === "/register"} onClick={() => history.push('/register')}>
                        <Feather.Plus/>
                    </LeftMenuPoint>


                    {/*TODO: the following menu points are just placeholders*/}
                    <LeftMenuPoint active={path === "/grid"} onClick={() => history.push('/grid')}>
                        <Feather.Grid/>
                    </LeftMenuPoint>
                    <LeftMenuPoint active={path === "/layers"} onClick={() => history.push('/layers')}>
                        <Feather.Layers/>
                    </LeftMenuPoint>
                </ul>
            </div>
        </div>;
    }
}


export const SideBar = withRouter(SideBarWithoutRouter);
