import React, { Component, useEffect } from 'react';
import * as style from './style.module.scss';
import { connect } from 'react-redux';
import { Card, Wrapper } from '../../components/common';
import Filter from './Filter';
import Artwork from './Artwork';
import { SET_ARTWORKS_DATA_LOADING } from '../../actionTypes';
import { ipcRenderer } from '../../ipc/ipc';
import { SHOW_ALL } from './constants';
import { Route, Switch, withRouter } from 'react-router-dom';
import Detail from './Detail';

class ArtworkList extends Component {
  constructor (props) {
    super(props);
    this.state = {
      filter: SHOW_ALL
    };
  }

  onFilterChange = (value) => {
    this.setState({ filter: value });
  };

  render () {
    const columns = { 0: [], 1: [], 2: [] };
    this.props.data && this.props.data.filter(item => {
      if (this.state.filter === SHOW_ALL) {
        return true;
      }
      return item.artistPastelId === this.props.pastelID;
    }).map((item, idx) => columns[idx % 3].push(<Artwork
        data={item}
        key={idx}
        saleData={item.saleData}
        buyError={this.props.buyErrors[item.actTicketTxid]}
        buyMessage={this.props.buyMessages[item.actTicketTxid]}
        />)
    );

    return <Wrapper>
      <Card style={{ width: '100%' }} className={style.gallery}>
        <h3>ARTWORK GALLERY</h3>
        <Filter onChange={this.onFilterChange} active={this.state.filter} style={{ marginTop: '24px' }}/>
        <div className={style.artworks}>
          <div className={style['art-column']}>{columns[0]}</div>
          <div className={style['art-column']}>{columns[1]}</div>
          <div className={style['art-column']}>{columns[2]}</div>
        </div>
      </Card>
    </Wrapper>;
  }
}

const stateToProps = state => ({
  data: state.artworks.data,
  buyErrors: state.artworks.buyErrors,
  buyMessages: state.artworks.buyMessages,
  loading: state.artworks.loading,
  pastelID: state.pastelid.currentPastelID
});

const Gallery = (props) => {
  useEffect(() => {
    if (!props.data) {
      ipcRenderer.send('artworksDataRequest', {});
      props.dispatch({ type: SET_ARTWORKS_DATA_LOADING, value: true });
    }
  }, []);
  return <Switch>
    <Route path='/gallery/:image_hash' component={Detail}/>
    <Route path='/gallery' component={connect(stateToProps)(ArtworkList)}/>
  </Switch>;
};

export default connect(
  state => ({ data: state.artworks.data }))(
  withRouter(Gallery));
