import React from 'react';
import {Switch, Route, Redirect, withRouter} from 'react-router-dom'
import {LogoutContainer} from "../containers/LogoutContainer";
import {UserProfileContainer} from "../containers/UserProfileContainer";
import {ArtWalletContainer} from "../containers/ArtWalletContainer";
import {ImageRegisterFormContainer} from "../containers/ImageRegisterFormContainer";
import {SendPSLContainer} from "../containers/SendPSLContainer";
import {SideBar} from "./common/SideBarComponent";

const Main = (props) => {
    return <React.Fragment>
        <SideBar/>
        <Switch>
            <Route exact path='/' component={ArtWalletContainer}/>
            <Route exact path='/send_psl' component={SendPSLContainer}/>
            <Route exact path='/register' component={ImageRegisterFormContainer}/>
            <Route path='/logout' component={LogoutContainer}/>
            <Route path='/user_profile2' component={UserProfileContainer}/>
            <Redirect to='/'/>
        </Switch>
    </React.Fragment>;
};

export default withRouter(Main);