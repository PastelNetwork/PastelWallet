import React, { Component } from 'react';
import '../../client/styles.scss';
import { store } from '../../client/app';
import {
  resetImageRegFormErrors,
  setImageRegFormError, setImageRegFormMsg,
  setImageRegFormRegFee, setImageRegFormState, setImageRegFormTxid, setImageRegFormTxidActTicket, setImageRegTicketID,
  setImageRegWorkerFee,
  setRegFee
} from '../../client/actions';
import history from '../../client/history';
import * as constants from '../../client/constants';
import { MainWrapper } from './MainWrapperComponent';
import { BarLoader } from 'react-spinners';

const ipcRenderer = window.require('electron').ipcRenderer;


export class ImageRegisterForm extends Component {
  constructor (props) {
    super(props);
    this.state = {
      file: null,
      artName: '',
      numCopies: 0,
      copyPrice: 0,
      filePath: '',

      artistName: '',
      artistWebsite: '',
      artistWrittenStatement: '',
      artworkSeriesName: '',
      artworkCreationVideoYoutubeUrl: '',
      artworkKeywordSet: ''

    };
  }

  validateImageRegForm = () => {
    let isValid = true;
    if (this.state.artName === '') {
      this.props.dispatch(setImageRegFormError('artName', 'Art name should not be empty'));
      isValid = false;
    }
    if (this.state.filePath === '') {
      this.props.dispatch(setImageRegFormError('artFile', 'Please select art image file'));
      isValid = false;
    }
    return isValid;
  };

