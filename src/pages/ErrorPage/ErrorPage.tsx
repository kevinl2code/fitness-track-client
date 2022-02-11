import React from 'react'

const errorImage = `${process.env.PUBLIC_URL}/oops.svg`
export const ErrorPage: React.FC = () => {
  return (
    <div>
      <img
        src={errorImage}
        alt="People being active"
        style={{ width: '50%', height: 'auto' }}
      />
    </div>
  )
}
