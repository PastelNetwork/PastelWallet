import React from 'react';
import {Switch, Route, Redirect, withRouter} from 'react-router-dom'
import {LogoutContainer} from "../containers/LogoutContainer";
import {UserProfileContainer} from "../containers/UserProfileContainer";
import {Artist} from "./ArtistComponent";
import {ArtWallet} from "./ArtWalletComponent";

const Main = () => {
    return <Switch>
        <Route exact path='/' component={ArtWallet}/>
        <Route path='/logout' component={LogoutContainer}/>
        <Route path='/user_profile2' component={UserProfileContainer}/>
        <Route path='/artist' component={Artist}/>
        <Redirect to='/'/>
    </Switch>;
};

export default withRouter(Main);