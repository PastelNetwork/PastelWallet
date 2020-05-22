import React, { Component } from 'react';
import * as style from './style.module.scss';
import { SHOW_ALL, SHOW_MY } from '../constants';

const noop = () => {};

class Filter extends Component {
  onClick = () => {
    const newState = this.props.active === SHOW_ALL ? SHOW_MY : SHOW_ALL;
    this.props.onChange && this.props.onChange(newState);
  };
  render () {
    return <div className={style.filter} style={this.props.style}>
      <span className={this.props.active === SHOW_ALL ? style.active : ''}
            onClick={this.props.active === SHOW_MY ? this.onClick : noop}>
        Show all</span>
      <span className={this.props.active === SHOW_MY ? style.active : ''}
            style={{ marginLeft: '15px' }}
            onClick={this.props.active === SHOW_ALL ? this.onClick : noop}>
        Show my</span>
    </div>;
  }
}

export default Filter;
