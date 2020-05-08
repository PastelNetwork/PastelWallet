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
    const {className, inputType = GREY_INPUT, valid=true, label, name='', containerStyle={}, ...otherProps} = this.props;

    const updatedClassName = `${className || ''} ${style.input} ${inputClassName[inputType]} ${!valid ? style.error : ''}`;
    if (label) {
      return <div style={containerStyle}>
        <label htmlFor={name} className={style.label}>{label}</label>
        <input className={updatedClassName} {...otherProps} name={name}/>
      </div>;
    } else {
      return <input className={updatedClassName} {...otherProps}/>;
    }

  }
}

export default PastelInput;
