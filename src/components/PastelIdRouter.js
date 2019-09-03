import React from 'react';
import {Switch, Route, Redirect, withRouter} from 'react-router-dom'
import {ArtWalletContainer} from "../containers/ArtWalletContainer";
import {ImageRegisterFormContainer} from "../containers/ImageRegisterFormContainer";
import {SendPSLContainer} from "../containers/SendPSLContainer";
import {ProfileEdit} from "./ProfileEditComponent";
import {PastelIdHomeContainer} from "../containers/pastel_id_selection/HomeContainer";

const Main = (props) => {
    return <Switch>
            {/*<Route exact path='/' component={PastelIdHomeContainer}/>*/}
            {/*<Route exact path='/wallet' component={ArtWalletContainer}/>*/}
            <Route exact path='/' component={ArtWalletContainer}/>
            <Route exact path='/send_psl' component={SendPSLContainer}/>
            <Route exact path='/register' component={ImageRegisterFormContainer}/>
            <Route path='/user_profile' component={ProfileEdit}/>
            <Redirect to='/'/>
        </Switch>;
};

export default withRouter(Main);