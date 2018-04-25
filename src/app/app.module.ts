
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
//import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { MessagesModule } from './_modules/messages/messages.module'; //modulo personal de mensajes
// Import ReactiveFormsModule
import { ReactiveFormsModule } from '@angular/forms';
import { MomentModule } from 'ngx-moment';

import { routing, appRoutingProviders } from './app.routing';


import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { UserEditComponent } from './users/user-edit/user-edit.component';
import { UsersComponent } from './users/users/users.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { TimelineComponent } from './timeline/timeline.component';
import { UserProfileComponent } from './users/user-profile/user-profile.component';
import { FollowingComponent } from './following/following.component';
import { FollowedComponent } from './followed/followed.component';

import { userService } from './_services/user.service';
import { UserGuard } from './_services/user-guard';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    UserEditComponent,
    UsersComponent,
    SidebarComponent,
    TimelineComponent,
    UserProfileComponent,
    FollowingComponent,
    FollowedComponent
  ],
  imports: [
    BrowserModule,
    routing,
    FormsModule,
    HttpClientModule,
    MessagesModule,
    ReactiveFormsModule,
    MomentModule
  ],
  providers: [
    appRoutingProviders,
    userService,
    UserGuard
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
