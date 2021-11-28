import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {RecipesService} from '../recipes/recipes.service';
import {Recipe} from '../recipes/recipe.model';
import {map, tap, take, exhaustMap} from 'rxjs/operators';
import {AuthService} from '../auth/auth.service';

@Injectable({providedIn: 'root'})
export class DataStorageService {
  constructor(private http: HttpClient,
              private recipeService: RecipesService,
              private authSer: AuthService) {
  }

  storeRecipe() {
    const recipes = this.recipeService.getRecipes();
    this.http.put('https://recipe-book-finall-default-rtdb.firebaseio.com/recipes.json', recipes)
      .subscribe(response => {
        console.log(response);
      });
  }

  getRecipe() {
      return this.http.get<Recipe[]>('https://recipe-book-finall-default-rtdb.firebaseio.com/recipes.json')
        .pipe(map(recipes => {
            return recipes.map(recipe => {
              return {...recipe, ingredient: recipe.ingredient ? recipe.ingredient : []};
            });
          })
          , tap(response => {
            this.recipeService.setRecipe(response);
          }));
  }
}
