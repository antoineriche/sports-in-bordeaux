import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ListPage } from '../list/list.page';
import { MapPage } from '../map/map.page';
import { HomePage } from './home.page';

const routes: Routes = [
  {path: 'tabs',  component: HomePage,
    children: [
      {path: 'map',   outlet: 'map',  component: MapPage},
      {path: 'list',  outlet: 'list', component: ListPage},
    ]
  },
  {path: '',  redirectTo: '/tabs/(map:map)'},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomePageRoutingModule {}
