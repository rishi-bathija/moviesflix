import React from 'react'
import loading from './loading-gif.gif'
const Spinner = () => {
    return (
        <div className="text-center flex justify-center items-center">
            <img className="my-3 w-[50px] h-[50px] md:w-[75px] md:h-[75px]" src={loading} alt="loading" />
        </div>
    )
}

export default Spinner