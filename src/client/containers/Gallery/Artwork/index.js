import React, { Component } from 'react';
import * as style from './style.module.scss';
import { Button } from '../../../components/common';
import { connect } from 'react-redux';
import { BTN_TYPE_GREEN } from '../../../components/common/constants';

// {
//     'artistPastelId': artwork.artist_pastelid,
//     'name': artwork.artwork_title,
//     'numOfCopies': artwork.total_copies,
//     'copyPrice': -1,
//     'thumbnailPath': artwork.get_thumbnail_path(),
//     'artistName': artwork.artist_name,
//     'artistWebsite': artwork.artist_website,
//     'artistWrittenStatement': artwork.artist_written_statement,
//     'artworkSeriesName': artwork.artwork_series_name,
//     'artworkCreationVideoYoutubeUrl': artwork.artwork_creation_video_youtube_url,
//     'artworkKeywordSet': artwork.artwork_keyword_set,
//     'imageHash': artwork.get_image_hash_digest(),
//     'blocknum': artwork.blocknum,
//     'orderBlockTxid': artwork.order_block_txid
// }

class Artwork extends Component {
  render () {
    const { artistPastelId, name, numOfCopies, thumbnailPath } = this.props.data;
    const { forSale, price } = this.props.saleData;
    return <div className={style.artwork}>
      {artistPastelId === this.props.pastelID ?
        <div className={style['my-sticker']}>my</div> : null}
      {forSale ?
        <div className={style['sale-sticker']}>for sale</div> : null}

      <img src={`file://${thumbnailPath}`} alt=""/>
      <h4>{name}</h4>
      <div className={style['col-container']}>
        <p><b>Total</b> {numOfCopies} copies</p>
        <p><b>Pastel ID</b> {artistPastelId.substr(0, 10)}</p>
        <Button style={{ width: '145px', marginLeft: '16px', marginTop: '7px' }}>More details</Button>

        {forSale ?
          <div style={{
            display: 'flex', paddingLeft: '16px', paddingTop: '3px', justifyContent: 'space-between',
            paddingRight: '14px'
          }}>
            <span className={style.price}
                  style={{ color: 'var(--success)', fontSize: '16px', lineHeight: '37px' }}>{price} PSL</span>
            <Button btnType={BTN_TYPE_GREEN} style={{ width: '72px' }}>Buy</Button>
          </div> : null}
      </div>
    </div>;
  }
}

export default connect(state => (
  { pastelID: state.others.currentPastelID }
))(Artwork);
