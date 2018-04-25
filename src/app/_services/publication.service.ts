import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';


import { GLOBAL } from './global';
import { Follow } from '../_models/follow';
import { Publications } from '../_models/publications';

@Injectable()
export class PublicationService{
    public url : string;

    constructor(
        private _http : HttpClient
    ){
        this.url = GLOBAL.url;
    }

//obtener todas las publicaciones de usuarios que sigo, recibe un token y un parametro (1 por defecto)
    getPublications(token, page = 1):Observable<any>{
        let headers = new HttpHeaders().set('Content-Type', 'application/json')
                                        .set('Authorization', token);

        return this._http.get(this.url+'getPublications/'+page, {headers : headers});
    }

    //guardar nueva publicacion del usuario autenticado
    savePublication(publication: Publications, token):Observable<any>{
        let params = JSON.stringify(publication);
        let headers = new HttpHeaders().set('Content-Type', 'application/json')
                                       .set('Authorization', token);

        return this._http.post(this.url + 'savePublication', params, {headers: headers});
    }

    //obtener publicacion por usuario especificado
    getPublicationUser(userId = null, page = 1, token):Observable<any>{
        let headers = new HttpHeaders().set('Content-Type', 'application/json')
                                       .set('Authorization', token);

        if(userId != null){
            return this._http.get(this.url+'getPublicationUser/'+userId+'/'+page, {headers: headers});
        }else{
            return this._http.get(this.url+'getPublicationUser/'+page, {headers: headers});
        }
       
    }

    //Eliminar publicacion
    deletePublication(idPub, token):Observable<any>{
        let headers = new HttpHeaders().set('Content-type', 'application/json')
                                        .set('Authorization', token);
        return this._http.delete(this.url+'deletePublication/'+idPub, {headers : headers});
    }

    //agregar like en la publicacion
    addLikesPublication(token, publicationId):Observable<any>{
        let headers = new HttpHeaders().set('Content-Type', 'application/json')
        .set('Authorization', token);

        return this._http.get(this.url+'addLikePublication/'+publicationId, {headers: headers});
    }

    getLikesAllPublications(token):Observable<any>{
        let headers = new HttpHeaders().set('Content-Type', 'application/json')
                                       .set('Authorization', token);

        return this._http.get(this.url+'getLikesAllPublications', {headers: headers});
    }

    getLikesThisPublication(token, publicationId):Observable<any>{
        let headers = new HttpHeaders().set('Content-Type', 'application/json')
                                       .set('Authorization', token);

        return this._http.get(this.url+'getLikesPublication/'+publicationId, {headers: headers});
    }

    deleteLikePublication(token, publicationId):Observable<any>{
        let headers = new HttpHeaders().set('Content-Type', 'application/json')
                                       .set('Authorization', token);

        return this._http.delete(this.url+'deslikePublication/'+publicationId, {headers : headers});
    }


}//class