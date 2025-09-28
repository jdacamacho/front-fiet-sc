import { Routes } from '@angular/router';
import { AuthGuard } from './core/auth/guards/auth-guard';
import { RoleGuard } from './core/auth/guards/role-guard';

export const routes: Routes = [
    // Rutas autenticación
    {
        path: 'login',
        loadComponent: () => import('./core/auth/pages/login-component/login-component').then(m => m.LoginComponent)
    },
    // Rutas home
    {
        path: 'secgeneral',
        canActivate: [AuthGuard, RoleGuard],
        data: { roles: ['Secretario General']},
        loadComponent: () => import('./core/secretario-general/pages/secretario-general-home-component/secretario-general-home-component').then(m => m.SecretarioGeneralHomeComponent)
    },
    // Vistas
    {
        path: 'roles',
        canActivate: [AuthGuard, RoleGuard],
        data: { roles: ['Secretario General']},
        loadComponent: () => import('./core/secretario-general/pages/secretario-general-roles-component/secretario-general-roles-component').then(m => m.SecretarioGeneralRolesComponent)
    },
    {
        path: 'usuarios',
        canActivate: [AuthGuard, RoleGuard],
        data: { roles: ['Secretario General']},
        loadComponent: () => import('./core/secretario-general/pages/secretario-general-usuarios-component/secretario-general-usuarios-component').then(m => m.SecretarioGeneralUsuariosComponent)
    },
    {
        path: 'logs',
        canActivate: [AuthGuard, RoleGuard],
        data: { roles: ['Secretario General']},
        loadComponent: () => import('./core/secretario-general/pages/secretario-general-log-component/secretario-general-log-component').then(m => m.SecretarioGeneralLogComponent)
    },
    {
        path: '',
        redirectTo: 'roles',
        pathMatch: 'full'
    }
];
