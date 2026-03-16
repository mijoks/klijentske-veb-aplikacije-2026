import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Details } from './details/details';
import { User } from './user/user';
import { Login } from './login/login';
import { Signup } from './signup/signup';
import { Cart } from './cart/cart';

export const routes: Routes = [
    {path:'',component:Home},
    { path: 'details/:id', component: Details },
    { path: 'user', component: User },
    { path: 'login', component: Login },
    { path: 'signup', component: Signup },
    { path: 'cart', component: Cart }
];
