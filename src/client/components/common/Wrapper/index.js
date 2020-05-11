import React from 'react';

const Wrapper = (props) => {
  const style = {
    overflow: 'scroll',
    marginLeft: 'var(--menu-width)',
    width: 'calc(100vw - var(--menu-width))',
    padding: '30px 20px 0 20px'
  };

  return <div style={style}>{props.children}</div>;
};

export default Wrapper;
