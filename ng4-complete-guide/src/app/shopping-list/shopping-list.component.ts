import { Component, OnInit } from '@angular/core';
import { Ingredient } from '../shared/ingredients.model';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit {
  ingredients : Ingredient[] = [
    new Ingredient("Apple",80),
    new Ingredient("Tomato",40)
  ]
  constructor() { }

  ngOnInit() {
  }
  onIngredientAdded(ingredient : Ingredient){
    this.ingredients.push(ingredient);
  }

}
