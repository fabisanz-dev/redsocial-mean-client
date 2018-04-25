import { Component, OnInit } from '@angular/core';

import { userService } from '../../../../_services/user.service';
import { MessageService } from './../../../../_services/message.service';

import { Message } from './../../../../_models/message';

import { GLOBAL } from './../../../../_services/global';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-sended',
  templateUrl: './sended.component.html',
  styleUrls: ['./sended.component.css'],
  providers : [userService, MessageService]
})
export class SendedComponent implements OnInit {
  public url;
  public token;
  public status : string;
  
  public page;
  public total : number;
  public pages;
  public preview_page : number;
  public next_page : number;

  public btnView : number; //control de boton siguiente, anterior..

  public message : Message[]; //para guardar los array de message

  constructor(
    private _route : ActivatedRoute,
    private _router : Router,
    private _userService : userService, 
    private _messageService : MessageService
  ) { 
    this.url = GLOBAL.url;
    this.token = this._userService.getToken();
    this.btnView = 0;

    this.message = [];
   }

  ngOnInit() {
    console.log('componente mensajes enviados - modulo mensajes, corriendo...');

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

         this.sendedMessageList(this.token, this.page);

      });
  }

  sendedMessageList(token, page){
    this._messageService.messageSendedList(token, page).subscribe(
      response => {
        //console.log(response)
        if(!response){
          this.status = 'error';
        }else{
            if(response.messages.length == 0){
              this.btnView = 0;
            }else{
              this.btnView = 1;
            }
          
          this.message = response.messages;
          this.total = response.total;
          this.pages = response.pages;
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
