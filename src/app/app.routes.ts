import { Routes } from '@angular/router';
import { LoginComponent } from './modules/auth/pages/login/login.component';
import { RegisterComponent } from './modules/auth/pages/register/register.component';
import { DashboardComponent } from './modules/reserva-me/pages/dashboard/dashboard.component';
import { Error404Component } from './shared/components/error404/error404.component';
import { AuthGuard } from './modules/auth/guards/auth.guard';
import { PublicGuard } from './modules/auth/guards/public.guard';
import { LayoutComponent } from './modules/reserva-me/pages/layout/layout.component';
import { ProfileComponent } from './modules/reserva-me/pages/profile/profile.component';
import { UsersComponent } from './modules/reserva-me/pages/users/users.component';
import { ReservationsComponent } from './modules/reserva-me/pages/reservations/reservations.component';
import { EventsComponent } from './modules/reserva-me/pages/events/events.component';
import { ForgotPasswordComponent } from './modules/auth/pages/forgot-password/forgot-password.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'auth/login',
        pathMatch: 'full'
    },
    {
        path: 'auth',
        canActivate: [ PublicGuard ],
        children: [
            {
                path: 'login',
                component: LoginComponent
            },
            {
                path: 'register',
                component: RegisterComponent
            },
            {
                path: 'forgot-password',
                component: ForgotPasswordComponent
            },
            {
                path: '',
                redirectTo: 'login',
                pathMatch: 'full'
            }
        ],
    },
    {
        path: 'reservame',
        component: LayoutComponent,
        canActivate: [ AuthGuard ],
        children: [
            {
                path: 'dashboard',
                component: DashboardComponent
            },
            {
                path: 'profile',
                component: ProfileComponent
            },
            {
                path: 'users',
                component: UsersComponent
            },
            {
                path: 'events',
                component: EventsComponent
            },
            {
                path: 'reservations',
                component: ReservationsComponent
            },
            {
                path: '',
                redirectTo: 'dashboard',
                pathMatch: 'full'
            }
        ]
    },
    {
        path: '404',
        component: Error404Component,
      },
      {
        path: '**',
        redirectTo: '404'
      },
];
