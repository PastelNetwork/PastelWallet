import React, { Component } from 'react';
import { Wrapper, Card, Button } from '../../../components/common';
import * as style from './style.module.scss';
import { connect } from 'react-redux';
import history from '../../../history';
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

class Detail extends Component {
  render () {
    const saleData = {
      forSale: true,
      price: 1232
    };
    const imageHash = this.props.match.params.image_hash;
    const data = this.props.artworksData ? this.props.artworksData.filter(a => a.imageHash === imageHash)[0] : {};
    const { name, orderBlockTxid, thumbnailPath, artistPastelId } = data;
    return <Wrapper>
      <Card>
        <div onClick={() => history.goBack()} className={style.backlink}>{'<<'} Back to gallery</div>

        <div className={style.artwork}>
          <p className={style.txid}><span>TXID</span> {orderBlockTxid}</p>
      {
        artistPastelId === this.props.pastelId ?
        <div className={style['my-sticker']}>my</div> : null}
      {saleData.forSale ?
        <div className={style['sale-sticker']}>for sale</div> : null}

          <img src={`file://${thumbnailPath}`} alt=""/>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <h3>{name}</h3>
              {saleData.forSale ? <span className={style.price}>
                {saleData.price} PSL
              </span> : null}
            </div>
              <Button btnType={BTN_TYPE_GREEN} style={{ width: '145px', height: '37px', marginTop: '20px' }}>Sell artwork</Button>
          </div>
        </div>
      </Card>
    </Wrapper>;
  }
}

export default connect(
  state => ({
    artworksData: state.artworks.data,
    pastelId: state.others.currentPastelID
  }))
(Detail);
