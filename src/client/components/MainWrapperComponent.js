import React from "react";
import * as PastelLogo from "../assets2/image/pastel_logo.png";
import {ConnectionStatusContainer} from "../containers/dashboard/ConnectionStatusContainer";
import {MessageBoxContainer} from "../containers/dashboard/MessageBoxContainer";

export const MainWrapper = (props) => {
    const logo = props.noLogo ? null : <div className="account-title">
        <img className="brand-filigrane" src={PastelLogo} alt=""/>
    </div>;

    return <div className="section main-wrapper">
        <ConnectionStatusContainer/>
        <MessageBoxContainer/>
        <div className="container">
            <div className="columns account-header">
                <div className="column is-10 is-offset-1 is-tablet-landscape-padded">
                    {logo}
                    {props.children}
                </div>
            </div>
        </div>
    </div>;
};