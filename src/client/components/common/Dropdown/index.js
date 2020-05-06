import React, { Component } from 'react';
import * as style from './style.module.scss';

class CustomDropdown extends Component {
  constructor (props) {
    super(props);
    this.state = {
      opened: false,
      selected: null
    };
  }

  clickExpander = (e) => {
    this.setState({ opened: !this.state.opened });
  };

  componentDidMount () {
    document.addEventListener('mousedown', this.handleClickOutside);
  }

  componentWillUnmount () {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  setWrapperRef = (node) => {
    this.wrapperRef = node;
  };

  handleClickOutside = (event) => {
    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      this.setState({opened: false});
    }
  };

  render () {
    const { onChange, options, ...props } = this.props;

    const renderedOptions = options && options.map((option, idx) =>
      <span
        className={`${style.option} ${this.state.selected && this.state.selected.value === option.value ? style.selected : ''}`}
        data-value={option.value}
        onClick={() => {
          this.setState({ selected: option, opened: false });
          onChange(option);
        }}
        key={idx}
      >
        {option.label}</span>
    );
    return <div className={style.wrapper} ref={this.setWrapperRef}>
      <div className={`${style.select} ${this.state.opened ? style.open : ''}`}>
        <div className={style.expandable}>
          <div className={style['select-trigger']} onClick={this.clickExpander}>
            <span>{this.state.selected ? this.state.selected.label : this.props.placeholder}</span>
            <div className={`${style.expander} ${this.state.opened ? style.open : ''}`}/>
          </div>
          <div className={style.options}
               style={{ maxHeight: `${this.state.opened ? (options.length * 60 < 200 ? options.length * 60 : 200) : 0}px` }}>
            {renderedOptions}
          </div>
        </div>

      </div>
    </div>;

  }
}

export default CustomDropdown;
