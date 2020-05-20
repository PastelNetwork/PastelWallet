import React from 'react';

import { Redirect, Route, Switch, withRouter } from 'react-router-dom';
import Create from './Create';
import Import from './Import';
import Select from './Select';


const PastelID = (props) => {
  return <Switch>
    <Route path='/pastel_id/select' component={Select}/>
    <Route path='/pastel_id/create' component={Create}/>
    <Route path='/pastel_id/import' component={Import}/>
    <Redirect to='/pastel_id/select'/>
  </Switch>;
};

export default withRouter(PastelID);
