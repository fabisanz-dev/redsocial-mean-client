import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';


import { GLOBAL } from './global';
import { Follow } from '../_models/follow';

import { userService } from './user.service';


@Injectable()
export class FollowService{
    public url : string;
    public token : string;
    constructor(
        private _http: HttpClient,
        private userService : userService
    ){
        this.url = GLOBAL.url;
    }


    //seguir usuario
    addFollow(follow : Follow):Observable<any>{
        let params = JSON.stringify(follow);
        let headers = new HttpHeaders().set('Content-Type', 'application/json')
                                       .set('Authorization', this.userService.getToken());

        return this._http.post(this.url+'follow', params, {headers : headers});
    }

    //dejar de seguir usuario
    deleteFollow(idFollow):Observable<any>{
        let headers = new HttpHeaders().set('Content-Type', 'application/json')
                                       .set('Authorization', this.userService.getToken());

        return this._http.delete(this.url+'delete-follow/'+idFollow, {headers : headers});
    }

    //Listado de usuarios que sigue
    followingUserList(idUser, page):Observable<any>{
        let headers = new HttpHeaders().set('Content-Type', 'application/json')
                                       .set('Authorization', this.userService.getToken());

        return this._http.get(this.url+'following/'+idUser+'/'+page, {headers: headers});
    }

    //Listado de usuarios que siguen al usuario buscado o autenticado
    followedUserList(idUser, page):Observable<any>{
        let headers = new HttpHeaders().set('Content-Type', 'application/json')
                                       .set('Authorization', this.userService.getToken());

        return this._http.get(this.url+'followed/'+idUser+'/'+page, { headers : headers});
    }

    //obtener usuarios seguidores sin paginar
    getMyFollows(token):Observable<any>{
        let headers = new HttpHeaders().set('Content-Type', 'application/json')
                                        .set('Authorization', token);

        return this._http.get(this.url+'getMyFollows', {headers: headers});
    }

}