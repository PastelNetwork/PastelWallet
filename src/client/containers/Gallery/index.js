import React, { Component } from 'react';
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

const getSampleSaleData = () => {
  if (Math.random() <= 0.33) {
    return {
      forSale: true,
      price: 1232
    };
  } else {
    return {
      forSale: false,
      price: -1
    };

  }
};

class ArtworkList extends Component {
  constructor (props) {
    super(props);
    this.state = {
      filter: SHOW_ALL
    };
  }

  componentDidMount () {
    if (!this.props.data) {
      ipcRenderer.send('artworksDataRequest', {});
      this.props.dispatch({ type: SET_ARTWORKS_DATA_LOADING, value: true });
    }
  }

  onFilterChange = (value) => {
    this.setState({ filter: value });
  };

  render () {
    const columns = {0: [], 1: [], 2: []};
    this.props.data && this.props.data.filter(item => {
      if (this.state.filter === SHOW_ALL) {
        return true;
      }
      return item.artistPastelId === this.props.pastelID;
    }).map((item, idx) => columns[idx%3].push(<Artwork data={item} key={idx} saleData={getSampleSaleData()}/>)
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
  loading: state.artworks.loading,
  pastelID: state.others.currentPastelID
});

const Gallery = () => {
  return <Switch>
    <Route path='/gallery/:image_hash' component={Detail}/>
    <Route path='/gallery' component={connect(stateToProps)(ArtworkList)}/>
  </Switch>;
};

export default withRouter(Gallery);
