
import { Component, OnInit } from '@angular/core';

//importacion necesaria para establecer parametros en rutas
import { Router, ActivatedRoute, Params } from '@angular/router'
import { User } from './../_models/user';

//servicio
import { userService } from './../_services/user.service';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  providers: [userService]
})
export class RegisterComponent implements OnInit {
 public title : string;
 public user : User;
 public status : string;
 public message : string;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService : userService
  ){ 
    this.title = 'Registrate';
    this.user  = new User(
      "","","","","","ROLE_USER",""
    );
  }

  ngOnInit() {
    console.log('componente register corriendo')
  }

  onsubmit(form){
    this._userService.register(this.user).subscribe(
      response =>{
        if(response.user && response.user._id){
          this.status = 'success';
          form.reset();
        }else{
          this.status = 'error';
          //this.message = response.message;
        }    
      },
      error =>{
        console.log(<any>error);
      }
    );
  }

}
