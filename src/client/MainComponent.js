import React, { Component } from 'react';
import { Switch, Route, Redirect, withRouter } from 'react-router-dom';
import PastelID from './containers/PastelID';
import Menu from './containers/AddOns/Menu';
import MainScreen from './containers/Main';
import NodeStatus from './containers/AddOns/NodeStatus';
import WalletAddress from './containers/AddOns/WalletAddress';
import LogTab from './containers/AddOns/LogTab';
import RegisterImage from './containers/RegisterImage';
import Gallery from './containers/Gallery';

const ipcRenderer = window.require('electron').ipcRenderer;

class App extends Component {
  componentDidMount () {
    ipcRenderer.send('blockchainDataRequest', {});
    ipcRenderer.send('getInfoRequest', {});
  }

  render () {
    return <React.Fragment>
      <Menu/>
      <NodeStatus/>
      <Switch>
        <Route path='/pastel_id' component={PastelID}/>
        <Route path='/main' component={MainScreen}/>
        <Route path='/profile' component={PastelID}/>
        <Route path='/register' component={RegisterImage}/>
        <Route path='/gallery' component={Gallery}/>
        <Route path='/info' component={PastelID}/>
        {/*<Route path='/user_profile' component={ProfileEdit}/>*/}
        <Redirect to='/main'/>
      </Switch>
      <WalletAddress/>
      <LogTab/>
    </React.Fragment>;
  }
}

export default withRouter(App);