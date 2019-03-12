import { Component, OnInit } from '@angular/core';
import { RecipesService } from '../recipes.service';
import { Recipe } from '../recipe.model';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.page.html',
  styleUrls: ['./recipe-detail.page.scss']
})
export class RecipeDetailPage implements OnInit {
  recipe: Recipe;

  constructor(private recipesService: RecipesService) {}

  ngOnInit() {
    this.recipe = this.recipesService.getRecipe(1);
    console.log('Recipe: ', this.recipe);
  }
}
