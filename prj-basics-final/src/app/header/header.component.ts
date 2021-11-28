import {Component, OnDestroy, OnInit} from '@angular/core';
import {DataStorageService} from '../shared/data-storage.service';
import {Subscription} from 'rxjs';
import {AuthService} from '../auth/auth.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit , OnDestroy {
  isLogged = false;
  subs = new Subscription();
  constructor(private dataStorage: DataStorageService,
              private authSer: AuthService) {
  }
  ngOnInit() {
    this.subs = this.authSer.user.subscribe(user => {
      this.isLogged = !!user;
    });
  }
  ngOnDestroy() {
    this.subs.unsubscribe();
  }
  onDelete() {
    this.authSer.onDelete();
  }
  onSaveData() {
    this.dataStorage.storeRecipe();
  }
  onFetchData() {
    this.dataStorage.getRecipe().subscribe();
  }
}
