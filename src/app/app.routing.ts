
import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { UserEditComponent } from './users/user-edit/user-edit.component';    
import { UsersComponent } from './users/users/users.component';
import { UserProfileComponent } from './users/user-profile/user-profile.component';
import { TimelineComponent } from './timeline/timeline.component';
import { FollowingComponent } from './following/following.component';
import { FollowedComponent } from './followed/followed.component';

import { UserGuard } from './_services/user-guard';

const appRoutes: Routes = [
    {path: '', component: HomeComponent},
    {path: 'login', component: LoginComponent},
    {path: 'register', component: RegisterComponent},
    {path: 'user-edit', component: UserEditComponent, canActivate:[UserGuard]},
    {path: 'users', component: UsersComponent, canActivate:[UserGuard]},
    {path: 'users/:page', component: UsersComponent, canActivate:[UserGuard]},
    {path: 'publications', component: TimelineComponent, canActivate:[UserGuard]},
    {path: 'profile-user/:id', component: UserProfileComponent, canActivate:[UserGuard]},
    {path: 'following-user/:id/:page', component: FollowingComponent, canActivate:[UserGuard]},
    {path: 'followed-user/:id/:page', component: FollowedComponent, canActivate:[UserGuard]},
    {path: '**', component: HomeComponent}
];

export const appRoutingProviders : any[] = [];
export const routing : ModuleWithProviders = RouterModule.forRoot(appRoutes);
