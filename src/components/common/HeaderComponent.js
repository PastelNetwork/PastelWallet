import React, {Component} from 'react';
import * as PastelLogo from '../../assets2/image/pastel_logo.png';
import '../../artist.scss';


export class Header extends Component {
    render() {
        return <header className="page-header flex-row space-between wrap">
            <div className="logo">
                <img src={PastelLogo} alt="logo" className="image-logo"/>
            </div>
            <nav className="flex-row nav-menu">
                <div className="nav-menu-point">Gallery</div>
                <div className="nav-menu-point">Buy PSL</div>
                <div className="nav-menu-point">Masternodes</div>
                <div className="nav-menu-point">Blog</div>
            </nav>
            <div className="icons flex-row">
                <div className="icon"><i className="fa fa-arrows-h" aria-hidden="true"></i></div>
                <div className="icon"><i className="fa fa-bell-o"></i></div>

                <div className="icon"><i className="fa fa-user-o"></i></div>
            </div>
            <div className="flex-row top-menu-buttons">
                <div className="top-menu-btn">
                    <button className="wallet-btn">Wallet</button>
                </div>
                <div className="top-menu-btn">
                    <button className="logout-btn">Sign Out</button>
                </div>
            </div>
        </header>
    }
}