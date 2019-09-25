import React, {Component} from "react";
import {MainWrapper} from "../MainWrapperComponent";
import {BarLoader} from "react-spinners";
import {Redirect, Route, Switch} from "react-router-dom";
import '../../assets/scss/core.scss';
import history from '../../history';
import * as constants from "../../constants";
import {store} from "../../app";
import {setCurrentPassphrase, setCurrentPasteID, setPasteIDError, setPasteIDList} from "../../actions";
import {connect} from "react-redux";
import Select from 'react-select';

const ipcRenderer = window.require('electron').ipcRenderer;

ipcRenderer.on('pastelIdListResponse', (event, data) => {
    switch (data.status) {
        case constants.RESPONSE_STATUS_ERROR:
            store.dispatch(setPasteIDError(data.err));
            history.push('/pastel_id/error');
            break;
        case constants.RESPONSE_STATUS_OK:
            const pastelIdList = data.data;
            if (pastelIdList.length === 0) {
                history.push('/pastel_id/no_keys');
                break;
            }
            store.dispatch(setPasteIDList(pastelIdList));

            // if no active(registered) keys
            if (pastelIdList.filter(pastelId => pastelId.isRegistered).length === 0) {
                history.push('/pastel_id/no_active_keys');
            }

            // if at least some keys are registered
            if (pastelIdList.filter(pastelId => pastelId.isRegistered).length > 0) {
                history.push('/pastel_id/has_active_keys');
            }


            break;
        default:
            break;
    }
});

ipcRenderer.on('pastelIdCreateResponse', (event, data) => {
    switch (data.status) {
        case constants.RESPONSE_STATUS_ERROR:
            store.dispatch(setPasteIDError(data.err));
            history.push('/pastel_id/error');
            break;
        case constants.RESPONSE_STATUS_OK:
            history.push('/pastel_id/fetching');
            break;
        default:
            break;
    }
});

ipcRenderer.on('pastelIdImportResponse', (event, data) => {
    switch (data.status) {
        case constants.RESPONSE_STATUS_ERROR:
            store.dispatch(setPasteIDError(data.err));
            history.push('/pastel_id/error');
            break;
        case constants.RESPONSE_STATUS_OK:
            history.push('/pastel_id/fetching');
            break;
        default:
            break;
    }

});

ipcRenderer.on('pastelIdRegisterResponse', (event, data) => {
    switch (data.status) {
        case constants.RESPONSE_STATUS_ERROR:
            store.dispatch(setPasteIDError(data.err));
            history.push('/pastel_id/error');
            break;
        case constants.RESPONSE_STATUS_OK:
            history.push('/pastel_id/fetching');
            break;
        default:
            break;
    }

});

ipcRenderer.on('pastelIdCheckPassphraseResponse', (event, data) => {
    switch (data.status) {
        case constants.RESPONSE_STATUS_ERROR:
            store.dispatch(setPasteIDError(data.err));
            history.push('/pastel_id/error');
            break;
        case constants.RESPONSE_STATUS_OK:
            // At this point we start wallet_api python proccess from main_electron with given pastelID and passphrase
            store.dispatch(setCurrentPasteID(data.pastelID));
            store.dispatch(setCurrentPassphrase(data.passphrase));
            history.push('/wallet');
            break;
        default:
            break;
    }
});

const OrRecord = (props) => <div className="flex-row">
    <div className="or-record">
        or
    </div>
</div>;

const PastelIDButton = (props) => {
    const btnClass = props.disabled ? 'button feather-button is-bold primary-button raised is-disabled' : 'button feather-button is-bold primary-button raised';
    return <div className="pastel-id-btn-wrapper flex-row">
        <button
            className={btnClass}
            onClick={props.onClick}>
            {props.text}
        </button>
    </div>;
};

const PastelIdCard = (props) => {
    const title = props.header ?
        <div className="card-title">
            <h3>{props.header}</h3>
        </div> : null;

    return <div className="flat-card profile-info-card is-auto">

        {title}
        <div className="card-body">
            {props.children}
        </div>
    </div>;
};

class PastelIdFetchingCard extends Component {
    componentDidMount() {
        ipcRenderer.send('pastelIdList', {});
    }


    render() {
        return <PastelIdCard header={'Fetching pastel IDs...'}>
            <div className="flex-centered">
                <BarLoader
                    sizeUnit={"%"}
                    width={90}
                    color={'#00D1B2'}
                    loading={true}
                />
            </div>
        </PastelIdCard>;
    }
}

const PastelIdErrorCardComponent = (props) => {
    return <PastelIdCard header={'Error'}>
        <div className="error">
            {props.error}
        </div>
        <div className="pt-1"/>
        <PastelIDButton onClick={() => history.push('/pastel_id/fetching')} text="Return"/>
    </PastelIdCard>;
};

