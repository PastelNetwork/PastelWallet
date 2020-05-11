import React from 'react';


const Card = (props) => {
  let { children,  style={},...rest } = props;
  style = {...style, borderRadius: '6px', backgroundColor: 'var(--beige-bg)', padding: '17px 25px'};
  return <div {...rest} style={style}>{children}</div>;
};

export default Card;
