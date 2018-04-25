import { Component, OnInit } from '@angular/core';

import { userService } from '../../../../_services/user.service';
import { MessageService } from './../../../../_services/message.service';

import { Message } from './../../../../_models/message';

import { GLOBAL } from './../../../../_services/global';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-received',
  templateUrl: './received.component.html',
  styleUrls: ['./received.component.css'],
  providers : [userService, MessageService]
})
export class ReceivedComponent implements OnInit {
  public url;
  public token;
  public status : string;
  
  public page : number;
  public total : number;
  public pages: number;
  public preview_page : number;
  public next_page : number;

  public btnView : boolean; //para controlar vista del boton siguiente, ant

  public message : Message[]; //para guardar los array de message

  constructor(
    private _route : ActivatedRoute,
    private _router : Router,
    private _userService : userService, 
    private _messageService : MessageService
  ) {
    this.url = GLOBAL.url;
    this.token = this._userService.getToken();
    this.btnView = false; 

    this.message = [];
   }

  ngOnInit() {
    console.log('componente mensajaes recibidos - modulo mensajes, corriendo...');
   
    //this.page = 1;
    this.ActualPage();
  }


  ActualPage(){
    this._route.params.subscribe(
      params =>{
         var page = +params['page']; //paso a entero el parametro page

         this.page = page;

         //que el parametro: page sea por defecto 1
         if(this.page == null || !params['page']){
           this.page = 1;

         }else{
           this.preview_page = this.page-1;
           this.next_page = this.page+1;

           //que el minimo de la pagina ant. sea 1
           if(this.preview_page <= 0){
             this.preview_page = 1;
           }
         }

         this.receivedMessageList(this.token, this.page);

      });
  }


  receivedMessageList(token, page){
    this._messageService.messageReceivedList(token, page).subscribe(
      response =>{
        if(!response){
          this.status = 'error';
        }else{
            if(response.messages.length == 0){
              this.btnView = false;
            }else{
              this.btnView = true;
            }
          this.total = response.total;
          this.pages = response.pages;

          console.log(this.message)
          this.message = response.messages;
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
