import React from 'react';
import {Switch, Route, Redirect, withRouter} from 'react-router-dom'
import {LogoutContainer} from "../containers/LogoutContainer";
import {UserProfileContainer} from "../containers/UserProfileContainer";
import {Auth} from "./AuthComponent";

const Main = () => {
    return <Switch>
            <Route exact path='/' component={Auth}/>
            <Route path='/login' component={Auth}/>
            <Route path='/register' component={Auth}/>
            <Route path='/logout' component={LogoutContainer}/>
            <Route path='/user_profile' component={UserProfileContainer}/>
            <Redirect to='/login'/>
        </Switch>;
};

export default withRouter(Main);
