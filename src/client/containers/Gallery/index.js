import React, { Component } from 'react';
import * as style from './style.module.scss';
import { connect } from 'react-redux';
import { Card, Wrapper } from '../../components/common';
import Filter from './Filter';
import Artwork from './Artwork';
import { SET_ARTWORKS_DATA_LOADING } from '../../actionTypes';
import { ipcRenderer } from '../../ipc/ipc';
import { SHOW_ALL } from './constants';

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

class Gallery extends Component {
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
    return <Wrapper>
      <Card style={{ width: '100%' }} className={style.gallery}>
        <h3>ARTWORK GALLERY</h3>
        <Filter onChange={this.onFilterChange} active={this.state.filter} style={{ marginTop: '24px' }}/>
        <div className={style.artworks}>
          {this.props.data && this.props.data.filter(item => {
            if (this.state.filter === SHOW_ALL) {
              return true;
            }
            return item.artistPastelId === this.props.pastelID;
          }).map((item, idx) => <Artwork data={item} key={idx} saleData={getSampleSaleData()}/>)}
        </div>
      </Card>
    </Wrapper>;
  }
}

export default connect(state => ({
  data: state.artworks.data,
  loading: state.artworks.loading,
  pastelID: state.others.currentPastelID
}))(Gallery);
