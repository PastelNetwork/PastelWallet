import React, {Component} from "react";
import {MainWrapper} from "../MainWrapperComponent";
import {BarLoader} from "react-spinners";
import {Redirect, Route, Switch} from "react-router-dom";
import '../../assets/scss/core.scss';
import history from '../../history';
import * as constants from "../../constants";
import {store} from "../../app";
import {setPasteIDList} from "../../actions";

const ipcRenderer = window.require('electron').ipcRenderer;

ipcRenderer.on('pastelIdListResponse', (event, data) => {
    console.log('Response received');
    switch (data.status) {
        case constants.RESPONSE_STATUS_ERROR:
            alert('Error connection cNode');
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


            break;
        default:
            break;
    }

});

ipcRenderer.on('pastelIdCreateResponse', (event, data) => {
    console.log('Create response received');
    console.log(data);
    switch (data.status) {
        case constants.RESPONSE_STATUS_ERROR:
            alert('Error connection cNode when creating new pastel ID');
            break;
        case constants.RESPONSE_STATUS_OK:
            history.push('/pastel_id/fetching');
            break;
        default:
            break;
    }

});

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

class NoKeysCard extends Component {
    createNewClick = () => {
        // invoke create dialog
        history.push('/pastel_id/create_new_key');
    };
    importClick = () => {
        // TODO: invoke import dialog
        console.log('Import click');
    };

    render() {
        return <PastelIdCard header={'No PastelID keys found'}>
            <div className="flex-centered">
                You have no Pastel ID keys. Would you like to create or import a new one?
            </div>
            <div className="flex-centered">
                <div className="flex-row wrap">
                    <div className="pastel-id-btn-wrapper">
                        <button
                            className="button feather-button is-bold primary-button raised"
                            onClick={this.createNewClick}>
                            Create new
                        </button>
                    </div>
                    <div className="pastel-id-btn-wrapper">
                        <button
                            className="button feather-button is-bold primary-button raised"
                            onClick={this.importClick}>
                            Import existing
                        </button>
                    </div>
                </div>
            </div>
        </PastelIdCard>;
    }
}

class CreateNewKeyCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            passphrase: '',
            createInProgress: false
        }
    }

    onPassphraseChange = (e) => {
        this.setState({passphrase: e.target.value});
    };


    createClick = () => {
        this.setState({createInProgress: true});
        ipcRenderer.send('pastelIdCreate', {passphrase: this.state.passphrase});
    };

    render() {
        let inner_part;
        if (this.state.createInProgress) {
            inner_part = <React.Fragment>
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
            </React.Fragment>;
        } else {
            inner_part = <React.Fragment>
                <div className="flex-centered">
                    <div className="flex-row">
                    <textarea className="textarea is-button" placeholder="Enter passphrase"
                              value={this.state.passphrase}
                              onChange={this.onPassphraseChange}/>
                    </div>
                </div>
                <div className="flex-centered">
                    <div className="flex-row">
                        <div className="pastel-id-btn-wrapper">
                            <button
                                className="button feather-button is-bold primary-button raised"
                                onClick={this.createClick}>
                                Create
                            </button>
                        </div>
                    </div>
                </div>
            </React.Fragment>;

        }
        return <PastelIdCard header={'Create new PastelID'}>
            {inner_part}
        </PastelIdCard>;
    }
}


class NoActiveKeysCard extends Component {
    // TODO: Styled dropdown
    createNewClick = () => {
        history.push('/pastel_id/create_new_key');
    };
    importClick = () => {
        // TODO: invoke import dialog
        console.log('Import click');
    };
    registerPastelID = () => {

    };

    render() {
        return <PastelIdCard>
            <div className="flex-row pastel-id-btn-wrapper">
                You have no registered Pastel ID keys. Which one would you like to register?
            </div>
            <div className="flex-row">
                <select>
                    <option value="pastel_id_1">pastel_id_1</option>
                    <option value="pastel_id_2">pastel_id_2</option>
                    <option value="pastel_id_2">pastel_id_2</option>
                </select>
            </div>
            <div className="flex-row wrap">
                <div className="pastel-id-btn-wrapper">
                    <button
                        className="button feather-button is-bold primary-button raised"
                        onClick={this.createNewClick}>
                        Register selected
                    </button>
                    ..or..
                </div>
                <div className="pastel-id-btn-wrapper">
                    <button
                        className="button feather-button is-bold primary-button raised"
                        onClick={this.createNewClick}>
                        Create new
                    </button>
                    ..or..
                </div>
                <div className="pastel-id-btn-wrapper">
                    <button
                        className="button feather-button is-bold primary-button raised"
                        onClick={this.importClick}>
                        Import existing
                    </button>
                </div>
            </div>

        </PastelIdCard>;
    }
}

export class PastelIdHome extends Component {
    render() {
        return <MainWrapper>
            <Switch>
                <Route path='/pastel_id/fetching' component={PastelIdFetchingCard}/>
                <Route path='/pastel_id/no_keys' component={NoKeysCard}/>
                <Route path='/pastel_id/no_active_keys' component={NoActiveKeysCard}/>
                <Route path='/pastel_id/create_new_key' component={CreateNewKeyCard}/>
                <Redirect to='/pastel_id/fetching'/>
            </Switch>
        </MainWrapper>;
    }
}
