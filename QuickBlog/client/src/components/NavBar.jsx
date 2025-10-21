import React from 'react'
import {assets} from '../assets'
const NavBar = () => {
  return (
    <div className='flex justify-between items-center py-5 mx-8 sm:mx-20 xl:mx-32 cursor-pointer'>
      <img src={assets.logo} alt="logo" className='w-28 h-28 object-contain'/>
      <button></button>
      
    </div>
  )
}

export default NavBar