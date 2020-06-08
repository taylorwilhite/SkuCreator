import React from 'react'

const Login = () => {
  return (
    <div className='container'>
      <h1>Login Using Skuvault login</h1>
      <form action='/login' method='POST'>
        <input type='text' name='username' placeholder='Username' />
        <input type='password' name='password' placeholder='Password' />
        <input type='submit' name='' />
      </form>
    </div>
  )
}

export default Login
