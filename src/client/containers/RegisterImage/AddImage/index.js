import React, { Component } from 'react';
import * as style from './style.module.scss';

const PlusIcon = () => {
  return <svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
    <circle cx="10" cy="10" r="10"/>
    <rect x="9" y="5" width="2" height="10" rx="1" fill="white"/>
    <rect x="9" y="5" width="2" height="10" rx="1" fill="white"/>
    <rect x="9" y="5" width="2" height="10" rx="1" fill="white"/>
    <rect x="5" y="11" width="2" height="10" rx="1" transform="rotate(-90 5 11)" fill="white"/>
    <rect x="5" y="11" width="2" height="10" rx="1" transform="rotate(-90 5 11)" fill="white"/>
    <rect x="5" y="11" width="2" height="10" rx="1" transform="rotate(-90 5 11)" fill="white"/>
  </svg>;
};

class AddImage extends Component {
  constructor (props) {
    super(props);
    this.state = {
      file: null,
      path: '',
      name: ''
    };
    this.fileInputRef = React.createRef();
  }

  onChange = (e) => {
    if (e.target.files.length) {
      let file = e.target.files[0];
      const base64File = URL.createObjectURL(file);
      this.setState({ file: base64File, path: file.path, name: file.name });
      if (this.props.onChange) {
        this.props.onChange(file.path, base64File);
      }
    }
  };

  render () {
    const {disabled = false} = this.props;
    return <div className={style.wrapper} style={this.props.style}>
      <label htmlFor="idArtFile">Art file</label>
      <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}>

        <div className={`${style.choose} ${disabled && style.disabled}`} onClick={() => !disabled && this.fileInputRef.current.click()}>
          <input type="file" accept="image/*" id="idArtFile"
                 onChange={this.onChange} ref={this.fileInputRef}
                 style={{ visibility: 'hidden', position: 'absolute' }}
                 disabled={disabled}
          />

          <PlusIcon/>
          Choose file
          <span style={{ color: `${this.state.name === '' ? 'var(--grey-3)' : 'var(--black)'}` }}>
            {this.state.name || 'no file chosen'}
          </span>
        </div>
        <div className={style.preview}>
          {this.state.file && <img src={this.state.file} alt="preview"/>}
        </div>
      </div>
    </div>;
  }
}

export default AddImage;
