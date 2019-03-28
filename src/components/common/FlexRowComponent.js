import React from 'react';
import '../../artist.scss';

export const FlexRow = (props) => {
    return <div className="flex-row">
        {props.children}
    </div>

};