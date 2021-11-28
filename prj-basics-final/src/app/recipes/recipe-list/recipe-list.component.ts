import {Component, OnDestroy, OnInit, Output} from '@angular/core';

import { Recipe } from '../recipe.model';
import {RecipesService} from '../recipes.service';
import {ActivatedRoute, Router} from '@angular/router';
import {relative, relativeFrom} from '@angular/compiler-cli/src/ngtsc/file_system';
import {relativeToRootDirs} from '@angular/compiler-cli/src/transformers/util';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit , OnDestroy {
  recipes: Recipe[];
  sub = new Subscription();
  constructor(private recipeService: RecipesService,
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit() {
    this.sub = this.recipeService.isChanged.subscribe(
      (recipe: Recipe[]) => {
        this.recipes = recipe;
      }
    );
    this.recipes = this.recipeService.getRecipes();
  }
  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  onClicked() {
    this.router.navigate(['new'] , {relativeTo: this.route});
  }
}
