import React, {Component} from 'react';
import * as style from './style.module.scss';
import { BTN_TYPE_BLUE, BTN_TYPE_GREEN, BTN_TYPE_LIGHT_BLUE, BTN_TYPE_LIGHT_GREEN } from '../constants';

const btnClassNames = {
  [BTN_TYPE_LIGHT_BLUE]: style['light-blue'],
  [BTN_TYPE_BLUE]: style['blue'],
  [BTN_TYPE_GREEN]: style['green'],
  [BTN_TYPE_LIGHT_GREEN]: style['light-green']
};

class PastelButton extends Component {
  render()
  {
    const {children, btnType = BTN_TYPE_BLUE, className, ...otherProps} = this.props;

    const updatedClassName = `${className || ''} ${style.btn} ${btnClassNames[btnType]}`;
    return <button className={updatedClassName} {...otherProps}>
      {this.props.children}
    </button>
  }
}

export default PastelButton;
