import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {FormArray, FormControl, FormGroup, Validators} from '@angular/forms';
import {RecipesService} from '../recipes.service';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit {
  id: number;
  editMode = false;
  formInit: FormGroup;

  constructor(private router: ActivatedRoute,
              private recipeService: RecipesService,
              private route: Router) {
  }

  ngOnInit() {
    this.router.params.subscribe(
      (params: Params) => {
        this.id = +params['id'];
        this.editMode = params['id'] != null;
        this.formInitial();
      }
    );
  }

  onSubmit() {
    if (this.editMode) {
      this.recipeService.onUpdateRecipe(this.id , this.formInit.value);
    } else {
      this.recipeService.onAddRecipe(this.formInit.value);
    }
    this.onCancel();
  }

  private formInitial() {
    let recipeName = '';
    let recipeImg = '';
    let recipeDescription = '';
    const recipeIngredient = new FormArray([]);
    if (this.editMode) {
      const recipe = this.recipeService.getRecipe(this.id);
      recipeName = recipe.name;
      recipeImg = recipe.imagePath;
      recipeDescription = recipe.description;
      if (recipe['ingredient']) {
        for (const ingredient of recipe.ingredient) {
          recipeIngredient.push(
            new FormGroup({
              'name': new FormControl(ingredient.name , Validators.required),
              'amount': new FormControl(ingredient.amount , [
                Validators.required , Validators.pattern(/^[1-9]+[0-9]*$/)])
            })
          );
        }
      }
    }
    this.formInit = new FormGroup({
      'name': new FormControl(recipeName , Validators.required),
      'imgPath': new FormControl(recipeImg , Validators.required),
      'description': new FormControl(recipeDescription , Validators.required),
      'ingredients' : recipeIngredient,
    });
  }
  get controls() {
    return (<FormArray>this.formInit.get('ingredients')).controls;
  }
  onAddIngredient() {
    (<FormArray>this.formInit.get('ingredients')).push(
      new FormGroup({
        'name': new FormControl(null , Validators.required),
        'amount': new FormControl(null ,
          [Validators.required , Validators.pattern(/^[1-9]+[0-9]*$/)])
      })
    );
  }
  onCancel () {
    this.route.navigate(['../'] , {relativeTo: this.router} );
  }
  onDeleteIng(index: number) {
    (<FormArray>this.formInit.get('ingredients')).removeAt(index);
  }
}