const PastelIdErrorCard = connect(state => ({
    error: state.pastelIDError
}), null)(PastelIdErrorCardComponent);

class NoKeysCard extends Component {
    createNewClick = () => {
        // invoke create dialog
        history.push('/pastel_id/create_new_key');
    };
    importClick = () => {
        history.push('/pastel_id/import');
    };

    render() {
        return <PastelIdCard header={'No PastelID keys found'}>
            <div className="flex-centered">
                You have no Pastel ID keys. Would you like to create or import a new one?
            </div>
            <div className="pt-1"/>
            <PastelIDButton onClick={this.createNewClick} text="Create new"/>
            <OrRecord/>
            <PastelIDButton onClick={this.importClick} text="Import existing"/>
        </PastelIdCard>;
    }
}


class CreateInProgressCard extends Component {
    render() {
        return <PastelIdCard header={'Create new PastelID'}>
            <div className="flex-centered">
                Creating pastel ID...
            </div>
            <div className="flex-centered">
                <BarLoader
                    sizeUnit={"%"}
                    width={90}
                    color={'#00D1B2'}
                    loading={true}
                />
            </div>
        </PastelIdCard>;
    }
}

class CreateNewKeyCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            passphrase: ''
        }
    }

    onPassphraseChange = (e) => {
        this.setState({passphrase: e.target.value});
    };


    createNoRegisterClick = () => {
        ipcRenderer.send('pastelIdCreate', {passphrase: this.state.passphrase});
    };

    createAndRegisterClick = () => {
        ipcRenderer.send('pastelIdCreateAndRegister', {passphrase: this.state.passphrase});
    };

    render() {

        return <PastelIdCard header={'Create new PastelID'}>
            <div className="flex-row">
    <textarea className="textarea is-button" placeholder="Enter passphrase"
              value={this.state.passphrase}
              onChange={this.onPassphraseChange}/>
            </div>
            <div className="pt-1"/>
            <PastelIDButton onClick={this.createAndRegisterClick} text="Create and register"/>
            <OrRecord/>
            <PastelIDButton onClick={this.createNoRegisterClick} text="Create without registration"/>
        </PastelIdCard>;
    }
}

class PastelIdImportCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            passphrase: '',
            key: ''
        }
    }

    onChange = (e) => {
        this.setState({[e.target.name]: e.target.value});
    };

    importNoRegisterClick = () => {
        ipcRenderer.send('pastelIdImport', {passphrase: this.state.passphrase, key: this.state.key});
    };

    importAndRegisterClick = () => {
        ipcRenderer.send('pastelIdImportAndRegister', {passphrase: this.state.passphrase, key: this.state.key});
    };

    render() {
        return <PastelIdCard header={'Import PastelID'}>
            <div className="flex-row">
    <textarea className="textarea is-button" placeholder="Enter key"
              value={this.state.key}
              onChange={this.onChange} name="key"/>
            </div>
            <div className="flex-row">
    <textarea className="textarea is-button" placeholder="Enter passphrase"
              value={this.state.passphrase}
              onChange={this.onChange} name="passphrase"/>
            </div>
            <div className="pt-1"/>
            <PastelIDButton onClick={this.importAndRegisterClick} text="Import and register"/>
            <OrRecord/>
            <PastelIDButton onClick={this.importNoRegisterClick} text="Import without registration"/>
        </PastelIdCard>;
    }
}


class NoActiveKeysCardComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedPastelId: null
        }
    }

    createNewClick = () => {
        history.push('/pastel_id/create_new_key');
    };
    importClick = () => {
        history.push('/pastel_id/import');
    };
    registerPastelID = () => {
        ipcRenderer.send('pastelIdRegister', {pastelID: this.state.selectedPastelId});
    };

    onChange = (selectedOption) => {
        this.setState({selectedPastelId: selectedOption});
    };

    render() {
        const pastelIDsOptions = this.props.pastelIDs.map(x => ({
            value: x.PastelID,
            label: x.PastelID.substr(0, 10),
            isRegistered: x.isRegistered
        }));
        const customStyles = {
            container: (provided) => ({
                ...provided,
                width: '100%'
            }),
            option: (provided, state) => ({
                ...provided,
                color: state.data.isRegistered ? 'green' : 'red'
            })
        };
        let registerSelected = <OrRecord/>;
        if (this.state.selectedPastelId !== null) {
            registerSelected = <React.Fragment>
                <div className="flex-row pt-1"/>
                <PastelIDButton onClick={this.registerPastelID} text="Register selected"/>
                <OrRecord/>
            </React.Fragment>;
        }


        return <PastelIdCard>
            <div className="flex-row pastel-id-btn-wrapper">
                You have no registered Pastel ID keys. Which one would you like to register?
            </div>
            <div className="flex-row pt-1">
                <Select onChange={this.onChange}
                        value={this.state.selectedPastelId}
                        options={pastelIDsOptions}
                        styles={customStyles}
                />
            </div>
            {registerSelected}
            <PastelIDButton onClick={this.createNewClick} text="Create new"/>
            <OrRecord/>
            <PastelIDButton onClick={this.importClick} text="Import existing"/>
        </PastelIdCard>;
    }
}

