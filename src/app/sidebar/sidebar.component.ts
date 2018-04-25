

import { Component, OnInit, EventEmitter, OnChanges, SimpleChanges, Output, Input, ViewChild  } from '@angular/core';

import { userService } from '../_services/user.service';
import { PublicationService } from './../_services/publication.service';
import { UploadService } from './../_services/upload.service';
import { User } from './../_models/user';
import { Publications } from './../_models/publications';
import { GLOBAL } from './../_services/global';

import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  providers: [userService, PublicationService, UploadService]
})
export class SidebarComponent implements OnInit {
  public title : string;
  public identity : User; //mostrar los datos del usuario autenticado en perfil
  public token : string;
  public stats : string; //mostrar estadisticas
  public url : string;
  public publication : Publications; //del modelo para two data biding
  public status: string;

  public fileExist : boolean; //existencia de archivo


  constructor(
    private _userService : userService,
    private _publicationService : PublicationService,
    private _uploadService : UploadService,
    private _route : ActivatedRoute, //capturar parametros
    private _router : Router  //redireccion
  ) { 
    this.title = 'Componente Sidebar';
    this.identity = _userService.getIdentity();
    this.token = _userService.getToken();
    this.stats = _userService.getStats();

    this.url = GLOBAL.url;
    this.fileExist = false;

    this.publication = new Publications(this.identity._id, '','','', 0);
  }

  ngOnInit() {
  
  }

  @Input() updateSidebar: any;
  ngOnChanges(changes: SimpleChanges){
    for (let propName in changes) {
      let change = changes[propName];
      //console.log(change);
      if(change.isFirstChange()) {
        //console.log(`first change: ${propName}`);
      } else {
        //console.log(`prev: ${change.previousValue}, cur: ${change.currentValue}`);
        //si detecta un cambio en el valor la propiedad input: 
        let current_updateSidebar = ['addFollowing','delFollowing', 'addPublication', 'delPublication'];
        for (let index = 0; index < current_updateSidebar.length; index++) {
          if(change.currentValue == current_updateSidebar[index]){
            this.updateStatUser();
          } 
        }
        
      }
    }
  }

  //actualizo sessionstorage para los datos de estadistica del usuario
  updateStatUser(){
    this._userService.getCountFollowsPub().subscribe(
      result =>{
        if(!result){
          this.status = 'error'
        }else{
          sessionStorage.setItem('statUser', JSON.stringify(result.value));
          this.stats = this._userService.getStats();
        }
      },
      error =>{
        let err = <any>error;
        if(error){
          this.status = 'error';
        }
      });
  }
  
  onsubmit(form){
      if(this.publication != null){
        this._publicationService.savePublication(this.publication, this.token).subscribe(
          result => {
            if(!result.publication){
              this.status = 'error';
            }else{
              //Envio del archivo exixstente
              if(this.fileExist){
                this._uploadService.makeFileRequest(this.url+'uploadFilePublication/'+result.publication._id, [], this.fileUpload, this.token, 'image')
                    .then( (result : any) =>{
                      //se actualizo prop en el back y ahora en el front
                      this.publication.file = result.publication.file;
                        console.log(this.publication.file)
                      form.reset();
                      //this._router.navigate(['/publications']);
                      this.status = 'true';
                      this.sendPublication.emit({ send: 'true'});

                       this.updateStatUser();
                      //this.updateSidebar = 'addPublication';
                      this.deleteImgPreview();
                    });
              }else{
                this.status = 'true';
                //this.publication.file = result.publication.file;
                form.reset();
                //this._router.navigate(['/publications']);

                this.sendPublication.emit({ send: 'true'});
                //this.updateSidebar = 'addPublication';
                this.updateStatUser();
                this.deleteImgPreview();
                /*setTimeout(() => {
                  $('#alert-publication-success').fadeOut('slow');
                }, 1000);*/
              }
            }
            
          },
          error =>{
            let err = <any>error;
            if(err){
              this.status = 'error';
            }
          }
        )

        form.reset();
      }
  }

  //Subir un archivo en la publicacion
  public fileUpload: Array<File>;
  uploadFilePubli(event){
    this.fileUpload = <Array<File>>event.target.files;
    this.fileExist = true;
  }

  //emitir evento output
  @Output() sendPublication = new EventEmitter();

  //activar emisiond e evento despues de eniar formulario
  emitPublication(event){
    this.sendPublication.emit({ send: 'true'});
  }


  //capturar el contenido de archivo del input en una propiedad
  @ViewChild('filePublication')
   inputFilePublication: any;

   //metodo para resetear imagen previa
  deleteImgPreview(){
    this.inputFilePublication.nativeElement.value = "";
  }

   
}
