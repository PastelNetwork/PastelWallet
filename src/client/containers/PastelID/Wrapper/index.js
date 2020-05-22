import React from 'react';
import * as style from './style.module.scss';


const Wrapper = (props) => {
  return <div className={style.main}>
      <div className={style.wrapper}>
        {props.children}
      </div>
  </div>;
};

export default Wrapper;
