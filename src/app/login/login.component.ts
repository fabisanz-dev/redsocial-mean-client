import { Message } from './../_models/message';


import { getTestBed } from '@angular/core/testing';
import { Component, OnInit } from '@angular/core';

import { Router, ActivatedRoute, Params } from '@angular/router'
import { User } from './../_models/user';

import { userService } from './../_services/user.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers : [userService]
})
export class LoginComponent implements OnInit {
  public title: string;
  public user : User;
  public status : string;
  public token;

  constructor(
    private _userService : userService,
    private _router: Router,
    private _route:ActivatedRoute 
  ) { 
    this.title = 'Login';
    this.user  = new User(
      "","","","","","ROLE_USER",""
    );
  }

  ngOnInit() {
    console.log('componente de login corriendo..')
  }

  //loguearse
  public messageError : any;
  onsubmit(){
    this._userService.loginUser(this.user).subscribe(
      response =>{
        if(response.user || response.user._id){
          this.status = 'success';

          //PERSISTENCIA DE DATOS...
          sessionStorage.setItem('identityUser', JSON.stringify(response.user));
        
          //CONSEGUIR EL TOKEN
          this.getToken();

        }
        if(response.message){
            this.status = 'error';
            this.messageError = response.message.message;
            console.log('fghfg'+response.message.message)
        }
      },
        error => {
          var err = <any>error;
          if(err != null){
            this.status = 'error';
            this.messageError = error.error.message;
          }
      }
    );
  }

  getToken(){
    this._userService.loginUser(this.user, 'true').subscribe(
      response =>{
        this.token = response.createToken;
        if(this.token.length <= 0){
          this.status = 'error';
        }else{
          //PERSISTENCIA DE token...
          sessionStorage.setItem('tokenUser', this.token);

          this.status = 'success';

           //CONSEGUIR ESTADISTICAS DEL USUARIO
           this.stadistUser();
        }
      },
      error => {
          var err = <any>error;
          if(err != null){
            this.status = 'error';
            this.messageError = error;
          }
      }
    )
  }

  /*metodo para guardar en storage stadisticas de usuario:
   cant. de seguidos, seguidores, publicaciones*/
   stadistUser(){
    this._userService.getCountFollowsPub().subscribe(
      result =>{
        if(!result){
          this.status = 'error'
        }else{
          //console.log(result.value)
          //carga de estadistica del usuario
          sessionStorage.setItem('statUser', JSON.stringify(result.value));

          //redireccionar al home
          this._router.navigate(['/']);
        }
      },
      error =>{
        let err = <any>error;
        if(error){
          this.status = 'error';
        }
      }
    )
  }

}
