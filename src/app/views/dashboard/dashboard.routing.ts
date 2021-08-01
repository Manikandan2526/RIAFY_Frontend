import { Routes } from '@angular/router';

import { DashboardBlankComponent } from './blank/blank.component';

export const DashboardRoutes: Routes = [
  {
      path: 'blank' || '',
      component: DashboardBlankComponent,
      data: { title: 'STOCKS', breadcrumb: 'STOCKS' }
    }
];