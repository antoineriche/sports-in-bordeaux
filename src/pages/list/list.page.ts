import { Component, OnInit } from '@angular/core';

import { ViewChild, ElementRef } from '@angular/core';

declare var google;

@Component({
  selector: 'app-list',
  templateUrl: 'list.page.html',
  styleUrls: ['list.page.scss']
})
export class ListPage implements OnInit {

  private selectedItem: any;
  private icons = [
    'flask',
    'wifi',
    'beer',
    'football',
    'basketball',
    'paper-plane',
    'american-football',
    'boat',
    'bluetooth',
    'build'
  ];
  public items: Array<{ title: string; note: string; icon: string }> = [];

  @ViewChild('map_canvas') mapElement: ElementRef;
  currentSegment: String = 'map';
  showFilters: boolean = false;

  map: any;

  constructor() {
  }

  ngOnInit() {
    console.log('ngOnInit');
    // for (let i = 1; i < 11; i++) {
    //   this.items.push({
    //     title: 'Item ' + i,
    //     note: 'This is item #' + i,
    //     icon: this.icons[Math.floor(Math.random() * this.icons.length)]
    //   });
    // }
  }

  ngOnDestroy(){
    console.log('ngOnDestroy');
  }

  ngAfterViewInit(){
    console.log('ngAfterViewInit');
    this.loadMap();
  }

  loadMap() {
    // this.map = new google.maps.Map(this.mapElement.nativeElement, {
    this.map = new google.maps.Map(this.mapElement.nativeElement, {
        zoom: 14,
        mapTypeControl: false,          // (true? show plan/satellite buttons)
        disableDefaultUI: true,         // (true? hide zoom buttons)
        // gestureHandling: 'none',
        center: new google.maps.LatLng(44.858880, -0.556600),
        zoomControl: false
    });
  }

  segmentChanged(event: any){
    this.currentSegment = event.target.value;
    console.log(this.currentSegment);
    if(this.currentSegment == "map"){
      // this.loadMap();
      // this.map.setCenter(new google.maps.LatLng(44.858880, -0.556600));
      // console.log(this.mapElement.nativeElement);
    }
  }
}
