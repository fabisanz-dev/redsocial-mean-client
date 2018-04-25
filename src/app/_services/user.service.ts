import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { User } from '../_models/user';
import { GLOBAL } from './global';

@Injectable()
export class userService{
    public url : string;
    public identity : User;//dato de usuario
    public token : string; //token
    public stats; //estadiscticas

    constructor(public _http: HttpClient){
        this.url = GLOBAL.url;
    }

    register(user : User) : Observable<any>{
        let params = JSON.stringify(user);
        let headers = new HttpHeaders().set('Content-Type', 'application/json'); //se indica para que la api lo pricese a json

        return this._http.post(this.url + 'registerUser', params , {headers : headers});
    }

    loginUser(user: User, gettoken = null):Observable<any>{
        if(gettoken != null){
            user.gettoken = gettoken;
        }

        let params = JSON.stringify(user);
        let headers = new HttpHeaders().set('Content-Type', 'application/json');

        return this._http.post(this.url + 'login', params, {headers : headers});
    }


    //obtener identidad del usuario
    getIdentity(){
        let identity = JSON.parse(sessionStorage.getItem('identityUser'));
        if(identity != null){
            this.identity = identity;
        }else{
            this.identity  = null;
        }
        return this.identity;
    }

    //obtener token
    getToken(){
        let token = sessionStorage.getItem('tokenUser');
        if(token != null){
            this.token = token;
        }else{
            this.token = null;
        }
        return this.token;
    }

    //obtener estadistica de usuario logeado

    //actualizar datos de usuario
    updateUser(user:User):Observable<any>{
      let userId = user._id;
      let token = this.getToken();

      let params = JSON.stringify(user);
      let headers = new HttpHeaders().set('Content-Type', 'application/json')
                                     .set('Authorization', this.getToken());

      return this._http.put(this.url+'updateUser/'+userId, params, {headers: headers});
    }

    //obtener todos los usuarios paginados
    getUsers(page):Observable<any>{
        let headers = new HttpHeaders().set('Content-Type', 'application/json')
                                       .set('Authorization', this.getToken());

        return this._http.get(this.url+'getUsers/'+page, {headers: headers});
    }

    //obtener datos de un usuario (autenticado o buscado por su id)
    getUser(idUser):Observable<any>{
        let headers = new HttpHeaders().set('Content-Type', 'application/json')
                                       .set('Authorization', this.getToken());

        return this._http.get(this.url+'showUser/'+idUser, {headers: headers});
    }

    //Estadistica de usuario: cantidad de seguidores, seguidos y publicaciones
    getCountFollowsPub(idUser = null):Observable<any>{
        let headers = new HttpHeaders().set('Content-Type', 'application/json')
                                        .set('Authorization', this.getToken());

        if(idUser == null){
            return this._http.get(this.url+'countFollows', {headers : headers}); 
        }else{
            return this._http.get(this.url+'countFollows/'+idUser, {headers : headers}); 
        }
       
    }

    //obtener estadistica del usuario logueado desde el storage
    getStats(){
        let stats = JSON.parse(sessionStorage.getItem('statUser'));
        if(stats != null){
            this.stats = stats;
        }else{
            this.stats = null;
        }
        return this.stats;
    }

    //Buscar Usuarios
    searchUsers(token, search):Observable<any>{
        let headers = new HttpHeaders().set('Content-Type', 'application/json')
                                      .set('Authorization', token);   
        return this._http.get(this.url+'getUsersSearch/'+search, {headers : headers});
    }

    
    
}