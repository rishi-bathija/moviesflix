import React from 'react'
import Body from './components/Body'
import { Provider } from 'react-redux'
import appStore from './utils/appStore'
import './components/loginStyle.css'
import { Toaster } from 'react-hot-toast'

const App = () => {



  return (
    <div className='scroll'>
      {/* <div className='text-3xl font-bold text-red-500 flex justify-center items-center h-screen border-solid'>Today we will make Moviesflix GPT</div> */}

      <Provider store={appStore}>
        <Body />
        <Toaster />
      </Provider>
    </div>
  )
}

export default App
