import React from 'react'
const Register = () => {
  return (
    <div className='container'>
      <h1>Register (Using Skuvault login)</h1>

      <form action='/register' method='POST'>
        <input type='text' name='username' placeholder='Username' />
        <input type='password' name='password' placeholder='Password' />
        <input type='submit' name='' />
      </form>
    </div>
  )
}

export default Register
