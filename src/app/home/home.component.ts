
import { Component, OnInit } from '@angular/core';
import { User } from './../_models/user';

import { userService } from './../_services/user.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [userService]
})
export class HomeComponent implements OnInit {
  public title: string;
  public identity: any ;

  public status: string;

  constructor(private _userService:userService) {
    
  }
  
  ngOnInit() {
    this.identity = this._userService.getIdentity();
  }

  

}
