import {Injectable } from '@angular/core';
import {Ingredient} from '../shared/ingredient.model';
import {Subject} from 'rxjs';
@Injectable({providedIn: 'root'})
export class ShoppingListService {
  ingChanges = new Subject<Ingredient[]>();
  itemToEdit = new Subject<number>();
  private ingredient: Ingredient[] = [
    new Ingredient('apple', 10),
    new Ingredient('bread', 4)
  ];

  getIngredient() {
    return this.ingredient.slice();
  }
  getIngredientOneItem(index: number) {
    return this.ingredient[index];
  }

  onAddIng(ing: Ingredient) {
    this.ingredient.push(ing);
    this.ingChanges.next(this.ingredient.slice());
  }

  onAdd(ing: Ingredient[]) {
    this.ingredient.push(...ing);
    this.ingChanges.next(this.ingredient.slice());
  }
  onUpdate(index: number , newIngredient: Ingredient) {
    this.ingredient[index] = newIngredient;
    this.ingChanges.next(this.ingredient.slice());
  }
  onDelete(index: number) {
    this.ingredient.splice(index , 1);
    this.ingChanges.next(this.ingredient.slice());
  }
}
