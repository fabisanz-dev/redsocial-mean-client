import { Injectable } from "@angular/core";
import { GLOBAL } from "./global";


 @Injectable()
 export class UploadService{
   public url : string;
   constructor(){
       this.url = GLOBAL.url;
   }

   makeFileRequest(url: string, params:Array<string>, files:Array<File>, token:string, name: string){
      return new Promise((resolve, reject)=>{
        var formData : any = new FormData;
        var xhr  = new XMLHttpRequest;

        //recorremos el arrary files, y en formdata se almacena: image, datos de archivo, nombre de archivp
        for (let index = 0; index < files.length; index++) {
            formData.append(name, files[index], files[index].name);
        }

        //estado de respuesta
        xhr.onreadystatechange  = function(){
            //prop. XHR client - 4: DONE, The operation is complete.
            if(xhr.readyState == 4){
                if(xhr.status == 200){
                    resolve(JSON.parse(xhr.response))
                }else{
                    reject(xhr.response);
                }
            }
        }

        xhr.open('POST', url, true); //peticion con su url y async
        xhr.setRequestHeader('Authorization', token); // seteo de cabecera
        xhr.send(formData); // envio de archivo
      });
    
      
   }

 }