import React from 'react';
import {Switch, Route, Redirect, withRouter} from 'react-router-dom'
import {LogoutContainer} from "../containers/LogoutContainer";
import {UserProfileContainer} from "../containers/UserProfileContainer";
import {Artist} from "./ArtistComponent";
import {ArtWalletContainer} from "../containers/ArtWalletContainer";
import {ImageRegisterFormContainer} from "../containers/ImageRegisterFormContainer";

const Main = () => {
    return <Switch>
        <Route exact path='/' component={ArtWalletContainer}/>
        <Route path='/logout' component={LogoutContainer}/>
        <Route path='/user_profile2' component={UserProfileContainer}/>
        <Route path='/register' component={ImageRegisterFormContainer}/>
        <Redirect to='/'/>
    </Switch>;
};

export default withRouter(Main);