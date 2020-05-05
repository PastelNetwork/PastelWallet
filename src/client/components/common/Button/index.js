import React, {Component} from 'react';
import * as style from './style.module.scss';

export const BTN_TYPE_LIGHT_BLUE = 0;
export const BTN_TYPE_BLUE = 1;
export const BTN_TYPE_GREEN = 2;
export const BTN_TYPE_LIGHT_GREEN = 3;

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
