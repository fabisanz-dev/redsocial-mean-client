import { Message } from './../../_models/message';
import { Component, OnInit, DoCheck } from '@angular/core';
import { FormControl } from '@angular/forms';

import { userService } from '../../_services/user.service';
import { FollowService } from '../../_services/follow.service';

import { GLOBAL } from './../../_services/global';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from './../../_models/user';
import { Follow } from '../../_models/follow';



@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
  providers: [userService, FollowService]
})
export class UsersComponent implements OnInit {
  public title: string;
  public identity;
  public token;
  public status  :string;
  public url : string;
  public following; //ids usuarios que sigo
  public followUserOver; //para controlar boton de seguimiento (siguiendo/dejar de seguir)

  public page; //pasado por parametro
  public preview_page;
  public next_page;
  public total; //total de items
  public users; //datos de usuarios
  public pages; //paginas con items en total

  public loading : boolean; //para controlar el loading

  public follow : Follow;

  public searchKey;
  public search: FormControl = new FormControl();
  public searched : any[] = [];
  public textSearchPlaceholder : string;
  public notFoudSearched : string;

  public updateSidebarFollow : string; //para actualizar el sidebar pro comunicacion input

  constructor(
    private _route : ActivatedRoute,
    private _router : Router,
    private _userService : userService, 
    private _followService : FollowService
  ){
    this.title = "Componente Gentes";
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;

    this.loading = true;

    this.searchKey = '';

    //this.inputSearch = 
   }

  ngOnInit() {

    console.log('componente usuarios corriendo')
    this.page = 1;
    this.textSearchPlaceholder = 'Buscar por nombre de usuario...';


    this.search.valueChanges.subscribe(
      searchKey => {
        //console.log(searchKey)
        if(!searchKey){
          console.log('Ingrese texto');
          this.textSearchPlaceholder = 'Buscar por nombre de usuario...';
          this.searched = [];
          this.notFoudSearched = '';
        }else{
          this._userService.searchUsers(this.token, searchKey).subscribe(
            response =>{
              if(response.users.length <= 0){
                this.status = 'error';
                this.notFoudSearched = 'No se encuentra el usuario solicitado...';
                this.searched = [];
              }else{
               // console.log(response)
                this.notFoudSearched = '';
                this.searched = response.users;
              }
            },
            error =>{
              let err = <any>error;
              if(err){
                this.status = 'error';
              }
            });

        }
        
      });

    setTimeout(() => {
      this.loading = false;
      this.ActualPage();
      
    }, 1000);

   
    
  }



   ActualPage(){
     this._route.params.subscribe(
       params =>{
          var page = +params['page']; //paso a entero el parametro page

          this.page = page;

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

          //llamar al metodo de usuarios paginados
          /*setTimeout(() => {
            this.loading = false;*/
            this.getUsers(this.page);
            
         // }, 2000);
          
       });
   }

   getUsers(page){
    return this._userService.getUsers(page).subscribe(
      response =>{
        if(!response && !response.users){
          this.status = 'error';
        }else{
          this.status = 'success';
          this.pages = response.pages;
          //si la paginacion por url es mayor que al cantidad de paginas que existen
          if(page > this.pages){
            //redireccionar a la primera pagina
            this._router.navigate(['users']);
          }
          this.total = response.total;
          this.users = response.users;
          this.following = response.users_following; //ids de usuarios que sigo
         

          //console.log(response);
        }

      },
      error =>{
        let err = <any>error;
        console.log(err);
        if(err != null){
          this.status = 'error';
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
        if (!result && !result.followed) {
          this.status  ='error';
        }else{
          this.updateSidebarFollow = 'addFollowing'; //prop. para actualizar el sidebar
          //agrego el id del nuevo usuario al que seguira en el array following
          this.following.push(result.followed);
          this.ActualPage();

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
        console.log(err);
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
        console.log(result)
        if(result.message == null){
          this.status = 'error';
        }else{
          this.updateSidebarFollow = 'delFollowing';//prop. para actualizar el sidebar
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
        console.log(err);
          if(err != null){
            this.status = 'error';
          } 
      }
    )
   }

   //search users
   seachUsers(){
    this._userService.searchUsers(this.token, this.searchKey).subscribe(
      response =>{
        if(!response){
          this.status = 'error';
        }else{
          console.log(response.users)
          this.searched = response.users;

          console.log(this.searched);
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

    /*metodo para guardar en storage stadisticas de usuario:
   cant. de seguidos, seguidores, publicaciones*/
   stadistUser(){
      this._userService.getCountFollowsPub().subscribe(
        result =>{
          if(!result){
            this.status = 'error'
          }else{
            sessionStorage.setItem('statUser', JSON.stringify(result.value));
            this._userService.getStats();
          }
        },
        error =>{
          let err = <any>error;
          if(error){
            this.status = 'error';
          }
        });

      }
   

}
