import React from 'react';
import '../../styles.scss';

export const FlexRow = (props) => {
    return <div className="flex-row main-content">
        {props.children}
    </div>

};