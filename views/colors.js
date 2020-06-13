import React, { useState } from 'react'

const Colors = () => {
  const [colors, setColors] = useState([])
  return (
    <div class='container color-flex' id='main-container'>
      {colors.map(color => {
        return (
          <div key={color.id} class='color-form-contain'>
            <form class='color-edit-form'>
              <input type='hidden' value={color.id} name='colorId' />
              <input class='color-edit-input' name='color' type='text' value={color.color} />
              <input class='color-edit-input' name='colorCode' type='text' value={color.colorCode} />
              <button type='button' class='color-edit-submit' onClick={() => updateColor()}>Update</button>
              <button type='button' class='color-edit-delete' onClick={() => deleteColor()}>Delete</button>
            </form>
          </div>
        )
      })}
    </div>
  )
}

export default Colors