  onFormSubmit = (e) => {
    e.preventDefault();
    if (this.validateImageRegForm()) {
      let data = this.state;
      ipcRenderer.send('imageRegFormSubmit', data);
    }
  };
  onProceedClick = (e) => {
    e.preventDefault();
    let data = {
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
    store.dispatch(setImageRegFormState(constants.IMAGE_REG_FORM_STATE_REQUESTING_NETWORK));
  };
  onAddFile = (e) => {
    if (Object.entries(this.props.regFormError).length !== 0) {
      store.dispatch(resetImageRegFormErrors());
    }
    let file = e.target.files[0];
    this.setState({ file: URL.createObjectURL(file), filePath: file.path });
  };
  onChange = (e) => {
    if (Object.entries(this.props.regFormError).length !== 0) {
      store.dispatch(resetImageRegFormErrors());
    }
    this.setState({ [e.target.name]: e.target.value });
  };
  onReturnClick = (e) => {
    e.preventDefault();
    this.props.dispatch(resetImageRegFormErrors());
    this.props.dispatch(setImageRegFormState(constants.IMAGE_REG_FORM_STATE_DEFAULT));
    ipcRenderer.send('imageRegFormCancel', { regticketId: this.props.regticketId });
    this.props.dispatch(setImageRegTicketID(null));
    history.push('/wallet');
  };
  onAcceptStep3Click = (e) => {
    e.preventDefault();
    ipcRenderer.send('imageRegFormStep3', { regticketId: this.props.regticketId });
    this.props.dispatch(setImageRegFormState(constants.IMAGE_REG_FORM_STATE_SEND_REGTICKET_MN_2_3));
  };

  render () {
    let buttonArea;
    switch (this.props.regFormState) {
      case constants.IMAGE_REG_FORM_STATE_ERROR:
        buttonArea = <div>
          <div className="flex-centered">
            <button
              className="button cart-button secondary-button upper-button rounded is-bold raised"
              onClick={this.onReturnClick}>
              Return
            </button>
          </div>
          <div className="flex-centered">
            <div className={this.props.commonError ? '' : 'display-none'}>
              <div className="reg-form-error">
                {this.props.commonError}
              </div>
            </div>
          </div>
        </div>;
        break;
      case constants.IMAGE_REG_FORM_STATE_DEFAULT:
        buttonArea = <div>
          <div className="flex-centered">
            <button
              className="button cart-button secondary-button upper-button rounded is-bold raised"
              onClick={this.onFormSubmit}>
              Register
            </button>
          </div>
          <div className="flex-centered">
            <div className={this.props.commonError ? '' : 'display-none'}>
              <div className="reg-form-error">
                {this.props.commonError}
              </div>
            </div>
          </div>
        </div>;
        break;
      case constants.IMAGE_REG_FORM_STATE_PREL_FEE_RECEIVED:
        buttonArea = <div>
          <div className="regfee-msg">Preliminary network
            fee: {this.props.regFormFee} PSL
          </div>
          <div className="flex-centered">
            <button
              className="button cart-button secondary-button upper-button rounded is-bold raised"
              onClick={this.onProceedClick}>
              Proceed
            </button>
            <button
              className="button cart-button secondary-button upper-button rounded is-bold raised"
              onClick={this.onReturnClick}>
              Decline
            </button>
          </div>
        </div>;
        break;
      case constants.IMAGE_REG_FORM_STATE_REQUESTING_NETWORK:
        buttonArea = <div>
          <div className="regfee-msg">Requesting network for the worker's fee
          </div>
          <div className="flex-centered">
            <BarLoader
              sizeUnit={'%'}
              width={90}
              color={'#00D1B2'}
              loading={true}
            />
          </div>
        </div>;
        break;
      case constants.IMAGE_REG_FORM_STATE_WORKER_FEE_RECEIVED:
        buttonArea = <div>
          <div className="regfee-msg">Worker's fee: {this.props.workerFee} PSL
          </div>
          <div className="flex-centered">
            <button
              className="button cart-button secondary-button upper-button rounded is-bold raised"
              onClick={this.onAcceptStep3Click}>
              Accept
            </button>
            <button
              className="button cart-button secondary-button upper-button rounded is-bold raised"
              onClick={this.onReturnClick}>
              Decline
            </button>
          </div>
        </div>;
        break;
      case constants.IMAGE_REG_FORM_STATE_SEND_REGTICKET_MN_2_3:
        buttonArea = <div>
          <div className="regfee-msg">Sending registration ticket to masternodes 2 and 3
          </div>
          <div className="flex-centered">
            <BarLoader
              sizeUnit={'%'}
              width={90}
              color={'#00D1B2'}
              loading={true}
            />
          </div>
        </div>;
        break;
      case constants.IMAGE_REG_FORM_STATE_MN_2_3_RESPONSE_RECEIVED:
        buttonArea = <div>
          <div className="regfee-msg">
            {this.props.imageRegFormMessage}
          </div>
        </div>;
        break;

      case constants.IMAGE_REG_FORM_STATE_ACT_TICKET_RECEIVED:
        buttonArea = <div>
          <div className="regfee-msg">
            {this.props.imageRegFormMessage}
          </div>
        </div>;
        break;

      default:
        break;
    }

    const restFormFields = ['artistName', 'artistWebsite', 'artistWrittenStatement', 'artworkSeriesName', 'artworkCreationVideoYoutubeUrl', 'artworkKeywordSet'].map((item, idx) => {
      return <div className="info-block" key={idx}>
        <span className="label-text">{item}</span>
        <div className="control">
          <input type="text" className="input is-default" name={item}
                 value={this.state[item]} onChange={this.onChange}/>
        </div>
      </div>;

    });

    return <MainWrapper>
      <div className="columns is-multiline">
        <div className="column">
          <div className="flat-card profile-info-card is-auto">

            <div className="card-title">
              <h3>Register image</h3>
            </div>

            <div className="card-body send-psl-card-body">
              <div className="columns">
                <form className="send-psl-form">
                  <div className="info-block">
                    <span className="label-text">Art name</span>
                    <div className="control">
                      <input type="text" className="input is-default" name="artName"
                             value={this.state.artName} onChange={this.onChange}/>
                    </div>
                    <div
                      className={this.props.artNameError ? '' : 'display-none'}>
                      <div className="reg-form-error">
                        {this.props.artNameError}
                      </div>
                    </div>
                  </div>
                  {restFormFields}

                  <div className="info-block">
                    <span className="label-text">Number of copies</span>
                    <div className="control">
                      <input type="number"
                             value={this.state.numCopies} name="numCopies"
                             onChange={this.onChange}
                             className="input is-default"/>
                    </div>
                  </div>
                  <div className="info-block">
                    <span className="label-text">Price of the copy, PSL</span>
                    <div className="control">
                      <input type="number" step="0.0001"
                             value={this.state.copyPrice} name="copyPrice"
                             onChange={this.onChange}
                             className="input is-default"/>
                    </div>
                  </div>
                  <div className="info-block">
                    <div className={this.state.file ? '' : 'display-none'}>
                      <div className="flex-row flex-centered">
                        <img src={this.state.file} className="img-preview pb-1"
                             alt=""/>
                      </div>
                    </div>
                    <span className="label-text">Art file</span>
                    <div>
                      <input type="file" accept="image/*" id="idArtFile"
                             onChange={this.onAddFile}/>
                    </div>
                    <div
                      className={this.props.artFileError ? '' : 'display-none'}>
                      <div className="reg-form-error">
                        {this.props.artFileError}
                      </div>
                    </div>

                  </div>

                  <div className="flex-centered">
                    {buttonArea}
                  </div>

                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainWrapper>;
  }
}