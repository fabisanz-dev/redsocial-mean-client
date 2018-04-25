
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';


import { GLOBAL } from './global';
import { Message } from './../_models/message';

@Injectable()
export class MessageService{
    public url : string;

    constructor(
        private _http : HttpClient
    ){
        this.url = GLOBAL.url;
    }

    //guardar mensaje
    sendMessage(token, message: Message):Observable<any>{
        let params = JSON.stringify(message);
        let headers = new HttpHeaders().set('Content-Type', 'application/json')
                                       .set('Authorization', token);

        return this._http.post(this.url+'message', params, {headers: headers});
    }

    //listado pagina de mensajes recibidos
    messageReceivedList(token, page = 1):Observable<any>{
        let headers = new HttpHeaders().set('Content-Type', 'application/json')
                                        .set('Authorization', token);

       return this._http.get(this.url+'messages-received/'+page, {headers : headers});
    }

    messageSendedList(token, page = 1):Observable<any>{
        let headers = new HttpHeaders().set('Content-Type', 'application/json')
                                       .set('Authorization', token);
        return this._http.get(this.url + 'message-emitter/'+page, {headers : headers});
    }

}