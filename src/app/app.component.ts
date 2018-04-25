
import { Component, OnInit, DoCheck } from '@angular/core';

import { userService } from './_services/user.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from './_models/user';
import { GLOBAL } from './_services/global';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers : [userService]
})
export class AppComponent implements OnInit, DoCheck{
  public title : string;
  public identity : User;
  public url : string;
  public status: string;

  constructor(
    private _userService : userService,
    private _router : Router,
    private _route : ActivatedRoute
  ){
    this.title = 'Red Social MEAN';
    this.url = GLOBAL.url;
  }

  ngOnInit() {
    console.log('componente Principal')

    //datos del usuario logueado para mostrar en el nav
    this.identity  = this._userService.getIdentity();

  }

  //si hay cambios en el componente, se refresca 
  ngDoCheck(){
    this.identity  = this._userService.getIdentity();
  }


  //metodo para cerrar sesion de usuario
  logout(){
    sessionStorage.clear();
    this.identity = null;
    this._router.navigate(['/login']);
  }

  
}
