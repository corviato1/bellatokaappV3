import React from 'react';

const StrainCard = ({ strain }) => {
    return (
        <div>
            <h2>{strain.name}</h2>
            <p>{strain.description}</p>
        </div>
    );
};

export default StrainCard;