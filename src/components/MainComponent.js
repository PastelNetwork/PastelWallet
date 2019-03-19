import React from 'react';
import {Switch, Route, Redirect, withRouter} from 'react-router-dom'
import {RegisterContainer} from "../containers/RegisterContainer";
import {LoginContainer} from "../containers/LoginContainer";
import {LogoutContainer} from "../containers/LogoutContainer";
import {UserProfileContainer} from "../containers/UserProfileContainer";
import {Auth} from "./AuthComponent";

const Main = () => {
    return <Switch>
            <Route path='/' component={Auth}/>
            <Route path='/login' component={LoginContainer}/>
            <Route path='/register' component={RegisterContainer}/>
            <Route path='/logout' component={LogoutContainer}/>
            <Route path='/user_profile' component={UserProfileContainer}/>
            <Redirect to='/login'/>
        </Switch>;
};

export default withRouter(Main);
