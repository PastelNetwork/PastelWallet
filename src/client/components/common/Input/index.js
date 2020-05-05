import React, {Component} from 'react';
import * as style from './style.module.scss';

export const GREY_INPUT = 0;
export const WHITE_INPUT = 1;

const inputClassName = {
  [GREY_INPUT]: style.grey,
  [WHITE_INPUT]: style.white
};

class PastelInput extends Component {
  render() {
    const {className, inputType = GREY_INPUT, valid=true, ...otherProps} = this.props;

    const updatedClassName = `${className || ''} ${style.input} ${inputClassName[inputType]} ${!valid ? style.error : ''}`;
    return <input className={updatedClassName} {...otherProps}/>
  }
}

export default PastelInput;
