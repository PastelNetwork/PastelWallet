import React, { Component } from 'react';
import * as style from './style.module.scss';
import { connect } from 'react-redux';
import { Wrapper, Card, Input, Button, Spinner } from '../../components/common';
import AddImage from './AddImage';
import { BTN_TYPE_GREEN, BTN_TYPE_LIGHT_GREEN } from '../../components/common/constants';
import { ipcRenderer } from '../../ipc/ipc';
import history from '../../history';
import * as constants from '../../constants';
import * as actionTypes from '../../actionTypes';
import { setImageRegFormState } from '../../actions';
import { Route, Switch, withRouter } from 'react-router-dom';
import Success from './Success';

class RegisterForm extends Component {
  constructor (props) {
    super(props);
    this.state = {
      // reg form fields
      artName: '',
      numCopies: 0,
      filePath: '',

      artistName: '',
      artistWebsite: '',
      artistWrittenStatement: '',
      artworkSeriesName: '',
      artworkCreationVideoYoutubeUrl: '',
      artworkKeywordSet: '',

      // other data
      confirmDecline: false
    };
  }

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
    this.props.dispatch({type: actionTypes.SET_ARTWORK_NAME, value: this.state.artName})
  };
  onAddImageChange = (filePath, base64File) => {
    this.setState({ filePath });
    this.props.dispatch({type: actionTypes.SET_ARTWORK_FILE, value: base64File})
  };
  getFeeClick = () => {
    ipcRenderer.send('imageRegFormSubmit', this.state);
  };
  declineClick = () => {
    if (this.props.regticketId) {
      ipcRenderer.send('imageRegFormCancel', { regticketId: this.props.regticketId });
    }
    this.props.dispatch({ type: actionTypes.RESET_REGISTRATION });
    history.push('/main');
  };
  acceptClick = () => {
    const data = {
      name: this.state.artName,
      numCopies: this.state.numCopies,
      copyPrice: this.state.copyPrice,
      filePath: this.state.filePath,
      artistName: this.state.artistName,
      artistWebsite: this.state.artistWebsite,
      artistWrittenStatement: this.state.artistWrittenStatement,
      artworkSeriesName: this.state.artworkSeriesName,
      artworkCreationVideoYoutubeUrl: this.state.artworkCreationVideoYoutubeUrl,
      artworkKeywordSet: this.state.artworkKeywordSet
    };
    ipcRenderer.send('imageRegFormProceed', data);
    this.props.dispatch(setImageRegFormState(constants.IMAGE_REG_FORM_STATE_REQUESTING_NETWORK));
  };
  accept2Click = () => {
    ipcRenderer.send('imageRegFormStep3', { regticketId: this.props.regticketId });
    this.props.dispatch(setImageRegFormState(constants.IMAGE_REG_FORM_STATE_SEND_REGTICKET_MN_2_3));
  };

  render () {
    let buttons;
    let formDisabled = true;
    let msg;
    let localError;
    const getDeclineBtn = (disabled = false) =>
      <Button btnType={BTN_TYPE_LIGHT_GREEN} style={{ width: 'calc(50% - 5px)' }}
              onClick={() => this.setState({ confirmDecline: true })}
              disabled={disabled}
      >Decline</Button>;

    switch (this.props.regFormState) {
      case constants.IMAGE_REG_FORM_STATE_DEFAULT:
        formDisabled = false;
        const btnsDisabled = this.state.filePath === '' || this.state.artName === '' || this.state.numCopies === 0;
        buttons = <React.Fragment>
          <Button btnType={BTN_TYPE_GREEN} style={{ marginRight: '10px', width: 'calc(50% - 5px)' }}
                  disabled={btnsDisabled} onClick={this.getFeeClick}>Get
            fee</Button>
          {getDeclineBtn(btnsDisabled)}
        </React.Fragment>;
        break;
      case constants.IMAGE_REG_FORM_STATE_PREL_FEE_RECEIVED:
        buttons = <React.Fragment>
          <Button btnType={BTN_TYPE_GREEN} style={{ marginRight: '10px', width: 'calc(50% - 5px)' }}
                  onClick={this.acceptClick}>Accept</Button>
          {getDeclineBtn()}
        </React.Fragment>;
        msg = <React.Fragment> Preliminary network fee:
          <span className={style.fee}> {this.props.fee} PSL</span>
        </React.Fragment>;
        break;
      case constants.IMAGE_REG_FORM_STATE_REQUESTING_NETWORK:
        msg = <React.Fragment>
          Requesting network for the worker fee <Spinner style={{ marginLeft: '15px' }}/>
        </React.Fragment>;
        break;
      case constants.IMAGE_REG_FORM_STATE_WORKER_FEE_RECEIVED:
        msg = <React.Fragment> Worker's fee:
          <span className={style.fee}> {this.props.workerFee} PSL</span>
        </React.Fragment>;
        buttons = <React.Fragment>
          <Button btnType={BTN_TYPE_GREEN} style={{ marginRight: '10px', width: 'calc(50% - 5px)' }}
                  onClick={this.accept2Click}>Accept</Button>
          {getDeclineBtn()}
        </React.Fragment>;
        break;
      case constants.IMAGE_REG_FORM_STATE_SEND_REGTICKET_MN_2_3:
        msg = <React.Fragment>
          Sending registration ticket to masternodes 2 and 3 <Spinner style={{ marginLeft: '15px' }}/>
        </React.Fragment>;
        break;
      case constants.IMAGE_REG_FORM_STATE_MN_2_3_RESPONSE_RECEIVED:
        msg = <React.Fragment>
          {this.props.imageRegFormMessage} <Spinner style={{ marginLeft: '15px' }}/>
        </React.Fragment>;
        break;
      case constants.IMAGE_REG_FORM_STATE_ACT_TICKET_RECEIVED:
        history.push('/register/success');
        break;
      case constants.IMAGE_REG_FORM_STATE_ERROR:
        msg = this.props.imageRegFormMessage;
        buttons = getDeclineBtn();
        if (!this.props.commonError) {
          localError = 'Unknown error';
        }
        break;
      default:
        break;
    }
    const inputs = ['artName', 'artistName', 'artistWebsite', 'artistWrittenStatement', 'artworkSeriesName', 'artworkCreationVideoYoutubeUrl', 'artworkKeywordSet', 'numCopies'];
    const labels = {
      artName: 'Art name',
      artistName: 'Artist name',
      artistWebsite: 'Artist website',
      artistWrittenStatement: 'Artist written statement',
      artworkSeriesName: 'Artwork series name',
      artworkCreationVideoYoutubeUrl: 'Artwork creation video youtube url',
      artworkKeywordSet: 'Artwork keyword set',
      numCopies: 'Number of copies'
    };

    return <Wrapper>
      <Card style={{ width: '100%' }} className={style.register}>
        <h3>REGISTER IMAGE</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {inputs.map((item, idx) => {
            const extra = {};
            if (item === 'numCopies') {
              extra.type = 'number';
              extra.min = '0';
              extra.step = '1';
            }
            return <Input name={item} label={labels[item]} style={{ lineHeight: '20px', width: '100%' }}
                          containerStyle={{
                            marginTop: '13px',
                            width: 'calc(50% - 5px)',
                            marginRight: `${idx % 2 === 0 ? '10px' : 0} `
                          }} onChange={this.onChange}
                          value={this.state.address} key={idx}
                          disabled={formDisabled}
                          {...extra}
            />;
          })}

          <AddImage style={{ width: 'calc(50% - 5px)' }} onChange={this.onAddImageChange} disabled={formDisabled}/>
          <div className={style.errors}>
            {this.props.commonError}
            {localError}
          </div>
        </div>
        <div className={style.message}>
          {msg}
        </div>
        <div className={style.btns}>
          {this.state.confirmDecline ?
            <React.Fragment>
              <div className={style.msg}>
                Are you sure want to stop registration?
              </div>
              <Button btnType={BTN_TYPE_GREEN} style={{ marginRight: '10px', width: 'calc(50% - 5px)' }}
                      onClick={this.declineClick}>Yes</Button>
              <Button btnType={BTN_TYPE_LIGHT_GREEN} style={{ width: 'calc(50% - 5px)' }}
                      onClick={() => this.setState({ confirmDecline: false })}>No</Button>

            </React.Fragment>
            : buttons
          }
        </div>

      </Card>

    </Wrapper>;
  }
}


const formStateToProps =state => ({
  regFormError: state.registration.regFormError,
  artNameError: state.registration.regFormError.artName,
  artFileError: state.registration.regFormError.artFile,
  commonError: state.registration.regFormError.all,
  fee: state.registration.fee,
  workerFee: state.registration.workerFee,
  regFormState: state.registration.regFormState,
  regticketId: state.registration.regticketId,
  txid: state.registration.regFormTxid,
  regFormTxidAct: state.registration.regFormTxidAct,
  imageRegFormMessage: state.registration.imageRegFormMessage
});


const RegisterImage = (props) => {
  return <Switch>
    <Route path='/register/success' component={Success}/>
    <Route path='/register' component={connect(formStateToProps)(RegisterForm)}/>
  </Switch>;
};

export default withRouter(RegisterImage);
