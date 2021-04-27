import React from 'react'

const Filter = ({filter, handleFilter}) => {
    return (
        <p>
            filter search with: <input type='text' value={filter} onChange={handleFilter} />
        </p>
    )
}

export default Filter