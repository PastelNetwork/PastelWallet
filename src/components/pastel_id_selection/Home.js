import React, {Component} from "react";
import {MainWrapper} from "../MainWrapperComponent";
import {BarLoader} from "react-spinners";
import {Redirect, Route, Switch} from "react-router-dom";
import {PastelIdHomeContainer} from "../../containers/pastel_id_selection/HomeContainer";
import {ArtWalletContainer} from "../../containers/ArtWalletContainer";
import {SendPSLContainer} from "../../containers/SendPSLContainer";
import {ImageRegisterFormContainer} from "../../containers/ImageRegisterFormContainer";
import {ProfileEdit} from "../ProfileEditComponent";
import history from '../../history';

const ipcRenderer = window.require('electron').ipcRenderer;

ipcRenderer.on('pastelIdListResponse', (event, data) => {
    console.log('pastelIdListResponse received');
    // TODO: redirect to the appropriate page (no keys/no registered keys/choose key/...)
    // if list of pastel ID keys is empty:
    // history.push('/pastel_id/no_keys');

    // if list is not empty but there are no registered pastel keys :
    history.push('/pastel_id/no_active_keys');
});

const PastelIdCard = (props) => {
    return <div className="flat-card profile-info-card is-auto">

        <div className="card-title">
            <h3>{props.header}</h3>
        </div>

        <div className="card-body">
            {props.children}
            {/*<div className="columns">*/}
            {/*<div className="column balance-col">*/}
            {/*{props.balance} PSL*/}
            {/*</div>*/}
            {/*<div className="column balance-col">*/}
            {/*{props.artworks} Artworks*/}
            {/*</div>*/}
            {/*<div className="column balance-col">*/}
            {/*{props.masternodes} Masternodes*/}
            {/*</div>*/}
            {/*</div>*/}
        </div>
    </div>;
};

const PastelIdFetchingCard = () => <PastelIdCard header={'Fetching pastel IDs...'}>
    <div className="flex-centered">
        <BarLoader
            sizeUnit={"%"}
            width={90}
            color={'#00D1B2'}
            loading={true}
        />
    </div>
</PastelIdCard>;

class NoKeysCard extends Component {
    createNewClick = () => {
        console.log('Create new click');
    };
    importClick = () => {
        console.log('Import click');
    };

    render() {
        return <PastelIdCard header={'No PastelID keys found'}>
            <div className="flex-centered">
                You have no Pastel ID keys. Would you like to create or import a new one?
            </div>
            <div className="flex-centered">
                <div className="flex-row">
                    <button
                        className="button cart-button secondary-button upper-button rounded is-bold raised"
                        onClick={this.createNewClick}>
                        Create new
                    </button>
                    <button
                        className="button cart-button secondary-button upper-button rounded is-bold raised"
                        onClick={this.importClick}>
                        Import existing
                    </button>
                </div>
            </div>
        </PastelIdCard>;
    }
}

class NoActiveKeysCard extends Component {
    createNewClick = () => {
        console.log('Create new click');
    };
    importClick = () => {
        console.log('Import click');
    };

    render() {
        return <PastelIdCard header={'No PastelID keys found'}>
            <div className="flex-centered">
                You have no registered Pastel ID keys. Which one would you like to register?
            </div>
            <div className="flex-centered">
                <div className="flex-row">
                    <select name="taksa" id="123">
                        <option value="pastel_id_1">pastel_id_1</option>
                        <option value="pastel_id_2">pastel_id_2</option>
                        <option value="pastel_id_2">pastel_id_2</option>
                    </select>
                </div>
                <div className="flex-row">
                    <button
                        className="button cart-button secondary-button upper-button rounded is-bold raised"
                        onClick={this.createNewClick}>
                        Register selected
                    </button>
                    ..or..
                    <button
                        className="button cart-button secondary-button upper-button rounded is-bold raised"
                        onClick={this.createNewClick}>
                        Create new
                    </button>
                    ..or..
                    <button
                        className="button cart-button secondary-button upper-button rounded is-bold raised"
                        onClick={this.importClick}>
                        Import existing
                    </button>
                </div>
            </div>
        </PastelIdCard>;
    }
}

export class PastelIdHome extends Component {
    componentDidMount() {
        ipcRenderer.send('pastelIdList', {});
    }

    render() {
        return <MainWrapper>
            <Switch>
                <Route path='/pastel_id/fetching' component={PastelIdFetchingCard}/>
                <Route path='/pastel_id/no_keys' component={NoKeysCard}/>
                <Route path='/pastel_id/no_active_keys' component={NoActiveKeysCard}/>
                <Redirect to='/pastel_id/fetching'/>
            </Switch>
        </MainWrapper>;
    }
}
