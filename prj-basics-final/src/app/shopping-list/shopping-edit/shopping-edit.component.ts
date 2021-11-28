import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Ingredient} from '../../shared/ingredient.model';
import {ShoppingListService} from '../shoppingList.service';
import {NgForm} from '@angular/forms';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit , OnDestroy {
  editedItemIndex: number;
  editMode = false;
  subcription: Subscription;
  editedItem: Ingredient;
  // @ViewChild('InputName' , {static: false}) inputname: ElementRef;
  // @ViewChild('InputAmount' , {static: false}) inputamount: ElementRef;
  @ViewChild ('f' , {static: false}) formC: NgForm;
  constructor(private slService: ShoppingListService) { }

  ngOnInit() {
    this.subcription = this.slService.itemToEdit.subscribe(
      (id: number) => {
        this.editedItemIndex = id;
        this.editMode = true;
        this.editedItem = this.slService.getIngredientOneItem(id);
        this.formC.setValue({
          name: this.editedItem.name,
          amount: this.editedItem.amount
        });
      }
    );
  }
  ngOnDestroy() {
    this.subcription.unsubscribe();
  }

  onAddItem(form: NgForm) {
    // const inName = this.inputname.nativeElement.value;
    // const inAmount = this.inputamount.nativeElement.value;
    const value = form.value;
    const newIng = new Ingredient(value.name , value.amount);
    if (this.editMode) {
      this.slService.onUpdate(this.editedItemIndex , newIng);
    } else {
      this.slService.onAddIng(newIng);
    }
    this.editMode = false;
    form.reset();
  }
  onClear() {
    this.formC.reset();
    this.editMode = false;
  }
  onDelete() {
    this.onClear();
    this.slService.onDelete(this.editedItemIndex);
  }
}
