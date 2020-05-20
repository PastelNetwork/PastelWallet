import React, { Component } from 'react';
import { Wrapper, Card, Button, Input } from '../../../components/common';
import * as style from './style.module.scss';
import { connect } from 'react-redux';
import history from '../../../history';
import { BTN_TYPE_GREEN, BTN_TYPE_LIGHT_GREEN } from '../../../components/common/constants';
import { getSampleSaleData } from '../index';

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

class Detail extends Component {
  constructor (props) {
    super(props);
    this.state = {
      sellMode: false,
      buyMode: false,
      price: 0
    };
  }

  render () {
    const imageHash = this.props.match.params.image_hash;
    const data = this.props.artworksData ? this.props.artworksData.filter(a => a.imageHash === imageHash)[0] : {};
    const { forSale, price } = data.saleData ? data.saleData : {};
    const { name, orderBlockTxid, thumbnailPath, artistPastelId } = data;
    const isMy = artistPastelId === this.props.pastelId;
    let dialog = null;
    let button = isMy ?
      <Button btnType={BTN_TYPE_GREEN} style={{ width: '145px', height: '37px', marginTop: '20px' }}
              disabled={forSale} onClick={() => this.setState({ sellMode: true })}>Sell
        artwork</Button> :
      <Button btnType={BTN_TYPE_GREEN} style={{ width: '145px', height: '37px', marginTop: '20px' }}
              disabled={!forSale} onClick={() => this.setState({ buyMode: true })}>Buy
        artwork</Button>;
    if (this.state.sellMode) {
      button = null;
      dialog = <React.Fragment>
        <Input type="number" name={'price'} label={'Set price'}
               containerStyle={{ width: '270px' }}
               style={{width: '270px', lineHeight: '20px'}}
               value={this.state.price} onChange={(e) => this.setState({ price: e.target.value })}
        />
        <Button btnType={BTN_TYPE_GREEN} style={{ width: '130px', height: '37px', marginTop: '5px', marginRight: '10px' }} onClick={() => console.log('Not implemented')}>Sell</Button>
        <Button btnType={BTN_TYPE_LIGHT_GREEN} style={{ width: '130px', height: '37px', marginTop: '5px' }}
        onClick={()=> this.setState({sellMode: false})}>Decline</Button>
      </React.Fragment>;
    }
    if (this.state.buyMode) {
      button = <div style={{display: 'flex'}}>
        <p className={style['buy-confirm']}>Do you really want to buy this artwork?</p>
        <Button btnType={BTN_TYPE_GREEN} style={{ width: '60px', height: '37px', marginTop: '20px', marginRight: '10px' }} onClick={() => console.log('Not implemented')}>Yes</Button>
        <Button btnType={BTN_TYPE_LIGHT_GREEN} style={{ width: '60px', height: '37px', marginTop: '20px' }}
        onClick={()=> this.setState({buyMode: false})}>No</Button>

      </div>
    }
    return <Wrapper>
      <Card>
        <div onClick={() => history.goBack()} className={style.backlink}>{'<<'} Back to gallery</div>

        <div className={style.artwork}>
          {isMy ? <div className={style['my-sticker']}>my</div> : null}
          {forSale ? <div className={style['sale-sticker']}>for sale</div> : null}
          <p className={style.txid}><span>TXID</span> {orderBlockTxid}</p>
          <img src={`file://${thumbnailPath}`} alt=""/>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <h3>{name}</h3>
              {forSale ? <span className={style.price}>
                {price} PSL
              </span> : null}
            </div>
            {button}
          </div>
          {dialog}
          <div style={{ marginTop: '20px' }}>
            {dataFieldNames.map((field, idx) => {
                if (data[field] === '' || !data[field]) {
                  return null;
                }
                return <div className={style.data} key={idx}>
                  <h5>{humanReadableFieldNames[field]}</h5>
                  <p>{data[field]}</p>
                  {idx !== dataFieldNames.length - 1 ? <div className={style.line}/> : null}
                </div>;
              }
            )}
          </div>

        </div>
      </Card>
    </Wrapper>;
  }
}

export default connect(
  state => ({
    artworksData: state.artworks.data,
    pastelId: state.pastelid.currentPastelID
  }))
(Detail);
