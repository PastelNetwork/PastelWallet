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
import Info from './containers/Info';
import Profile from './containers/Profile';

class App extends Component {
  render () {
    return <React.Fragment>
      <Menu/>
      <NodeStatus/>
      <Switch>
        <Route path='/pastel_id/:key' component={PastelID}/>
        <Route path='/main' component={MainScreen}/>
        <Route path='/profile' component={Profile}/>
        <Route path='/register' component={RegisterImage}/>
        <Route path='/gallery' component={Gallery}/>
        <Route path='/info' component={Info}/>
        <Redirect to='/pastel_id/select'/>
      </Switch>
      <WalletAddress/>
      <LogTab/>
    </React.Fragment>;
  }
}

export default withRouter(App);