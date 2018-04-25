import { Injectable } from '@angular/core';

@Injectable()
export class DataService{
 /*es una propiedad que almacena los datos del usuario en el perfil,
  se utilizara para parasar el nombre del usuario y su id al componente que lo require 
  : ej: addMessage*/
   public dataUserProfile : any; 

   constructor(){
   }    

   setDataUserProfile(dataUser){
     sessionStorage.setItem('userProfileFollow', dataUser);
   }

   getDataUserProfile(){
     return sessionStorage.getItem('userProfileFollow');
   }

   clearDataUserProfile(){
       sessionStorage.removeItem('userProfileFollow');
   }
}