import React, { Component } from 'react';

import * as style from './style.module.scss';
import { connect } from 'react-redux';
import { ipcRenderer } from '../../../ipc/ipc';
import PastelButton, { BTN_TYPE_GREEN } from '../../common/Button';
import Divider from '../../common/Divider';
import PastelInput from '../../common/Input';
import Dropdown from '../../common/Dropdown';
import Spinner from '../../common/Spinner';
import {
  PASTELID_REG_STATUS_IN_PROGRESS,
  PASTELID_REG_STATUS_NON_REGISTERED,
  PASTELID_REG_STATUS_REGISTERED
} from '../../../constants';

const regStatusVerbose = {
  [PASTELID_REG_STATUS_REGISTERED]: <span style={{ color: '#6EA65A' }}>(registered)</span>,
  [PASTELID_REG_STATUS_IN_PROGRESS]: <span style={{ color: '#D9C82D' }}>(pending)</span>,
  [PASTELID_REG_STATUS_NON_REGISTERED]: <span style={{ color: '#F24444' }}>(not registered)</span>
};


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

  onProceedClick = () => {
    ipcRenderer.send('pastelIdCheckPassphrase', {
      pastelID: this.state.selectedPastelId.value,
      passphrase: this.state.passphrase
    });
    this.setState({ passphrase: '' });
  };
  render () {
    const proceedButton = (disabled, marginTop) => {
      return <PastelButton btnType={BTN_TYPE_GREEN}
                           style={{ width: '100%', marginTop: marginTop }}
                           disabled={disabled}
                           onClick={this.onProceedClick}
      >
        Proceed
      </PastelButton>;
    };

    const pastelIDsOptions = this.props.pastelIDs && this.props.pastelIDs.map(x => ({
      value: x.PastelID,
      label: <React.Fragment>{x.PastelID.substr(0, 10)} {regStatusVerbose[x.regStatus]}</React.Fragment>,
      regStatus: x.regStatus
    }));
    const passphraseInput = <PastelInput style={{ width: '100%', marginTop: '44px' }} placeholder={'Passphrase'}
                                         value={this.state.passphrase}
                                         onChange={(e) => this.setState({ passphrase: e.target.value })}
    />;

    let input;
    let button;
    let inProgress;
    if (!this.state.selectedPastelId) {
      // no passphrase field, proceed btn inactive
      button = proceedButton(true, '52px');

    } else if (this.state.selectedPastelId.regStatus === PASTELID_REG_STATUS_REGISTERED) {
      // add passphrase field, proceed btn active
      input = passphraseInput;
      button = proceedButton(!this.state.passphrase, '15px');
    } else if (this.state.selectedPastelId.regStatus === PASTELID_REG_STATUS_IN_PROGRESS) {
      // msg, spinner, proceed button inactive
      inProgress = <div className={style['in-progress-msg']}>Your Pastel ID is being registered
        <Spinner style={{marginRight: '15px', float: 'right'}}/>
      </div>;
      button = proceedButton(true, '5px');
    } else if (this.state.selectedPastelId.regStatus === PASTELID_REG_STATUS_NON_REGISTERED) {
      // add passphrase field, register button
      input = passphraseInput;
      button = <PastelButton btnType={BTN_TYPE_GREEN}
                             style={{ width: '100%', marginTop: '15px' }}
                             disabled={!this.state.passphrase}>
        Register
      </PastelButton>;
    }

    return <div className={style['main']}>
      <div className={style['wrapper']}>
        <div className={style.text} style={{ marginBottom: '8px' }}>Please choose which <b>PastelID</b> to use</div>
        <Dropdown onChange={this.onChange}
                  value={this.state.selectedPastelId}
                  options={pastelIDsOptions}
                  placeholder={'Pastel ID'}/>
        {input}
        {inProgress}
        {button}
        <Divider style={{ marginTop: '25px' }}/>
        <div className={style.text} style={{ marginTop: '16px' }}>If you do not have <b>Pastel ID</b> you can</div>
        <div className={style['btn-block']}>
          <PastelButton style={{ width: '43%' }}>Create new</PastelButton>
          or
          <PastelButton style={{ width: '43%' }}>Import existing</PastelButton>
        </div>

      </div>
    </div>;
  }
}

export default connect(state => ({ pastelIDs: state.pastelIDs }), null)(NewPastelIDSelect);
