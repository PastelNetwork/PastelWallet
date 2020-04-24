import React, { Component } from 'react';
import { MainWrapper } from '../../components/MainWrapperComponent';
import * as style from './style.module.scss';
import { connect } from 'react-redux';
import history from '../../../client/history';

const humanReadableFieldNames = {
  artistPastelId: 'Artist Pastel ID',
  numOfCopies: 'Total copies',
  copyPrice: ' Copy price',
  artistWebsite: 'Artist website',
  artistWrittenStatement: 'Artist written statement',
  artworkSeriesName: 'Artwork series',
  artworkCreationVideoYoutubeUrl: 'Creation video URL',
  artworkKeywordSet: 'Keywords',
  imageHash: 'Artwork image hash (SHA3-512 digest)',
  blocknum: 'Registration ticket block number'
};
const dataFieldNames = ['artistPastelId', 'numOfCopies', 'copyPrice', 'artistWebsite', 'artistWrittenStatement', 'artworkSeriesName', 'artworkCreationVideoYoutubeUrl', 'artworkKeywordSet', 'imageHash', 'blocknum'];

class ArtworkDetails extends Component {
  onSellClick = () => {
    console.log('Sell artwork click');
  };
  onBuyClick = () => {
    console.log('Sell artwork click');
  };

  render () {
    const imageHash = this.props.match.params.image_hash;
    let artwork = this.props.artworksData.filter(a => a.imageHash === imageHash)[0];
    const dataFields = dataFieldNames.map((item, idx) => {
      return <div className={style['artwork-data-item']} key={idx}>
        <h3>{humanReadableFieldNames[item]}</h3>
        <p>{artwork[item]}</p>
      </div>;
    });
    return (
      <MainWrapper>
        <div className={style.back} onClick={() => history.push('/artworks')}>{'<<'}Back to artworks</div>
        <div className={style['image-wrapper']}>
          <img src={`file://${artwork.thumbnailPath}`} alt=""/>
        </div>
        <div className={style['button-block']}>
          <button className={style['trade-btn']} style={{ 'margin-right': '20px' }} onClick={this.onSellClick}>Sell
            artwork
          </button>
          <button className={style['trade-btn']} onClick={this.onBuyClick}>Buy artwork</button>
        </div>
        <div className={style['artwork-main-data']}>
          <h3>{artwork.name}</h3>
          <h5>Buy {artwork.artistName}</h5>
          <p>TXID {artwork.orderBlockTxid}</p>
        </div>
        <div className={style['artwork-other-data']}>
          {dataFields}
        </div>

      </MainWrapper>
    );
  }
}

export default connect(state => ({
  artworksData: state.artworksData,
}), dispatch => ({ dispatch }))(ArtworkDetails);
