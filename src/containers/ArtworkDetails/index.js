import React, { Component } from 'react';
import { MainWrapper } from '../../components/MainWrapperComponent';
import * as style from './style.module.scss';
import { connect } from 'react-redux';
import history from '../../history';

const humanReadaableFieldNames = {
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
  render () {
    const imageHash = this.props.match.params.image_hash;
    let artwork = this.props.artworksData.filter(a => a.imageHash === imageHash)[0];
    const dataFields = dataFieldNames.map((item, idx) => {
      return <div className={style['artwork-data-item']} key={idx}>
        <div className={style['local-header']}>{humanReadaableFieldNames[item]}</div>
        <div className={style['content']}>{artwork[item]}</div>
      </div>;

    });
    return (
      <MainWrapper>
        <div className={style['image-wrapper']}>
          <img src={`file://${artwork.thumbnailPath}`} alt=""/>
        </div>
        <div className={style['artwork-main-data']}>
          <h1>{artwork.name}</h1>
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
