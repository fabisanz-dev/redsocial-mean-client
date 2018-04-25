
import { Component, OnInit } from '@angular/core';

import { GLOBAL } from './../_services/global';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { PublicationService } from '../_services/publication.service';
import { userService } from '../_services/user.service';
import { Publications } from '../_models/publications';


@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.css'],
  providers: [PublicationService, userService]
})
export class TimelineComponent implements OnInit {
  public text : string;
  public token : string;
  public identity;
  public url;
  public page : number;
  public status : string;

  public preview_page : number;
  public next_page : number;
  public pages;
  public total;

  public publications :  Publications[]; //propiedad que sera un array o coleccion de objetos de la clase

  public btnViewMore: boolean; // para controlar el boton ver mas...

  public updateSidebarFollow: string;

  constructor(
    private _publicationService : PublicationService,
    private _userService  : userService,
    private _route : ActivatedRoute, //capturar parametros
    private _router : Router  //redireccion
  )
  { 
    this.text = 'Publicaciones';
    this.token = _userService.getToken();
    this.identity = _userService.getIdentity()._id;

    this.url = GLOBAL.url;
    this.btnViewMore = false;
    this.page = 1;

    this.publications = [];

  }

  ngOnInit() {
    this.getPublications(this.token, this.page);
  }

 public loadingPage : any;
  getPublications(token, page, viewMore = false){
    this._publicationService.getPublications(token, page).subscribe(
      result => {
       // console.log(result)
        if(result.publications.length == 0){
          this.status = 'error';
          this.publications = [];
        }else{
          this.loadingPage = 'false';
          this.total = result.total;
          this.pages = result.pages;
          this.updateSidebarFollow = 'addPublication'; 

          this.getLikesAllPublications(token);

              if(viewMore == false){
                this.publications = result.publications;
              }else{
                let arrayA = this.publications; //array que contiene las publicaciones actuales
                let arrayB = result.publications; // array que contiene las publicaciones siguientes

                //la prop. publications se actualizara con los array concatenados
                this.publications = arrayA.concat(arrayB);
                
                console.log(this.publications)
                /*se controla que la longitud del array de publicaciones sea igual al total
                para desactiar el boton vermas*/
                if(this.publications.length == this.total){
                  //se dejara de ver el boton
                  this.btnViewMore = true; //se oculta
                  this.loadingPage = 'true';
                }

                //animacion jquery que activa desplazamiento de scroll de arriba hacia abajo
                $('html, body').animate({ scrollTop : $('body').prop('scrollHeinght')}, 500);
              }

        }
      },
      error => {
        let err  = <any>error;
        if(err){
          this.status = 'error';
        }
      }
    )
  }

  //Obtener Likes en la publicacion
  public likesPublication;
  public likesUserPublication : Array<any>;
  getLikesAllPublications(token){
    this._publicationService.getLikesAllPublications(token).subscribe(
      (response)=>{
        //console.log(response.publicationLike)
        this.likesPublication = response.publicationLike; //datos del usuarios a los que le dieron like
        this.likesUserPublication = response.likesUser; //obtiene el id de la publicacion y del usuario
      },
      (error) => {
        let err = error;
        if(err){
          this.status = 'error';
        }
      }
    )
  }

  //LIKES - DESLIKE
  public publicationLikeOver;
  mouseEnter(publicationId){
    this.publicationLikeOver = publicationId;
  }
  mouseLeave(){
    this.publicationLikeOver = 0;
  }

  deslike(idPub){
    this._publicationService.deleteLikePublication(this.token, idPub).subscribe(
      response =>{
        /** FUNCIONES NO REAL TIME */
         //busca la posicion del
          let searchPublicationLike = this.likesUserPublication.indexOf(idPub);
          // busca el id del usuario aut. que le dio like
            let searchUserPublicationLike = this.likesPublication.find(element => {
              return element.user._id == this.identity;
            });
            let searchedUserPublicationLike = this.likesPublication.indexOf(searchPublicationLike);

            //si encuentra la publicacion
            if(searchPublicationLike != -1){
              this.likesUserPublication.splice(searchPublicationLike, 1); //quita el numero d de likes
              this.likesPublication.splice(searchedUserPublicationLike, 1); //quita el nombre de los likes
            }

            //---busca la publicacion con su id
            let updateItem = this.publications.find(element => {
              return element._id == idPub;
            });
              let index = this.publications.indexOf(updateItem);//obtiene la posicion del elemento buscado
              this.publications[index].likes = response.updatePub.likes;//actualiza la publicacion (prop: likes), con el valor likes del dato actualizado
      },
      error =>{
        let err = <any>error;
        if(err){
          this.status = 'error';
        }
      }
    )
  }

  addlikePublication(idPub){
    this._publicationService.addLikesPublication(this.token, idPub).subscribe(
      response =>{
          /** FUNCIONES NO REAL TIME */
          this.likesUserPublication.push(response.publicationLike._id);
          this.getPublications(this.token, this.page);

          //busqueda en array publications para obtener el item y actualizar solamente el total de likes
          let updateItem = this.publications.find(element => {
            return element._id == idPub;
         });
               //console.log(updateItem)
               let index = this.publications.indexOf(updateItem);
               
               //dentro de la publicacion encontrada, solo actualizamos la prop. likes;
               this.publications[index].likes = response.publicationLike.likes;     
      },
      error =>{
        let err = <any>error;
        if(err){
          this.status = 'error';
        }
      }
    )
  }
																
  /*
    metodo ver mas, que comprueba la cantidad de items cargados,
  */
  viewMore(){
    //si la long. del array publications es igual al total de items
   /* if(this.publications.length == this.total){
      //se dejara de ver el boton
      this.btnViewMore = true;
    }else{*/
      this.page +=1;
   // }
     
   this.btnViewMore = true;
    //llamamos al metodo de obtener publicaciones para cargar la siguiente pagina
    setTimeout(() => {
      //this.loading = false;
      this.btnViewMore = false; //mostrar loading
      this.getPublications(this.token, this.page, true);
    }, 400);
    
  }


  refreshPublication(event: any = true){
    //console.log(event)
    //if(event.send == 'true'){
      //reset
      this.page = 1;
      this.btnViewMore = false;
      //volver  llamar getPublication
      this.getPublications(this.token, this.page);      
   // }    
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
          //console.log(result.message)
          this.updateSidebarFollow = 'delPublication';
          //eliminar del arreglo
          //console.log(idPub)
          //Para eliminacion reactiva en el front
          for (let index = 0; index < this.publications.length; index++) {
            let publication = this.publications[index]._id;

            if(publication == idPub){
             // console.log(publication)
                 // this.btnDeleteConf = true;
                  /*se filtra la indice del arreglo que coincide con la publicacion buscada
                    luego se elimina el elemento de la lista de forma reactiva
                  */
                  $("#"+idPub).fadeOut(1000, ()=>{
                       this.publications.splice(index, 1);
                       this.refreshPublication();
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

  

}
