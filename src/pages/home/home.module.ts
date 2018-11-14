import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Routes, RouterModule } from '@angular/router';

import { HomePage } from './home.page';
import { ListPageModule } from '../list/list.module';
import { MapPageModule } from '../map/map.module';
import { HomePageRoutingModule } from './home.router.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListPageModule,
    MapPageModule,
    HomePageRoutingModule
  ],
  exports: [RouterModule],
  declarations: [HomePage]
})
export class HomePageModule {}
