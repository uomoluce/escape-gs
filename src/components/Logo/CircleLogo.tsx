import React from 'react'
import { CustomComponent } from 'payload/types'

function CircleLogo() {
  return (
    <div className="logo">
      <img src="/circle.png" alt="TRBL Design Logo" style={{ width: '140px', height: '140px' }} />
    </div>
  )
}

// Add the type assertion at the export level
export default CircleLogo as CustomComponent
