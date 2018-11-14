import { Component } from '@angular/core';

import { OpenBordeauxService } from '../../services/open-bordeaux/open-bordeaux.service';
import { SportPoint, SportPointUtils } from '../../interfaces/SportPoint';

import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Platform, Tabs } from '@ionic/angular';
import { Toast } from '@ionic-native/toast/ngx';

import { ViewChild, ElementRef } from '@angular/core';

declare var google;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  @ViewChild("tabs") mapTab: Tabs;

  constructor(
    private openBordeauxService: OpenBordeauxService,
    private sportPointUtils: SportPointUtils,
    private geolocation: Geolocation,
    private toast: Toast) {
  }
}
