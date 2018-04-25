
import { Message } from './../_models/message';
import { Component, OnInit } from '@angular/core';

import { userService } from '../_services/user.service';
import { FollowService } from '../_services/follow.service';

import { GLOBAL } from './../_services/global';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from '../_models/user';
import { Follow } from '../_models/follow';

@Component({
  selector: 'app-followed',
  templateUrl: './followed.component.html',
  styleUrls: ['./followed.component.css'],
  providers: [userService, FollowService]
})
export class FollowedComponent implements OnInit {

  public title: string;
  public identity;
  public token;
  public status  :string;
  public url : string;
 

  public page; //pasado por parametro
  public userSearchId; //pasado por parametro
  public userSearchDate; //datos del usuario buscado
  public preview_page;
  public next_page;
  public viewBtnNext : boolean; //para habilitar el boton si se ven las primeras paginas

  public total; //total de items
  public users; //datos de usuarios
  public pages; //paginas con items en total

  public follow : Follow;
  public followedContent : Follow []; //propiedad que contiene el objeto de follow
  public following; //ids usuarios que sigue el usuario autenticado
  public followUserOver; //para controlar boton de seguimiento (siguiendo/dejar de seguir)

  public updateSidebarFollow: string;

  constructor(
    private _route : ActivatedRoute,
    private _router : Router,
    private _userService : userService, 
    private _followService : FollowService
  ) { 
    this.title = "Usuarios que le siguen a:";
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;

    this.followedContent = [];
  }

  ngOnInit() {
    console.log('componente siguiendome corriendo')
    this.page = 1;
    this.ActualPage();
  }

  ActualPage(){
    this._route.params.subscribe(
      params =>{
         var page = +params['page']; //paso a entero el parametro page
         var userId = params['id'];

         this.page = page;
         this.userSearchId = userId;

         //que el parametro: page sea por defecto 1
         if(this.page == null || !params['page']){
           this.page = 1;

           this.preview_page = this.page-1;
           this.next_page = this.page+1;
         }else{
           this.preview_page = this.page-1;
           this.next_page = this.page+1;

           //que el minimo de la pagina ant. sea 1
           if(this.preview_page <= 0){
             this.preview_page = 1;
           }
         }

         //llamar al metodo de listado de usuarios que le siguen 
         this.getFollowed(this.userSearchId, this.page);

         //obtener datos del usuario
         this.getUser(this.userSearchId);
      });
  }

  getFollowed(idUser, page){
    this._followService.followedUserList(idUser, page).subscribe(
      response =>{
        if(!response){
          this.status = 'error';
        }else{
          //console.log(response)
          this.followedContent = response.following;
          this.total = response.total;
          this.pages = response.pages;

          //console.log(this.followedContent)

          this.following = response.users_following; //usuarios que sigue el autenticado  
        }
       // console.log(response)
      },
      error => {
        let err = <any>error;
        if(err){
          this.status = 'error';
          console.log(err)
        }
      }
    )
  }

   //eventos para hover en boton siguiendo dejar de seguir
  mouseEnter(userId){
    this.followUserOver = userId;
 }
 mouseLeave(userId){
    this.followUserOver = 0;
 }

 //seguir usuario
 addFollow(idUserFollow){

  this.follow = new Follow(this.identity._id, idUserFollow);

  this._followService.addFollow(this.follow).subscribe(
    result =>{
      if (!result && !result.follow.followed) {
        this.status  ='error';
      }else{
        //console.log('result'+ result.follow.followed)
        //agrego el id del nuevo usuario al que seguira en el array following
        this.following.push(result.follow.followed);
        this.ActualPage();
        this.updateSidebarFollow = "addFollowing";

        let searchFollowing = this.following.indexOf(idUserFollow);
        if(searchFollowing != -1){
          //eliminar el id del usuario seguido encontrada en el array following
          this.following.splice(searchFollowing, 1)
        }else{
          this.status = 'error';
        }  
      }
    },
    error =>{
      let err = <any>error;

        if(err != null){
          this.status = 'error';
        } 
    }
  )
 }

 //dejar de seguir al usuario
 deleteFollow(idUserFollowing){

  this._followService.deleteFollow(idUserFollowing).subscribe(
    result =>{

      if(result.message == null){
        this.status = 'error';
      }else{
        this.updateSidebarFollow = "delFollowing";
        //condicion para validar la posicion del id del usuario seguido
        let searchFollowing = this.following.indexOf(idUserFollowing);
        if(searchFollowing != -1){
          //eliminar el id del usuario seguido encontrada en el array following
          this.following.splice(searchFollowing, 1)
        }else{
          this.status = 'error';
        }  
      }
    },
    error =>{
      let err = <any>error;

        if(err != null){
          this.status = 'error';
        } 
    }
  )
 }


 //obtener datos del usuario para agregar : lista de usuarios seguidos de: xxxxx
 getUser(idUser){
  this._userService.getUser(idUser).subscribe(
    response =>{
      if(!response){
        this.status = 'error';
      }else{
        this.userSearchDate = response.user;
       // console.log(this.userSearchDate)
      }
    },
    error =>{
      let err = <any>error;
      if(err){
        this.status = 'error';
      }
    }
  )
 }

}
