import React, { Component } from 'react';

import * as style from './style.module.scss';
import { connect } from 'react-redux';
import Dropdown from '../../common/Dropdown';
import {ipcRenderer} from '../../../ipc/ipc';

class NewPastelIDSelect extends Component {
  constructor (props) {
    super(props);
    this.state = {
      selectedPastelId: null,
      passphrase: ''
    };
  }

  componentDidMount () {
    if (!this.props.pastelIDs) {
      ipcRenderer.send('pastelIdList', {});
    }

  }

  onChange = (selectedOption) => {
    this.setState({ selectedPastelId: selectedOption });
  };

  render () {
    const pastelIDsOptions = this.props.pastelIDs && this.props.pastelIDs.map(x => ({
      value: x.PastelID,
      label: x.PastelID.substr(0, 10),
      regStatus: x.regStatus
    }));

    const customStyles = {
      container: (provided) => ({
        ...provided,
        width: '100%'
      }),
      option: (provided, state) => ({
        ...provided,
        color: regStatusColor[state.data.regStatus]
      })
    };

    return <div className={style['main']}>
      <div className={style['wrapper']}>
        <span>Please choose which <b>PastelID</b> to use</span>
        <Dropdown onChange={this.onChange}
                  value={this.state.selectedPastelId}
                  options={pastelIDsOptions}/>

      </div>
    </div>;
  }
}

export default connect(state => ({ pastelIDs: state.pastelIDs }), null)(NewPastelIDSelect);