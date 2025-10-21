import React from 'react'

const Login = () => {
  return (
    <div className='flex justify-center items-center h-screen w-screen '>
      <div className='border-2 rounded-xl border-emerald-600 p-20'>
        <form action="" className='flex flex-col items-center justify-center'>
          <input className='text-black outline-none bg-transparent placeholder:text-grey-400 border-2 border-emerald-600 rounded-full py-5 px-6' type="email" placeholder='Enter Your Email' />
          <input className='text-black outline-none bg-transparent placeholder:text-grey-400 border-2 border-emerald-600 rounded-full py-5 px-6' type="password" placeholder='Enter Your password' />
          <button className='text-white border-none outline-none  placeholder:text-white border-2 bg-emerald-600 rounded-full py-5 px-6'>Login</button>
        </form> 
      </div>
    </div>
  )
}

export default Login