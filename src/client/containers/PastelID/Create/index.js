import React, {Component} from 'react';
import * as style from './style.module.scss';
import Wrapper from '../Wrapper';
import history from '../../../history';

class Create extends Component {
  render() {
    return <Wrapper>
      <span onClick={() => history.goBack()}>Create</span>
    </Wrapper>;
  }
}

export default Create;