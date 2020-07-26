// Logic for both searchbars: user recipes and spoonacular (finds recipes)

import React, { useState, useContext } from 'react';
import SearchBar from './SearchBar';
import UserContext from '../context/UserContext';
import axios from 'axios';
import RecipeTile from '../components/RecipeTile';
import { useHistory } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

const SearchController = () => {
  const [searchValue, setSearchValue] = useState('');
  const [currentRecipes, setCurrentRecipes] = useState([]);

  const { userData, setUserData } = useContext(UserContext);
  const history = useHistory();

  let userRecipes = userData.recipes;

  const getRecipes = async () => {
    try {
      const searchResults = await axios.get(
        `https://api.spoonacular.com/recipes/complexSearch?query=${searchValue}&apiKey=${process.env.REACT_APP_SPOONACULAR_API_KEY}&addRecipeInformation=true&fillIngredients=true`
      );
      setCurrentRecipes(searchResults.data.results);
      console.log('wallah hussy, shes loaded');
    } catch (err) {
      console.log(err);
      console.log('something wrong w/ spoonacular request');
    }
  };

  const saveRecipe = async (index) => {
    const data = {
      newRecipe: {
        name: currentRecipes[index].title,
        image: currentRecipes[index].image,
        recipeUrl: currentRecipes[index].sourceUrl,
        cuisines: currentRecipes[index].cuisines,
        sourceName: currentRecipes[index].sourceName,
        summary: currentRecipes[index].summary,
        preptime: currentRecipes[index].preparationMinutes,
        cookingTime: currentRecipes[index].cookingMinutes,
        totalCookingTime: currentRecipes[index].readyInMinutes,
        ingredients: parseIngredients(currentRecipes[index].missedIngredients),
        dishTypes: currentRecipes[index].dishTypes,
        diets: currentRecipes[index].diets,
        instructions: currentRecipes[index].analyzedInstructions,
        winePairing: currentRecipes[index].winePairing,
        // playlistRef: '7jDnWwQfQYZx2bkqdSlf3F',
        playlistRef: '',
        id: uuidv4(),
      },
      id: userData.user,
    };

    try {
      const newRecipes = await axios.put(
        `http://localhost:3000/users/recipes/add`,
        data,
        {
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': userData.token,
          },
        }
      );

      console.log('recipe has been added');
      await setUserData({
        token: userData.token,
        user: userData.user,
        recipes: newRecipes.data,
      });
      // this should ideally have a small popup that tells you it's been added/favorited
      history.push(`/recipes/${userRecipes.length}`);
    } catch (err) {
      console.log('somethings said no');
      console.log(err);
    }
  };

  const parseIngredients = (ingredients) => {
    let ingredientArray = [];
    ingredients.forEach((ingredient) => {
      ingredientArray.push({
        original: ingredient.original,
        ingredient: ingredient.originalName,
        ingredientAmount: `${ingredient.amount} ${ingredient.unitLong}`,
      });
    });
    return ingredientArray;
  };

  return (
    <div>
      <SearchBar
        searchValue={searchValue}
        onSearchValueChange={(newSearchValue) => {
          setSearchValue(newSearchValue);
        }}
        onEnter={getRecipes}
      />

      <RecipeTile saveRecipe={saveRecipe} recipes={currentRecipes} />
    </div>
  );
};

export default SearchController;
