import React, {Component} from 'react';
import * as PastelLogo from '../../assets2/image/pastel_logo.png';
import '../../styles.scss';
import {switchLeftMenu} from "../../actions";


export class Header extends Component {
    render() {
        return <React.Fragment>
            <header className="page-header flex-row space-between wrap">
                <div className="flex-row">
                    <div className="flex-row icons">
                        <div className="icon" onClick={() => this.props.dispatch(switchLeftMenu())}><i className="fa fa-bars" aria-hidden="true"></i></div>
                    </div>
                    <div className="logo">
                        <img src={PastelLogo} alt="logo" className="image-logo"/>
                    </div>
                </div>
                <div className="icons flex-row">
                    <div className="icon"><i className="fa fa-arrows-h" aria-hidden="true"></i></div>
                    <div className="icon"><i className="fa fa-bell-o"></i></div>

                    <div className="icon"><i className="fa fa-user-o"></i></div>
                </div>
            </header>
        </React.Fragment>
    }
}