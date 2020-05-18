import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { GeoservicesCoreNgxModule } from '@tamu-gisc/geoservices/core/ngx';
import { UINavigationTriggersModule } from '@tamu-gisc/ui-kits/ngx/navigation/triggers';
import { UITileNavigationModule } from '@tamu-gisc/ui-kits/ngx/navigation/mobile-tile';

import { DashboardComponent } from './dashboard.component';


const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadChildren: () => import('./pages/status/status.module').then((m) => m.StatusModule)
      },
    ]
  }
];

@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    GeoservicesCoreNgxModule,
    UINavigationTriggersModule,
    UITileNavigationModule
  ]
})
export class DashboardModule { }
