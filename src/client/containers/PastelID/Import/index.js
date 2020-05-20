import React, {Component} from 'react';
import * as style from './style.module.scss';
import Wrapper from '../Wrapper';
import history from '../../../history';

class Import extends Component {
  render() {
    return <Wrapper>
      <span onClick={() => history.goBack()}>Import</span>
    </Wrapper>;
  }
}

export default Import;