import React from 'react';

import { Redirect, Route, Switch, withRouter } from 'react-router-dom';
import Create from './Create';
import Import from './Import';
import Select from './Select';
import AniImport from './AniImport';


const PastelID = (props) => {
  return <Switch>
    <Route path='/pastel_id/select' component={Select}/>
    <Route path='/pastel_id/create' component={Create}/>
    <Route path='/pastel_id/import' component={Import}/>
    <Route path='/pastel_id/ani_import' component={AniImport}/>
    <Redirect to='/pastel_id/create'/>
  </Switch>;
};

export default withRouter(PastelID);
