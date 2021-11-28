import {Component, OnDestroy, OnInit} from '@angular/core';

import { Ingredient } from '../shared/ingredient.model';
import {ShoppingListService} from './shoppingList.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit , OnDestroy {
  Ingredient: Ingredient[];
  private igChanged: Subscription;
  constructor(private slService: ShoppingListService) { }

  ngOnInit() {
    this.Ingredient = this.slService.getIngredient();
    this.igChanged = this.slService.ingChanges
      .subscribe(
        (ing: Ingredient[]) => {
          this.Ingredient = ing;
        }
      );
  }
  ngOnDestroy() {
    this.igChanged.unsubscribe();
  }
  onEdited(i: number) {
    this.slService.itemToEdit.next(i);
  }
}
