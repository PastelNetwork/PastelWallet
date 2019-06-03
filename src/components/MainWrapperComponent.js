import React from "react";
import {HeaderContainer} from "../containers/HeaderContainer";
import {FlexRow} from "./common/FlexRowComponent";
import {LeftDummy, LeftMenu} from "./common/LeftMenuComponent";

export const MainWrapper = (props) => {
    const mainPageClass = props.leftMenuShow ? "main-page flex-col menu-expanded" : "main-page flex-col";
    return <React.Fragment>
        <HeaderContainer/>
        <FlexRow>
            <LeftDummy show={props.leftMenuShow}/>
            <LeftMenu show={props.leftMenuShow}/>
            <div className={mainPageClass}>
                {props.children}
            </div>
        </FlexRow>
    </React.Fragment>
};