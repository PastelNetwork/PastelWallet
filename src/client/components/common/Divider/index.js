import React, {Component} from 'react';
import * as style from './style.module.scss';

class Divider extends Component {
  render()
  {
    const {className, ...otherProps} = this.props;

    return <div className={`${className || ''} ${style.divider}`} {...otherProps}/>
  }
}

export default Divider;
