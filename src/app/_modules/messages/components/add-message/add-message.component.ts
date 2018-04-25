
import { Component, OnInit} from '@angular/core';

import { userService } from '../../../../_services/user.service';
import { MessageService } from './../../../../_services/message.service';
import { FollowService } from './../../../../_services/follow.service';

import { Follow } from './../../../../_models/follow';
//import { User } from './../../../../_models/user';
import { Message } from './../../../../_models/message';

import { GLOBAL } from './../../../../_services/global';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormControl } from '@angular/forms';
import { DataService } from './../../../../_services/data.service';


@Component({
  selector: 'app-add-message',
  templateUrl: './add-message.component.html',
  styleUrls: ['./add-message.component.css'],
  providers: [userService, FollowService, MessageService, DataService]
})
export class AddMessageComponent implements OnInit {
  public title: string;
  public identity;
  public token;
  public status  :string;
  public url : string;

  public message : Message;
  public followUser : any[];; //para obtener usuarios seguidores a los que envia mensaje

  public search: FormControl; //para busqueda de usuarios que sigue
  public term: string; //para controlar el texto ingresado;
  public textSearchPlaceholder : string;
  public searched : any[];

  public fullNameMessage : string; //para guardar el nombre del mensaje enviado

  get data():any {
    return this._dataService.dataUserProfile;
  }

  constructor(
    private _route : ActivatedRoute,
    private _router : Router,
    private _userService : userService, 
    private _followService : FollowService,
    private _dataService : DataService,
    private _messageService : MessageService
  ) { 
    this.url = GLOBAL.url;
    this.identity = this._userService.getIdentity()._id;
    this.token = this._userService.getToken();

    this.message = new Message(this.identity,'','','','');

    this.search = new FormControl();
    this.textSearchPlaceholder = 'Buscar por nombre del usuario al que sigues...';
    //this.searched =

    this.followUser = []; //guarda los usuarios seguidores

    
  }

  ngOnInit() {
    console.log('componente agregar mensaje corriendo...')
    this.searched = [];
    //const usersFollow = this.getUserFollow(this.token);

    this.sendMessageFromUserProfile();

  }

  //obtener usuario seguidor para enviar mensaje
  getUserFollow(token){
    this._followService.getMyFollows(token).subscribe(
      response =>{
        if(!response){
          this.status = 'error';
          //console.log(response);
        }else{
          //console.log(response);
          this.followUser = response.follows;
        }
      },
      error =>{
        let err = error;
        if(err){
          this.status = 'error';
        }
      }
    )
  }

  receiverSearch(){
    //llamamos al metodo para obtener los usuarios seguidores
    this.getUserFollow(this.token);
   
    this.status = '';//seteamos el estado ya que este muestra el nombre del anterior usuario al que se le envio
    
    //console.log(this.followUser)
    this.search.valueChanges.subscribe(
      searchField => {
        if(searchField == ''){ 
          this.message.receiver = '';//si el input esta vacio, seteamos a vacio el destinatario, ya que el evento click lo setea
        }else{
          //filtra nombre y apellido del usuario que sigue 
          let ou2 = this.followUser.filter(x => (x.followed.name + x.followed.surname).toLowerCase().includes(searchField.toLowerCase()));
          this.searched = ou2; 

          //console.log(this.searched)
        }
             
      });
      //resetear la busqueda
      if(this.term == ""){
        this.searched = [];
      }

      console.log(this.term)
  }

  //capturar el usuario remitente
  userReceived(userReceived, event){
    console.log(event.target.textContent)
    console.log(userReceived)

    this.term = event.target.textContent;

    this.fullNameMessage = event.target.textContent; //para em el nombre del destinatario en el alert

    this.message.receiver = userReceived; //seteamos el id del destinatario
  }

  //enviar mensaje
  onsubmit(form){
    this._messageService.sendMessage(this.token, this.message).subscribe(
      response => {
        if(!response){
          this.status = 'error';
        }else{
         // console.log(response.message);
          this.status = 'success';
          form.reset();
          this.term = "";
          this.searched = [];
          this.followUser = [];
        }
      },
      error =>{
        let err = error;
        if(err){
          this.status = 'error';
        }
      }
    )
  }


  //Capturar parametro desde el perfil del usuario para enviar mensaje privado
  public userReceiverProfile : any;
  public idUserReceiverProfile : any;

  sendMessageFromUserProfile(){
    this._route.params.subscribe(
      param => {
        if(param == undefined){
          this.idUserReceiverProfile = '';
          this.userReceiverProfile = '';
          this._dataService.clearDataUserProfile(); //limipiar datos del usuario (mensaje desde perfil)
        }else{
          //console.log('param' + param['user'])
          this.idUserReceiverProfile = param['user'];
          this.message.receiver =  param['user']; //seteamos el id del destinatario
          this.fullNameMessage = this._dataService.getDataUserProfile(); //para em el nombre del destinatario en el alert

          this.userReceiverProfile = this._dataService.getDataUserProfile();
        } 
      }
    )
  }



}
