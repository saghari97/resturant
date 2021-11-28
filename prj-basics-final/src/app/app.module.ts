import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';


import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import { AppComponent } from './app.component';
import {DropdownDirective} from './shared/dropdown.directive';
import { HeaderComponent } from './header/header.component';
import { RecipesComponent } from './recipes/recipes.component';
import { RecipeListComponent } from './recipes/recipe-list/recipe-list.component';
import { RecipeDetailComponent } from './recipes/recipe-detail/recipe-detail.component';
import { RecipeItemComponent } from './recipes/recipe-list/recipe-item/recipe-item.component';
import { ShoppingListComponent } from './shopping-list/shopping-list.component';
import { ShoppingEditComponent } from './shopping-list/shopping-edit/shopping-edit.component';
import { RecipesStartComponent } from './recipes/recipes-start/recipes-start.component';
import { RecipeEditComponent } from './recipes/recipe-edit/recipe-edit.component';
import {RecipesResolverService} from './recipes/recipes-resolver.service';
import { AuthComponent } from './auth/auth.component';
import { SpinnerComponent } from './shared/spinner/spinner.component';
import {AuthInterceptorService} from './auth/auth-interceptor.service';
import {AuthGuardService} from './auth/auth-guard.service';
const routes: Routes = [
  {path: '' , redirectTo: '/recipes' , pathMatch: 'full'},
  {path: 'recipes' , component: RecipesComponent , canActivate: [AuthGuardService] , children: [
      {path: '' , component: RecipesStartComponent},
      {path: 'new' , component: RecipeEditComponent},
      {path: ':id' , component: RecipeDetailComponent , resolve: [RecipesResolverService]},
      {path: ':id/edit' , component: RecipeEditComponent , resolve: [RecipesResolverService]},
    ]},
  {path: 'shopping-list' , component: ShoppingListComponent},
  {path: 'auth' , component: AuthComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    RecipesComponent,
    RecipeListComponent,
    RecipeDetailComponent,
    RecipeItemComponent,
    ShoppingListComponent,
    ShoppingEditComponent,
    DropdownDirective,
    RecipesStartComponent,
    RecipeEditComponent,
    AuthComponent,
    SpinnerComponent
  ],
  imports: [
    RouterModule.forRoot(routes),
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [{provide: HTTP_INTERCEPTORS , useClass: AuthInterceptorService , multi: true}],
  bootstrap: [AppComponent]
})
export class AppModule { }