const NoActiveKeysCard = connect(state => ({
    pastelIDs: state.pastelIDs
}), dispatch => ({
    dispatch
}))(NoActiveKeysCardComponent);

class HasActiveKeysCardComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedPastelId: null,
            passphrase: ''
        }
    }

    createNewClick = () => {
        history.push('/pastel_id/create_new_key');
    };
    importClick = () => {
        history.push('/pastel_id/import');
    };
    registerPastelID = () => {
        ipcRenderer.send('pastelIdRegister', {pastelID: this.state.selectedPastelId});
    };

    usePastelID = () => {
        ipcRenderer.send('pastelIdCheckPassphrase', {
            pastelID: this.state.selectedPastelId.value,
            passphrase: this.state.passphrase
        });
        this.setState({passphrase: ''});
        // TODO: find and replace all occurances of old pastelid from wallet_api
        // TODO: wallet-api: use selected pastel ID as active pastel ID. As wallet-api is stateless - need to add active pastel ID to every request for wallet_api.
    };

    onChange = (selectedOption) => {
        this.setState({selectedPastelId: selectedOption});
    };

    onPassphraseChange = (e) => {
        this.setState({passphrase: e.target.value});
    };

    render() {
        const pastelIDsOptions = this.props.pastelIDs.map(x => ({
            value: x.PastelID,
            label: x.PastelID.substr(0, 10) + (x.isRegistered ? ' (registered)' : ' (not registered)'),
            isRegistered: x.isRegistered
        }));
        const customStyles = {
            container: (provided) => ({
                ...provided,
                width: '100%'
            }),
            option: (provided, state) => ({
                ...provided,
                color: state.data.isRegistered ? 'green' : 'red'
            })
        };
        let registerProceedButton = <OrRecord/>;
        if (this.state.selectedPastelId !== null) {
            if (this.state.selectedPastelId.isRegistered) {
                registerProceedButton = <React.Fragment>
                    <div className="pt-1"/>
                    <div className="control flex-row">
                        <input type="text" className="input is-default" value={this.state.passphrase}
                               onChange={this.onPassphraseChange} name="firstName" placeholder="Passphrase"/>
                    </div>
                    <div className="pt-1"/>
                    <PastelIDButton onClick={this.usePastelID} text="Proceed" disabled={!this.state.passphrase}/>
                    <OrRecord/>
                </React.Fragment>;
            } else {
                registerProceedButton = <React.Fragment>
                    <div className="pt-1"/>
                    <PastelIDButton onClick={this.registerPastelID} text="Register selected"/>
                    <OrRecord/>
                </React.Fragment>;
            }
        }

        return <PastelIdCard>
            <div className="flex-row pastel-id-btn-wrapper">
                Please choose which PastelID to use
            </div>
            <div className="flex-row pt-1">
                <Select onChange={this.onChange}
                        value={this.state.selectedPastelId}
                        options={pastelIDsOptions}
                        styles={customStyles}
                />
            </div>
            {registerProceedButton}
            <PastelIDButton onClick={this.createNewClick} text="Create new"/>
            <OrRecord/>
            <PastelIDButton onClick={this.importClick} text="Import existing"/>
        </PastelIdCard>;
    }
}

const HasActiveKeysCard = connect(state => ({
    pastelIDs: state.pastelIDs
}), null)(HasActiveKeysCardComponent);

export class PastelIdHome extends Component {
    render() {
        return <MainWrapper>
            <Switch>
                <Route path='/pastel_id/fetching' component={PastelIdFetchingCard}/>
                <Route path='/pastel_id/no_keys' component={NoKeysCard}/>
                <Route path='/pastel_id/no_active_keys' component={NoActiveKeysCard}/>
                <Route path='/pastel_id/has_active_keys' component={HasActiveKeysCard}/>
                <Route path='/pastel_id/create_new_key' component={CreateNewKeyCard}/>
                <Route path='/pastel_id/create_in_progress' component={CreateInProgressCard}/>
                <Route path='/pastel_id/error' component={PastelIdErrorCard}/>
                <Route path='/pastel_id/import' component={PastelIdImportCard}/>
                <Redirect to='/pastel_id/fetching'/>
            </Switch>
        </MainWrapper>;
    }
}
