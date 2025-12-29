import React from 'react';

const Nutrients = ({ strain }) => {
    return (
        <div>
            <h1>Nutrients</h1>
            <p>{strain.nutrients}</p>
        </div>
    );
};

export default Nutrients;