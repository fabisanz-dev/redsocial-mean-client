
import { Component, OnInit } from '@angular/core';

import { userService } from '../../_services/user.service';
import { PublicationService } from './../../_services/publication.service';
import { FollowService } from './../../_services/follow.service';
import { GLOBAL } from './../../_services/global';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from './../../_models/user';
import { Publications } from '../../_models/publications';
import { Follow } from './../../_models/follow';
import { DataService } from './../../_services/data.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
  providers: [userService, PublicationService, FollowService, DataService]
})
export class UserProfileComponent implements OnInit {
   public user : User;
   public token : string;
   public status : string;
   public url : string;
   public stadiscUser; //estadiscticas de usuario
   public identity;

   public page: number;
   public publications: Publications[];
   public pages : number;
   public total : number;
   public param;

   public btnViewMore : boolean; //para boton ver mas

   public btnDeleteConf : boolean; //para el modal de eliminacion de registro

   public following: string; //para verificar si el usuario aut. sigue al buscado
   public followed: boolean; //para verificar si el usuario buscado le sigue al aut.
   
   public loadingPage : any; //para animacion loading

   public updateSidebarFollow : string;

  constructor(
    private _userService: userService,
    private _publicationService: PublicationService,
    private _followService : FollowService,
    private _dataService : DataService,
    private _router : Router,
    private _route: ActivatedRoute
  ) { 
    this.url = GLOBAL.url;
    this.token = _userService.getToken();

    this.page = 1;
    this.btnViewMore = true;

    this.identity = this._userService.getIdentity()._id;

    this.loadingPage = 1;
  }

  ngOnInit() {
    //this.loadingPage = 'true';
    //llamamos a la funcion para obtener el parametro del usuario
    setTimeout(() => {
      this.loadParams();
    }, 500);
    
    //this.following = false;
  }

  //CARGAR PARAMETRO ID DEL USUARIO
  loadParams(){
    this._route.params.subscribe( param =>{
        this.param = param['id'];

       //se obtienen los datos del usuario por su id
       this.getUserProfile(param['id']);

       //se obtienen las publicaciones del usuario por su id
       this.getPublicationUser(this.param, this.page, this.token);

    });
  }

 

  //OBTENER LAS DATOS DEL PERFIL DEL USUARIO
  getUserProfile(idUser){
    this._userService.getUser(idUser).subscribe(
      result => {

        if(result && result.user){
        // console.log(result)
         this.loadingPage = 0;
         //datos del usuario para desplegar sus datos
          this.user = result.user;

          //datos del seguimiento
          if(result.following == null){
            this.following = 'false';
          }else{
            this.following = 'true';
          }

          if(result.followed == null){
            this.followed = false;
          }else{
            this.followed = true;
          }
          //llamar a funcion para obtener estadisticas de usuario
          this.UserStadict(this.user._id);

        }else{
          this.status = 'error';
        }
      },
      error =>{
        let err = <any>error;
          if(err){
            this.status = 'error';
          }
      });
  }


  //obtener publicaciones de usuario por perfil
  getPublicationUser(userId, page, token, viewMore = false){
    this._publicationService.getPublicationUser(userId, page, token).subscribe(
      result => {
        if(!result && !result.publicationUser){
          this.status = 'error';
        }else{
          //console.log(result)
          this.pages = result.pages;
          this.total = result.total;

          

          if(this.total <= 4){ //que haya mas de 4 items para ver el boton: ver mas..
              this.btnViewMore = false;
            }

          if(viewMore == false){
            this.publications = result.publications;
          }else{
            let arrayA = this.publications; //las primeras publicaciones
            let arrayB = result.publications; //siguientes publicaciones

            this.publications = arrayA.concat(arrayB);

          }

        }
      },
      error =>{
        let err = <any>error;
        if(err){
          this.status = 'error';
          console.log(err)
        }
      }
    )
  }

