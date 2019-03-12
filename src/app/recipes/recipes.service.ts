import { Injectable } from '@angular/core';

import { Recipe } from './recipe.model';

@Injectable({
  providedIn: 'root'
})
export class RecipesService {
  private recipes: Recipe[] = [
    {
      id: 'r1',
      title: 'One Pan Dish',
      imageUrl:
        'https://img.jamieoliver.com/jamieoliver/recipe-database/xtra_med/64975476.jpg?tr=w-400',
      ingredients: ['black beans', 'chipolatas', 'onion', 'garlic', 'cherry tomatoes']
    },
    {
      id: 'r2',
      title: 'Spag Bol',
      imageUrl:
        'https://img.jamieoliver.com/jamieoliver/recipe-database/xtra_med/58419467.jpg?tr=w-400',
      ingredients: ['tomatos', 'mince meat', 'spaghetti', 'parmesan']
    }
  ];

  constructor() {}

  public getRecipes(): Recipe[] {
    return [...this.recipes];
  }

  public getRecipe(recipeId: string): Recipe {
    return this.recipes.find(recipe => {
      return recipe.id === recipeId;
    });
  }

  public deleteRecipe(recipeId: string) {
    this.recipes = this.recipes.filter(recipe => recipe.id !== recipeId);
  }
}
