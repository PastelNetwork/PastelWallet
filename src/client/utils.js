import React from 'react';

export const getRenderedErrors = (errors) => {
    let result = [];
    errors.forEach((errorText, index) => {
        result.push(
            <div className="has-text-danger" key={index}>
                {errorText}
            </div>
        );
    });
    return result;
};
