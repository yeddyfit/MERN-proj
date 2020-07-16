import React from 'react'
import './RecipeTile.css'
// import {Link} from 'react-router-dom'
import ViewRecipe from '../pages/ViewRecipe'

const RecipeTile = ({title, image, saveRecipe}) => {
  return (
    <div className='recipe'>
      <h3>{title}</h3>
      {/* <Link to="/View" */}
      <img className='image' src={image} alt=""/>
      <button onClick={saveRecipe}>Favourite/Save</button>
    </div>
  )
}


export default RecipeTile
