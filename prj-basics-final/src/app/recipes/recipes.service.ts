import {Injectable } from '@angular/core';
import {Recipe} from './recipe.model';
import {Ingredient} from '../shared/ingredient.model';
import {ShoppingListService} from '../shopping-list/shoppingList.service';
import {Subject} from 'rxjs';

@Injectable({providedIn: 'root'})
export class RecipesService {
  isChanged = new Subject<Recipe[]>();
  constructor(private slservice: ShoppingListService) {
  }
  // private recipes: Recipe[] = [
  //   new Recipe('A Test Recipe',
  //     'This is simply a test',
  //     'https://upload.wikimedia.org/wikipedia/commons/1/15/Recipe_logo.jpeg' ,
  //     [new Ingredient('meat' , 2),
  //          new Ingredient('bread', 2)]),
  //   new Recipe('A Test Recipe2',
  //     'This is simply a test',
  //     'https://upload.wikimedia.org/wikipedia/commons/1/15/Recipe_logo.jpeg' ,
  //     [new Ingredient('spagetti' , 20),
  //       new Ingredient('tomato', 4)])
  // ];
  private recipes: Recipe[] = [];
  getRecipes () {
    return this.recipes.slice();
  }
  addToShop(ingredient: Ingredient[]) {
    this.slservice.onAdd(ingredient);
  }
  getRecipe (index: number) {
    return this.recipes[index];
  }
  setRecipe (recipe: Recipe[]) {
    this.recipes = recipe;
    this.isChanged.next(this.recipes.slice());
  }
  onAddRecipe (recipe: Recipe) {
    this.recipes.push(recipe);
    this.isChanged.next(this.recipes.slice());
  }
  onUpdateRecipe(index: number , recipe: Recipe) {
    this.recipes[index] = recipe;
    this.isChanged.next(this.recipes.slice());
  }
  onDelete(index: number) {
    this.recipes.splice(index , 1);
    this.isChanged.next(this.recipes.slice());
  }
}

