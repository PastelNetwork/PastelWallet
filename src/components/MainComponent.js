import React, {Component} from 'react';
import {Switch, Route, Redirect, withRouter} from 'react-router-dom'
import {ArtWalletContainer} from "../containers/ArtWalletContainer";
import {ImageRegisterFormContainer} from "../containers/ImageRegisterFormContainer";
import {SendPSLContainer} from "../containers/SendPSLContainer";
import {SideBar} from "./common/SideBarComponent";
import {ProfileEdit} from "./ProfileEditComponent";
import {PastelIdHomeContainer} from "../containers/pastel_id_selection/HomeContainer";


const ipcRenderer = window.require('electron').ipcRenderer;

class Main extends Component {
    componentDidMount() {
        ipcRenderer.send('blockchainDataRequest', {});
    }

    render() {
        return <React.Fragment>
            <SideBar/>
            <Switch>
                <Route path='/pastel_id' component={PastelIdHomeContainer}/>
                <Route exact path='/wallet' component={ArtWalletContainer}/>
                <Route exact path='/send_psl' component={SendPSLContainer}/>
                <Route exact path='/register' component={ImageRegisterFormContainer}/>
                <Route path='/user_profile' component={ProfileEdit}/>
                <Redirect to='/pastel_id'/>
            </Switch>
        </React.Fragment>;
    }
}

export default withRouter(Main);