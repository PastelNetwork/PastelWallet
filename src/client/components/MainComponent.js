import React, {Component} from 'react';
import {Switch, Route, Redirect, withRouter} from 'react-router-dom'
import PastelID from '../containers/PastelID';
import Menu from '../containers/AddOns/Menu';
import MainScreen from '../containers/Main';
import NodeStatus from '../containers/AddOns/NodeStatus';
import WalletAddress from '../containers/AddOns/WalletAddress';


const ipcRenderer = window.require('electron').ipcRenderer;

class Main extends Component {
    componentDidMount() {
        ipcRenderer.send('blockchainDataRequest', {});
        ipcRenderer.send('getInfoRequest', {});
    }

    render() {
        return <React.Fragment>
            <Menu/>
            <NodeStatus/>
            <WalletAddress/>
            <Switch>
                {/*<Route path='/pastel_id' component={PastelIdHomeContainer}/>*/}
                <Route path='/pastel_id' component={PastelID}/>
                <Route path='/main' component={MainScreen}/>
                <Route path='/profile' component={PastelID}/>
                <Route path='/register' component={PastelID}/>
                <Route path='/gallery' component={PastelID}/>
                <Route path='/info' component={PastelID}/>
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