import React from 'react';
import CategoryComponent from './CategoryComponent';

const TabViewComponent = ({ data }) => {
    return (
        <div>
            <CategoryComponent monAns={data.monAns} />
        </div>
    );
};

export default TabViewComponent;
