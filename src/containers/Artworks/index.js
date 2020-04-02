import React, { Component } from 'react';
import { MainWrapper } from '../../components/MainWrapperComponent';
import * as style from './style.module.scss';
import { connect } from 'react-redux';

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
        <a href="product.html"><span className="product-name">{artwork.name}</span></a>
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
  componentDidMount () {
    document.title = 'Pastel wallet';
    // ipcRenderer.send('blockchainDataRequest', {});
    // ipcRenderer.send('getBalanceRequest', {});
  }

  render () {
    // const artworks = this.props.artworkData.map((artwork, idx) => {
    //   return <SingleArtworkCard artwork={artwork} key={idx}/>;
    // });
    return <MainWrapper>
      <div className="columns is-product-list is-multiline">
        <div className="column is-12">
          <ul>
            {this.props.artworksData.map((artwork, idx) => {
              return <SingleArtworkCard artwork={artwork} key={idx}/>;
            })}

          </ul>

        </div>

      </div>
    </MainWrapper>;
  }
}

export default connect(state => ({ artworksData: state.artworksData }), dispatch => ({ dispatch }))(ArtWorks);
