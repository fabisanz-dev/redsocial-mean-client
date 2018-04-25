

import { Injectable } from "@angular/core";
import { Router, CanActivate} from '@angular/router'; //con CanActivate se controlan las rutas de acceso
import { userService } from './user.service';

@Injectable()
export class UserGuard implements CanActivate{

    constructor(
        private _router : Router,
        private _userService : userService
    ){ }

    canActivate(){
        let identity = this._userService.getIdentity();
        if(identity && (identity.role == 'USER_ROLE' || identity.role == 'ADMIN_ROLE')){
            return true;
        }else{
            this._router.navigate(['/login']);
            return false;
        }
    }
}