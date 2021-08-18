import React from 'react';

export const Page = ({title, children}) => {
    return (
        <div className="w-100">
            <h2>{title}</h2>
            {children}
        </div>
    );
}