  //funcion ver mas
  viewMore(){
    //si la long. del array publications es igual al total de items
    this.page +=1;
    if(this.pages = this.page){
      //se dejara de ver el boton
      this.btnViewMore = false;
    }

    //llamamos al metodo de obtener publicaciones para cargar la siguiente pagina
    this.getPublicationUser(this.param, this.page, this.token, true);
  }

  //evento activa por el componente sidebar(cuando sebe una publicacion)
  refreshPublicationUserProfile(event = null){
    //if(event.send == 'true' || event == null){
      //volver  llamar getPublication
      this.page = 1;
      this.btnViewMore = true;
      //metodo de obtener publicaciones para cargar la siguiente pagina && estadisticas
     this.getPublicationUser(this.param, this.page, this.token, false);
     this.updateStatUser();
     this.updateSidebarFollow = 'addPublication';//refrescar estaden componente al que se comunica
    //}
  }


  //metodos para mostrar/ocultar imagen de publicaciones
  public showImage;
  showImagePub(idPub){
    this.showImage = idPub;
  }
  hideImagePub(){
    this.showImage = 0;
  }

  //Eliminar publicacion especificada
  deleteThisPublication(idPub){
    this._publicationService.deletePublication(idPub, this.token).subscribe(
      result => {
        if(result.message){
         // console.log(result.message)

         this.updateSidebarFollow = 'delPublication';//refrescar estaden componente al que se comunica
         this.updateStatUser();//stadisticas del usuario en el componente

          //Para eliminacion reactiva en el front
          for (let index = 0; index < this.publications.length; index++) {
            let publication = this.publications[index]._id;

            if(publication == idPub){
                  this.btnDeleteConf = true;
                  
                  /*se filtra la indice del arreglo que coincide con la publicacion buscada
                    luego se elimina el elemento de la lista de forma reactiva
                  */
                  $("#"+idPub).fadeOut(1000, ()=>{
                       this.publications.splice(index, 1);
                  });
              
            }
          }
          
        }
      },
      error => {
        let err = <any>error;
        if(err){
          this.status = 'error';
        }
      }
    )
  }

  //METODOS PARA LAS FUNCIONES DE AGREGAR/QUITAR SEGUIMIENTO DE USUARIO
  public follow : Follow;
  addFollow(userId){
    let userAuth = this.identity;
    this.follow = new Follow(userAuth, userId);
    this._followService.addFollow(this.follow).subscribe(   
      result =>{
        if(result.follow){
          this.updateSidebarFollow = 'addFollowing'; //para enviar al sidebar y actualizar datos stats.
          this.following = 'true'; //le sigo
        }else{
          this.status = 'error';
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

  deleteFollow(userId){
    this._followService.deleteFollow(userId).subscribe(
      result =>{
        if(result || result.message == 'Seguimiento eliminado'){
          this.following = 'false'; //ya no le sigo
          this.updateSidebarFollow = 'delFollowing';

          this.updateStatUser();//actualizar datos del usuario
        }else{
          this.status = 'error';
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

  public followUserOver; //para guardar el id del usuario y despues compararlo
  mouseEnter(userId){
    this.followUserOver = userId;
  }

  mouseLeave(){
    this.followUserOver = 0;
  }


  //Metodo para enviar los datos del usuario utilizando el servicio para comunicarse
  sendMessageUser(){
    let user = `${this.user.name} ${this.user.surname}`;
    this._dataService.setDataUserProfile(user);
  }


  //Estadistica de usuario: usuarios que sigue, seguidos, publicaciones
  UserStadict(idUser){
    this._userService.getCountFollowsPub(idUser).subscribe(
      result =>{
        if(!result){
          this.status = 'error';
        }else{
          this.stadiscUser = result.value;
        }
      },
      error =>{
        let err = <any>error;
        if(err){
          this.status = 'error';
        }
      })
  }



   //actualizo sessionstorage para los datos de estadistica del usuario
   updateStatUser(){
    this._userService.getCountFollowsPub().subscribe(
      result =>{
        if(!result){
          this.status = 'error'
        }else{
          sessionStorage.setItem('statUser', JSON.stringify(result.value));
          this.stadiscUser = this._userService.getStats();

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
