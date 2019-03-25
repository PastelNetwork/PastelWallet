import React from 'react';
import {Switch, Route, Redirect, withRouter} from 'react-router-dom'
import {LogoutContainer} from "../containers/LogoutContainer";
import {UserProfileContainer} from "../containers/UserProfileContainer";
import {Auth} from "./AuthComponent";
import {AccountContainer} from "../containers/AccountContainer";
// import '../assets/scss/core.scss';
// import '../assets/css/bulma.css';
// import '../assets/js/webuipopover/jquery.webui-popover.css';
// import '../assets/js/izitoast/css/iziToast.min.css';
// import '../assets/js/zoom/zoom.css';
// import '../assets/js/jpcard/card.css';
// import '../assets/css/chosen/chosen.css';
// import '../assets/css/icons.min.css'
import {Artist} from "./ArtistComponent";

const Main = () => {
    return <Switch>
            <Route exact path='/' component={Auth}/>
            <Route path='/login' component={Auth}/>
            <Route path='/register' component={Auth}/>
            <Route path='/logout' component={LogoutContainer}/>
            <Route path='/user_profile2' component={UserProfileContainer}/>
            <Route path='/user_profile' component={AccountContainer}/>
            <Route path='/artist' component={Artist}/>
            <Redirect to='/login'/>
        </Switch>;
};

export default withRouter(Main);
