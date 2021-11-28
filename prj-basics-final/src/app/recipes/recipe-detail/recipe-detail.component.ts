import {Component, OnInit} from '@angular/core';
import {Recipe} from '../recipe.model';
import {RecipesService} from '../recipes.service';
import {ActivatedRoute, Params, Router} from '@angular/router';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {
  recipe: Recipe;
  id: number;
  constructor(private recipeService: RecipesService ,
              private router: ActivatedRoute,
              private route: Router) { }
  ngOnInit() {
    this.router.params.subscribe(
      (params: Params) => {
        this.id = +params['id'];
        this.recipe = this.recipeService.getRecipe(this.id);
      }
    );
  }
  onMoveToSH() {
    this.recipeService.addToShop(this.recipe.ingredient);
  }
  onRecipeEdit() {
    this.route.navigate(['edit'] , {relativeTo: this.router});
    // this.route.navigate(['../' , this.id , 'edit'] , {relativeTo: this.router});
  }
  onDelete() {
    this.recipeService.onDelete(this.id);
    this.route.navigate(['/recipes']);
  }
}
