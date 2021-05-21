import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [

  {
    path: '',
    redirectTo: 'profile',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then( m => m.AuthPageModule)
  },
  {
    path: 'order-list',
    loadChildren: () => import('./order-list/order-list.module').then( m => m.OrderListPageModule),
    canLoad: [AuthGuard]
  },
  {
    path: 'settings',
    loadChildren: () => import('./settings/settings.module').then( m => m.SettingsPageModule),
    canLoad: [AuthGuard]
  },
  {
    path: 'qr-scanner',
    loadChildren: () => import('./qr-scanner/qr-scanner.module').then( m => m.QrScannerPageModule),
    canLoad: [AuthGuard]
  },
  {
    path: 'profile',
    loadChildren: () => import('./profile/profile.module').then( m => m.ProfilePageModule),
    canLoad: [AuthGuard]
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
