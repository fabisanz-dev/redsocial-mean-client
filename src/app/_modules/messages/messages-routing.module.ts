
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router'; //rutas para los componentes del modulo

//componentes del modulo
import { MainComponent } from './components/main/main.component';
import { SendedComponent } from './components/sended/sended.component';
import { ReceivedComponent } from './components/received/received.component';
import { AddMessageComponent } from './components/add-message/add-message.component';

import { UserGuard } from './../../_services/user-guard';

const messagesRoutes : Routes = [
    { 
        path : 'messages', component : MainComponent, canActivate:[UserGuard],
        children : [
            { path : '', redirectTo: 'received/1', pathMatch: 'full'},
            { path: 'received/:page', component: ReceivedComponent },
            { path: 'sended/:page', component: SendedComponent },
            { path: 'addMessage', component: AddMessageComponent },
            { path: 'addMessage/:user', component: AddMessageComponent }
        ]

    }
]

@NgModule({
  imports: [
    RouterModule.forChild(messagesRoutes)
  ],
  exports: [
      RouterModule
  ]
})
export class MessagesRoutingModule { }