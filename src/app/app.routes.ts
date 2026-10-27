import { Routes } from '@angular/router';
import { Login } from './features/auth/login/login';
import { Dashboard } from './features/dashboard/dashboard/dashboard';
import { authGuard } from './core/guards/auth-guard';
import { ForgotPassword } from './features/auth/forgot-password/forgot-password';
import { ForgotPasswordSent } from './features/auth/forgot-password-sent/forgot-password-sent';
import { ResetPassword } from './features/auth/reset-password/reset-password';
import { ResetPasswordSuccess } from './features/auth/reset-password-success/reset-password-success';
import { MainLayout } from './layouts/main-layout/main-layout';
import { Roles } from './features/roles/roles/roles';
import { Usuarios } from './features/usuarios/usuarios/usuarios';
import { Clientes } from './features/clientes/clientes/clientes';
import { Mascotas } from './features/mascotas/mascotas/mascotas';
import { Citas } from './features/citas/citas/citas';
import { Atenciones } from './features/atencion/atencion/atencion';
import { Inventario } from './features/inventario/inventario/inventario';
import { Productos } from './features/inventario/productos/productos';
import { Movimientos } from './features/inventario/movimientos/movimientos';
import { Distribuidores } from './features/inventario/distribuidores/distribuidores';
import { Alertas } from './features/inventario/alertas/alertas';
import { Ventas } from './features/ventas/ventas/ventas';
import { Registrar } from './features/ventas/registrar/registrar';
import { Historial } from './features/ventas/historial/historial';
import { Comprobante } from './features/ventas/comprobante/comprobante';
import { Reportes } from './features/reportes/reportes/reportes';
import { ReporteCitas } from './features/reportes/citas/citas';
import { ReporteAtenciones } from './features/reportes/atenciones/atenciones';
import { ReporteVentas } from './features/reportes/ventas/ventas';
import { ReporteInventario } from './features/reportes/inventario/inventario';
import { ReporteProductosVendidos } from './features/reportes/productos-vendidos/productos-vendidos';
import { ReporteProductosUtilizados } from './features/reportes/productos-utilizados/productos-utilizados';
import { ClienteLayout } from './layouts/cliente-layout/cliente-layout';
import { MisCitas } from './features/citas/mis-citas/mis-citas';
import { rolClienteGuard } from './core/guards/rol-cliente-guard';
import { rolesGuard } from './core/guards/roles-guard';

//Esto puede considerarse como un RBAC (Role-Based Access Control) 
// en Angular, donde se definen rutas y se aplican guardias 
// de autenticación y autorización basadas en roles.
export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'forgot-password', component: ForgotPassword },
  { path: 'forgot-password-sent', component: ForgotPasswordSent },
  { path: 'reset-password', component: ResetPassword },
  { path: 'reset-password-success', component: ResetPasswordSuccess },
  {
    path: '',
    component: MainLayout,
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        component: Dashboard
      },
      {
        path: 'usuarios',
        component: Usuarios,
        canActivate: [authGuard, rolesGuard],
        data: {
        roles: ['Administrador']
        }
      },
      {
        path: 'roles',
        component: Roles,
        canActivate: [authGuard, rolesGuard],
        data: {
        roles: ['Administrador']
        }
      },
      {
        path: 'clientes',
        component: Clientes,
        canActivate: [authGuard, rolesGuard],
        data: {
        roles: ['Administrador','Recepcionista']
        }
      },
      {
        path: 'mascotas',
        component: Mascotas,
        canActivate: [authGuard, rolesGuard],
        data: {
        roles: ['Administrador','Recepcionista', 'Veterinario']
        }
      },
      {
        path: 'citas',
        component: Citas,
        canActivate: [authGuard, rolesGuard],
        data: {
        roles: ['Administrador','Recepcionista', 'Veterinario']
        }
      },
      {
        path: 'atencion',
        component: Atenciones,
        canActivate: [authGuard, rolesGuard],
        data: {
        roles: ['Administrador', 'Veterinario']
        }
      },
      {
        path: 'inventario',
        component: Inventario,
        canActivate: [authGuard, rolesGuard],
        data: {
        roles: ['Administrador', 'Inventario', 'Recepcionista']
        },
        children: [
          {
            path: 'productos',
            component: Productos
          },
          {
            path: 'movimientos',
            component: Movimientos
          },
          {
            path: 'distribuidores',
            component: Distribuidores
          },
          {
            path: 'alertas',
            component: Alertas
          },
          {
            path: '',
            redirectTo: 'productos',
            pathMatch: 'full'
          }
        ]
      },
      {
        path: 'ventas',
        component: Ventas,
        canActivate: [authGuard, rolesGuard],
        data: {
        roles: ['Administrador','Recepcionista',]
        },
        children: [
          {
            path: 'registrar',
            component: Registrar
          },
          {
            path: 'historial',
            component: Historial
          },
          {
            path: '',
            redirectTo: 'registrar',
            pathMatch: 'full'
          }
        ]
      },
      {
        path: 'ventas/comprobante/:id',
        component: Comprobante,
        canActivate: [authGuard, rolesGuard],
        data: {
        roles: ['Administrador','Recepcionista']
        }
      },
      {
        path: 'reportes',
        component: Reportes,
        canActivate: [authGuard, rolesGuard],
        data: {
        roles: ['Administrador','Recepcionista', 'Inventario']
        },
        children: [
          {
            path: 'citas',
            component: ReporteCitas
          },
          {
            path: 'atenciones',
            component: ReporteAtenciones
          },
          {
            path: 'ventas',
            component: ReporteVentas
          },
          {
            path: 'inventario',
            component: ReporteInventario
          },
          {
            path: 'productos-mas-vendidos',
            component: ReporteProductosVendidos
          },
          {
            path: 'productos-mas-utilizados',
            component: ReporteProductosUtilizados
          },
          {
            path: '',
            redirectTo: 'citas',
            pathMatch: 'full'
          }
        ]
      }
    ]
  },
  {
    path: '',
    component: ClienteLayout,
    canActivate: [authGuard, rolClienteGuard],
    children: [
      {
        path: 'mis-citas',
        component: MisCitas
      }
    ]
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];