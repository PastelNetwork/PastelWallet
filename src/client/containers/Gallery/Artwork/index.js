import React, { Component } from 'react';
import * as style from './style.module.scss';
import { Button, Input } from '../../../components/common';
import { connect } from 'react-redux';
import { BTN_TYPE_GREEN, BTN_TYPE_LIGHT_GREEN } from '../../../components/common/constants';
import history from '../../../history';

class Artwork extends Component {
  constructor (props) {
    super(props);
    this.state = {
      buyMode: false,
      sellMode: false,
      price: 0
    };
  }

  onBuyClick = () => {
    this.setState({ buyMode: true });
  };
  onConfirmBuyClick = () => {
    //ipcRenderer.send('buyArtwork', {hash: this.props.data.imageHash});
    console.log('Not implemented');
  };
  onConfirmSellClick = () => {
    //ipcRenderer.send('sellArtwork', {hash: this.props.data.imageHash});
    console.log('Not implemented');
  };

  render () {
    const { artistPastelId, name, numOfCopies, thumbnailPath, imageHash } = this.props.data;
    const { forSale, price } = this.props.data.saleData;

    let bottomBlock = <React.Fragment>
      <Button style={{ width: '145px', marginLeft: '16px', marginTop: '7px' }}
              onClick={() => history.push(`/gallery/${imageHash}`)}>More details</Button>

      {forSale && artistPastelId !== this.props.pastelID ?
        <div style={{
          display: 'flex', paddingLeft: '16px', paddingTop: '3px', justifyContent: 'space-between',
          paddingRight: '14px'
        }}>
            <span className={style.price}
                  style={{ color: 'var(--success)', fontSize: '16px', lineHeight: '37px' }}>{price} PSL</span>
          <Button btnType={BTN_TYPE_GREEN} style={{ width: '72px' }} onClick={this.onBuyClick}>Buy</Button>
        </div> : null}
      {artistPastelId === this.props.pastelID ?
        <Button btnType={BTN_TYPE_GREEN} style={{ width: '145px', marginLeft: '16px', marginTop: '3px' }}
                onClick={() => this.setState({ sellMode: true })} disabled={forSale}>Sell artwork copy</Button> : null
      }
    </React.Fragment>;

    if (this.state.buyMode) {
      bottomBlock = <React.Fragment>
        <p style={{ marginTop: '9px', fontSize: '14px', color: 'var(--black)' }}><i>Do you really want to buy this
          artwork?</i></p>
        <Button btnType={BTN_TYPE_GREEN} style={{ width: '145px', marginLeft: '16px', marginTop: '7px' }}
                onClick={this.onConfirmBuyClick}>Yes</Button>
        <Button btnType={BTN_TYPE_LIGHT_GREEN} style={{ width: '145px', marginLeft: '16px', marginTop: '3px' }}
                onClick={() => this.setState({ buyMode: false })}>No</Button>
      </React.Fragment>;
    }
    if (this.state.sellMode) {
      bottomBlock = <React.Fragment>
        <Input type="number" name={'price'} label={'Set price'}
               containerStyle={{ marginLeft: '16px' }}
               style={{width: '145px', lineHeight: '20px'}}
               value={this.state.price} onChange={(e) => this.setState({ price: e.target.value })}
        />
        <Button btnType={BTN_TYPE_GREEN} style={{ width: '145px', marginLeft: '16px', marginTop: '7px' }}
                onClick={this.onConfirmSellClick}>Ok</Button>
        <Button btnType={BTN_TYPE_LIGHT_GREEN} style={{ width: '145px', marginLeft: '16px', marginTop: '3px' }}
                onClick={() => this.setState({ sellMode: false })}>Decline</Button>
      </React.Fragment>;
    }
    return <div className={style.artwork} style={this.state.buyMode || this.state.sellMode ? { height: '381px' } : {}}>
      {artistPastelId === this.props.pastelID ?
        <div className={style['my-sticker']}>my</div> : null}
      {forSale ?
        <div className={style['sale-sticker']}>for sale</div> : null}

      <img src={`file://${thumbnailPath}`} alt=""/>
      <h4>{name}</h4>
      <div className={style['col-container']}
           style={this.state.buyMode || this.state.sellMode ? { height: '194px' } : {}}>
        <p><b>Total</b> {numOfCopies} copies</p>
        <p><b>Pastel ID</b> {artistPastelId.substr(0, 10)}</p>
        {bottomBlock}
      </div>
    </div>;
  }
}

export default connect(state => (
  { pastelID: state.others.currentPastelID }
))(Artwork);
