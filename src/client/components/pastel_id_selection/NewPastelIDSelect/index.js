import React, { Component } from 'react';

import * as style from './style.module.scss';
import { connect } from 'react-redux';
import Dropdown from '../../common/Dropdown';
import { ipcRenderer } from '../../../ipc/ipc';
import PastelButton, { BTN_TYPE_GREEN } from '../../common/Button';
import Divider from '../../common/Divider';
import PastelInput from '../../common/Input';

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

    return <div className={style['main']}>
      <div className={style['wrapper']}>
        <div className={style.text} style={{marginBottom: '8px'}}>Please choose which <b>PastelID</b> to use</div>
        <Dropdown onChange={this.onChange}
                  value={this.state.selectedPastelId}
                  options={pastelIDsOptions}/>
        <PastelInput style={{width: '100%', marginTop: '7px'}} placeholder={'Passphrase'}/>
        <PastelButton btnType={BTN_TYPE_GREEN} style={{ width: '100%', marginTop: '15px' }} disabled>
          Proceed
        </PastelButton>
        <Divider style={{ marginTop: '25px' }}/>
        <div className={style.text} style={{ marginTop: '16px' }}>If you do not have <b>Pastel ID</b> you can</div>
        <div className={style['btn-block']}>
          <PastelButton style={{width: '43%'}}>Create new</PastelButton>
          or
          <PastelButton style={{width: '43%'}}>Import existing</PastelButton>
        </div>

      </div>
    </div>;
  }
}

export default connect(state => ({ pastelIDs: state.pastelIDs }), null)(NewPastelIDSelect);
