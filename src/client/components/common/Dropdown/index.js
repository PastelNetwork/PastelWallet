import React, { Component } from 'react';
import Select from 'react-select';
import {
  PASTELID_REG_STATUS_IN_PROGRESS,
  PASTELID_REG_STATUS_NON_REGISTERED,
  PASTELID_REG_STATUS_REGISTERED
} from '../../../constants';

const regStatusColor  = {
  [PASTELID_REG_STATUS_REGISTERED]: 'green',
  [PASTELID_REG_STATUS_IN_PROGRESS]: '#fcba03',
  [PASTELID_REG_STATUS_NON_REGISTERED]: 'red'
};

const customStyles = {
  container: (provided) => ({
    ...provided,
    width: '100%'
  }),
  option: (provided, state) => ({
    ...provided,
    color: regStatusColor[state.data.regStatus]
  }),
  valueContainer: p => ({
    ...p,
    backgroundColor: 'reds'
  })
};

class Dropdown extends Component {
  render () {
    const { onChange, value, options } = this.props;
    return <Select onChange={onChange}
                   value={value}
                   options={options}
                   styles={customStyles}
    />;
  }
}

export default Dropdown;
