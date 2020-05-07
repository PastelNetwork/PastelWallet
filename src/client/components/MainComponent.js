import React, {Component} from 'react';
import {Switch, Route, Redirect, withRouter} from 'react-router-dom'
// import {ArtWalletContainer} from "../containers/ArtWalletContainer";
// import {ImageRegisterFormContainer} from "../containers/ImageRegisterFormContainer";
// import {SendPSLContainer} from "../containers/SendPSLContainer";
// import {ProfileEdit} from "./ProfileEditComponent";
// import {PastelIdHomeContainer} from "../containers/pastel_id_selection/HomeContainer";
// import Artworks from '../containers/Artworks';
// import ArtworkDetails from '../containers/ArtworkDetails';

import PastelID from '../containers/PastelID';



const ipcRenderer = window.require('electron').ipcRenderer;

class Main extends Component {
    componentDidMount() {
        ipcRenderer.send('blockchainDataRequest', {});
    }

    render() {
        return <React.Fragment>
            {/*<LeftMenu/>*/}
            <Switch>
                {/*<Route path='/pastel_id' component={PastelIdHomeContainer}/>*/}
                <Route path='/pastel_id' component={PastelID}/>
                {/*<Route exact path='/wallet' component={ArtWalletContainer}/>*/}
                {/*<Route exact path='/send_psl' component={SendPSLContainer}/>*/}
                {/*<Route exact path='/register' component={ImageRegisterFormContainer}/>*/}
                {/*<Route path='/user_profile' component={ProfileEdit}/>*/}
                {/*<Route exact path='/artworks/:image_hash' component={ArtworkDetails}/>*/}
                {/*<Route exact path='/artworks' component={Artworks}/>*/}
                <Redirect to='/pastel_id'/>
            </Switch>
        </React.Fragment>;
    }
}

export default withRouter(Main);