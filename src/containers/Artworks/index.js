import React, { Component } from 'react';
import { MainWrapper } from '../../components/MainWrapperComponent';
import * as style from './style.module.scss';
import { connect } from 'react-redux';
import { RESPONSE_STATUS_OK } from '../../constants';
import { store } from '../../app';
import { SET_ARTWORKS_DATA, SET_ARTWORKS_DATA_LOADING } from '../../actionTypes';
import { BarLoader } from 'react-spinners';

const ipcRenderer = window.require('electron').ipcRenderer;

ipcRenderer.on('artworksDataResponse', (event, data) => {
  if (data.status === RESPONSE_STATUS_OK) {
    console.log(data);
    store.dispatch({ type: SET_ARTWORKS_DATA, value: data.data });
    store.dispatch({ type: SET_ARTWORKS_DATA_LOADING, value: false });
  } else {
    console.log('Error requesting artworks data');
  }
});

class SingleArtworkCard extends Component {
  render () {
    const artwork = this.props.artwork;
    return <li className="flat-card is-auto is-list-item">
                <span className="image">
                    <img src="https://loremflickr.com/500/500/digital,painting?random=1" alt=""/>
                </span>
      <span className="product-info">
                {/*<span className="rating">*/}
        {/*    <i className="fa fa-star"></i>*/}
        {/*    <i className="fa fa-star"></i>*/}
        {/*    <i className="fa fa-star"></i>*/}
        {/*    <i className="fa fa-star"></i>*/}
        {/*    <i className="fa fa-star"></i>*/}
        {/*    <small className="is-hidden-mobile">47 Ratings</small>*/}
        {/*</span>*/}
        {/*<a href="product.html">*/}
        <span className="product-name">{artwork.name}</span>
        {/*</a>*/}
        <span className="product-description">Total {artwork.numOfCopies} copies</span>
        <span className={`product-price ${style['product-price']}`}>
                    {artwork.copyPrice}
                </span>
                </span>

      {/*<span className="product-abstract is-hidden-mobile">*/}
      {/*              This is a well designed and crafted product that will suit many needs, in terms of quality, craftmanship and aesthetics.*/}
      {/*  <span className="view-more">*/}
      {/*      <a href="product.html">View more <i data-feather="chevron-right"></i></a>*/}
      {/*  </span>*/}
      {/*</span>*/}

      <span className="actions">
        <span className="add"><i data-feather="shopping-cart" className="has-simple-popover"
                                 data-content="Add to Cart" data-placement="top"></i></span>
        <span className="like"><i data-feather="heart" className="has-simple-popover"
                                  data-content="Add to Wishlist" data-placement="top"></i></span>
      </span>
    </li>;

  }
}

class ArtWorks extends Component {
  constructor (props) {
    super(props);
    this.state = {
      onlyMyArtworks: false
    };
  }

  componentDidMount () {
    ipcRenderer.send('artworksDataRequest', {});
    this.props.dispatch({ type: SET_ARTWORKS_DATA_LOADING, value: true });
  }

  f = (e) => {
    debugger;
    console.log(e.target);
    this.setState({ onlyMyArtworks: e.target.value });
  };

  render () {
    let artworks;
    if (this.props.artworksData) {
      artworks = (this.state.onlyMyArtworks ? this.props.artworksData.filter(a => a.artistPastelId === this.props.currentPastelID) : this.props.artworksData).map((artwork, idx) => {
        return <SingleArtworkCard artwork={artwork} key={idx}/>;
      });
    }

    return <MainWrapper>
      <div className={style.filter}>
        <span className={this.state.onlyMyArtworks ? style['only-my-artworks'] : style['all-artworks']}
              onClick={() => this.setState({ onlyMyArtworks: !this.state.onlyMyArtworks })}>
          {this.state.onlyMyArtworks ? 'All artworks' : 'Mine artworks'}
        </span>
      </div>
      <div className="columns is-product-list is-multiline">
        <div className="column is-12">
          <ul>
            {this.props.artworksDataLoading ? <BarLoader
                sizeUnit={'%'}
                width={90}
                color={'#00D1B2'}
                loading={true}
              />
              : null}
            {this.props.artworksData && artworks}

          </ul>

        </div>

      </div>
    </MainWrapper>;
  }
}

export default connect(state => ({
  artworksData: state.artworksData,
  artworksDataLoading: state.artworksDataLoading,
  currentPastelID: state.currentPastelID
}), dispatch => ({ dispatch }))(ArtWorks);
