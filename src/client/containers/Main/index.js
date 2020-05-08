import React, { Component } from 'react';

import * as style from './style.module.scss';
import { connect } from 'react-redux';
import { getBalance } from '../../actions';

const Card = (props) => {
  const { children, className = '', ...rest } = props;
  return <div className={`${style.card} ${className}`} {...rest}>{children}</div>;
};

class Main extends Component {
  componentDidMount() {
      this.props.dispatch(getBalance());
  }

  render () {
    return <div className={style.wrapper}>
      <div style={{ display: 'flex' }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <Card style={{ marginBottom: '10px', width: '221px', height: '108px' }} className={style.balance}>
            <h3>YOUR <br/>BALANCE</h3>
            <span>{this.props.balance} PSL</span>
          </Card>
          <Card style={{ marginBottom: '10px', width: '221px', height: '108px'  }} className={style.pastelid}>
            <h3>PASTEL ID</h3>
            <span>{this.props.currentPastelID}</span>

          </Card>
        </div>
        <Card style={{ marginBottom: '10px', marginLeft: '10px', width: '100%' }}>
          <h3>SEND PSL</h3>
          <span></span>
        </Card>
      </div>
      <Card>

      </Card>

    </div>;
  }
}

export default connect(state => ({
  balance: state.balance,
  currentPastelID: state.currentPastelID
}), dispatch => ({dispatch}))(Main);
