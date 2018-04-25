
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MessagesRoutingModule } from './messages-routing.module';
import { MomentModule } from 'ngx-moment';

import { MainComponent } from './components/main/main.component';
import { SendedComponent } from './components/sended/sended.component';
import { ReceivedComponent } from './components/received/received.component';
import { AddMessageComponent } from './components/add-message/add-message.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MessagesRoutingModule,
    ReactiveFormsModule,
    MomentModule
  ],
  declarations: [
    MainComponent,
    AddMessageComponent,
    SendedComponent, 
    ReceivedComponent
  ],
  exports : [
    MainComponent,
    AddMessageComponent,
    SendedComponent, 
    ReceivedComponent
  ],
  providers:[
  ]
})
export class MessagesModule { }
