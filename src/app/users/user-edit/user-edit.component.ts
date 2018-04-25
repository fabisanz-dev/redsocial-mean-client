
import { Component, OnInit, ViewChild } from '@angular/core';

import { userService } from './../../_services/user.service';
import { User } from './../../_models/user';
import { UploadService } from './../../_services/upload.service';
import { GLOBAL } from '../../_services/global';


 
@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css'],
  providers : [userService, UploadService]
})
export class UserEditComponent implements OnInit {
  public title : string;
  public user : User;
  public identity : User;
  public status : string;
  public message : string;
  public url : string;
  public token : string;
  
  public fileExist : boolean;

  constructor(
    private _userService : userService,
    private _uploadService  :UploadService
  ) {
    this.title = 'Editar Datos del usuario';
    this.identity = _userService.getIdentity();
    this.user = _userService.getIdentity(); //captura los datos del storage para editarlos..

    this.url = GLOBAL.url;
    this.token = sessionStorage.getItem('tokenUser');

    this.fileExist = false;
  }

  ngOnInit() {
  }

  //actualizar datos de usuario
  onsubmit(){
    this._userService.updateUser(this.user).subscribe(
      response => {
        if(!response.user && response.message){
          this.status = 'error';
          this.message = response.message;
        }else{
          //se actualiza en session storage
          sessionStorage.setItem('identityUser', JSON.stringify(response.user));
          this.identity = this.user;
          this.status = 'success';

          
          //actualizar avatar
          if(this.fileExist){
            this._uploadService.makeFileRequest(this.url+'uploadProfile/'+this.user._id, [], this.fileUpload, this.token, 'image')
              .then((response : any)=>{
               // console.log( response)
                   if(response.message != null){
                     //console.log(response.message)
                     this.status = 'error';
                     this.message = `${response.message} en la imagen de perfil`;
                   }else{
                    //actualizar prop image del modelo del front de lo que devuelva el back
                    this.user.image = response.user.image;
                      //console.log(response.user.image)
                    sessionStorage.setItem('identityUser', JSON.stringify(this.user));
                   }
              })
              .catch(
                error =>{
                  console.log(error)
                }
              );
          }
          

          //resetear solamente la imagen previa
          this.deleteImgPreview();
          
        }
      },
      error =>{
        let err = <any>error;
        if(err){
          this.status  = 'error';
          this.message = err.message;
        }
      }
    )
  }

  
  //obtener los datos del archivo
  public fileUpload : Array<File> // prop para capturar los datos del archivo
  public imagePreview : string; // prop para ver imagen previa
  ChangeuploadFile(event : any){
    //seteamos los datos del archivo
    this.fileUpload = <Array<File>>event.target.files;

    this.fileExist = true;//compureba existencia de archivo

    //obtener la imagen previa
    if(event.target.files && event.target.files[0]) {
      var reader = new FileReader();
  
      reader.onload = (event:any) => {
        this.imagePreview = event.target.result;
      }
      
      reader.readAsDataURL(event.target.files[0]);
    }

    //this.deleteImgPreview(event);
  }

  //capturar el contenido de archivo del input en una propiedad
  @ViewChild('imgAvatar')
   inputFileAvatar: any;

   //metodo para resetear imagen previa
  deleteImgPreview(){
    this.imagePreview = '';
    this.inputFileAvatar.nativeElement.value = "";
    this.fileExist = false;
  }

}
