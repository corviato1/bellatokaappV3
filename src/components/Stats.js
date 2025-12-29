import React from 'react';

const Stats = ({ strain }) => {
    return (
        <div>
            <h1>Stats</h1>
            <p>{strain.stats}</p>
        </div>
    );
};

export default Stats;