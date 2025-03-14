import React from 'react'

function CircleLogo() {
  return (
    <div className="logo">
      <img src="/circle.png" alt="TRBL Design Logo" style={{ width: '140px', height: '140px' }} />
    </div>
  )
}

// Remove the type import and use React.FC instead
export default CircleLogo as React.FC
