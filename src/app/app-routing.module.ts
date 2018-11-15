import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  // { path: '',     loadChildren: '../pages/home/home.module#HomePageModule'},
  { path: '',     loadChildren: '../pages/test/test.module#TestPageModule'},
  { path: 'test', loadChildren: '../pages/test/test.module#TestPageModule'},
  { path: 'culturalpoint', loadChildren: '../pages/culturalpoint/culturalpoint.module#CulturalpointPageModule' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
