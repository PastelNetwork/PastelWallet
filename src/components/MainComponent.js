import React from 'react';
import {Switch, Route, Redirect, withRouter} from 'react-router-dom'
import {ArtWalletContainer} from "../containers/ArtWalletContainer";
import {ImageRegisterFormContainer} from "../containers/ImageRegisterFormContainer";
import {SendPSLContainer} from "../containers/SendPSLContainer";
import {SideBar} from "./common/SideBarComponent";
import {ProfileEdit} from "./ProfileEditComponent";

const Main = (props) => {
    return <React.Fragment>
        <SideBar/>
        <Switch>
            <Route exact path='/' component={ArtWalletContainer}/>
            <Route exact path='/send_psl' component={SendPSLContainer}/>
            <Route exact path='/register' component={ImageRegisterFormContainer}/>
            <Route path='/user_profile' component={ProfileEdit}/>
            <Redirect to='/'/>
        </Switch>
    </React.Fragment>;
};

export default withRouter(Main);