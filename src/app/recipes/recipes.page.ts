import { Component, OnInit } from '@angular/core';
import { Recipe } from './recipe.model';

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.page.html',
  styleUrls: ['./recipes.page.scss']
})
export class RecipesPage implements OnInit {
  recipes: Recipe[];

  constructor() {}

  ngOnInit() {
    this.recipes = [
      {
        id: '1',
        title: "Jamie's One Pan Bastard",
        imageUrl:
          'https://img.jamieoliver.com/jamieoliver/recipe-database/xtra_med/64975476.jpg?tr=w-400',
        ingredients: [
          'black beans',
          'chipolatas',
          'onion',
          'garlic',
          'cherry tomatoes'
        ]
      },
      {
        id: '2',
        title: 'Spag Bol',
        imageUrl:
          'https://img.jamieoliver.com/jamieoliver/recipe-database/xtra_med/58419467.jpg?tr=w-400',
        ingredients: ['tomatos', 'mince meat', 'spaghetti', 'parmesan']
      }
    ];
  }
}
