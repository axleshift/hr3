import React from 'react'

const Portal = () => {
  const user = JSON.parse(sessionStorage.getItem('user'))

  return (
    <div>
      <h1>Welcome</h1>
    </div>
  )
}

export default Portal
