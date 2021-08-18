import React from 'react';

export const Wrapper = ({children}) => {
    return (
        <div id="wrapper" className="w-100">
            {children}
        </div>
    );
}