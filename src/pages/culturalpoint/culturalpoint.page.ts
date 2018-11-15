import { Component, OnInit } from '@angular/core';
import { ViewChild, ElementRef } from '@angular/core';

import { Geolocation } from '@ionic-native/geolocation/ngx';

import { OpenBordeauxService } from '../../services/open-bordeaux/open-bordeaux.service';
import { CulturalPoint, CulturalPointUtils } from '../../interfaces/CulturalPoint';


declare var google;
const DEFAULT_MAX_DISTANCE = 50000;
const BORDEAUX_ORIGIN_POSITION = new google.maps.LatLng(44.837789, -0.57918);

@Component({
  selector: 'app-culturalpoint',
  templateUrl: './culturalpoint.page.html',
  styleUrls: ['./culturalpoint.page.scss'],
})
export class CulturalpointPage implements OnInit {

  currentSegment: string = 'map';
  showFilters: boolean = false;
  load: boolean = false;

  currentTypeFilter: string = "Tous";
  culturalPointsTypes: string[] = ["Tous"];
  maxDistance: number = DEFAULT_MAX_DISTANCE;
  currentDistanceFilter: number = this.maxDistance;

  allCulturalPoints: CulturalPoint[] = [];
  currentList: CulturalPoint[] = [];
  favoritePoints: CulturalPoint[] = [];
  currentPoint: CulturalPoint;

  @ViewChild('map_canvas') mapElement: ElementRef;
  map: any;
  userPosition: google.maps.LatLng;
  currentMarker: google.maps.Marker;
  markers: any[] = [];

  watchPositionListener: any;
  error: any;

  constructor(
    private openBordeauxService: OpenBordeauxService,
    private culturalPointUtils: CulturalPointUtils,
    private geolocation: Geolocation) {
  }

  ngOnInit() {
    console.log('ngOnInit CulturalpointPage');
    this.getCulturalPointsFromOpenBordeaux();
    // this.favoriteHandlerService.getFavoriteSportPoints().then(
    //   favs => {
    //     this.favoritePoints = favs;
    //     console.log(favs);
    //   },
    //   error => console.log(error)
    // );
  }

  ngAfterViewInit(){
    console.log('ngAfterViewInit CulturalpointPage');
    this.loadMap();

    this.geolocation.getCurrentPosition().then(
      position => {
        this.userPosition = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        this.map.setCenter(this.userPosition);
    });

    this.watchPositionListener = this.geolocation.watchPosition().subscribe(
      position => {
        this.userPosition = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        this.map.setCenter(this.userPosition);

        this.computeDistance();
        this.applyFilters();

        if(this.currentMarker){
          this.currentMarker.setMap(null);
        }

        this.currentMarker = new google.maps.Marker({
          position: this.userPosition,
          map: this.map,
          icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
        });
      },
      err => { console.log(err); }
    );
  }

  ngOnDestroy() {
    console.log('ngOnDestroy TestPage');
    if (this.watchPositionListener) {
      this.watchPositionListener.unsubscribe();
    }
  }

  getCulturalPointsFromOpenBordeaux(){
    this.load = true;
    this.openBordeauxService.getCulturalPoints().subscribe(
      data  => {
        this.setCulturalPointList(data);
        this.load = false;
      },
      error => {
        this.error = error;
        console.log(this.error);
        this.load = false;
      }
    );
  }

  setCulturalPointList(data: any){
    this.allCulturalPoints = this.culturalPointUtils.extractFromJSON(data);
    this.culturalPointsTypes = this.culturalPointsTypes.concat(this.culturalPointUtils.getFilterTypes(this.allCulturalPoints));

    for(let culturalPoint of this.allCulturalPoints) {
      var position = new google.maps.LatLng(culturalPoint.y_lat, culturalPoint.x_long);
      this.addMarker(position, this.map, culturalPoint.icon, culturalPoint.entityid);
    }

    this.computeDistance();
    this.applyFilters();
  }

  computeDistance(){
    if(this.userPosition && this.allCulturalPoints.length){
      console.log('Compute distance');
      var distMax = 0;

      for(let point of this.allCulturalPoints) {
        var distance = google.maps.geometry.spherical.computeDistanceBetween(
          this.userPosition, new google.maps.LatLng(Number(point.y_lat), Number(point.x_long)));
        point.distance = distance;
        distMax = distance > distMax ? distance : distMax;
      }

      var dizaine = distMax - distMax % 10000
      this.maxDistance = ( dizaine + 1 ) * 10000;
      this.currentDistanceFilter = this.currentDistanceFilter > this.maxDistance ? this.maxDistance : this.currentDistanceFilter;
    }
    else if (!this.userPosition){ console.log("Can't compute distance: Waiting for user position."); }
    else if (this.allCulturalPoints.length == 0){ console.log("Can't compute distance: Waiting for cultural points."); }
  }

  onTypeChange(event: any){
    this.currentTypeFilter = event.target.value;
    this.applyFilters();
  }

  onDistanceChange(event: any){
    this.currentDistanceFilter = event.target.value;
    this.applyFilters();
  }

  applyFilters(){
    if("Tous" != this.currentTypeFilter){
      this.currentList = this.allCulturalPoints.filter(
        point => (point.distance <= this.currentDistanceFilter) && (point.stheme == this.currentTypeFilter)
      );
    } else {
      this.currentList = this.allCulturalPoints.filter(
        point => point.distance <= this.currentDistanceFilter
      );
    }

    this.drawMarkers(this.currentList, this.map);

    this.currentList.sort(function(a, b){return a['distance'] - b['distance']});
    console.log('Apply filters >> ' + this.currentList.length);
  }

  loadMap() {
    this.map = new google.maps.Map(this.mapElement.nativeElement, {
        zoom: 14,
        mapTypeControl: false,          // (true? show plan/satellite buttons)
        disableDefaultUI: true,         // (true? hide zoom buttons)
        // gestureHandling: 'none',
        center: BORDEAUX_ORIGIN_POSITION,
        zoomControl: false
    });
  }

  addMarker(location: google.maps.LatLng, map: any, icon: string, key: string) {
    var marker = new google.maps.Marker({
      position: location,
      map: map,
      icon: icon,
      title: key
    });

    let ctxt = this;
    google.maps.event.addListener(marker, 'click', function() {
        ctxt.showCulturalPointDetails(key);
    });

    this.markers.push(marker);
  }

  drawMarkers(culturalPointList: CulturalPoint[], map: any){
    let keys = culturalPointList.map(point => point.entityid);
    for(let marker of this.markers){
      if(keys.includes(marker.title)){
        if(!marker.getMap()){
          marker.setMap(map);
        }
      }
      else {
        marker.setMap(null);
      }
    }
  }

  showCulturalPointDetails(key: string){
    this.currentPoint = this.allCulturalPoints.filter(point => point.entityid == key)[0];
    this.showFilters = false;
  }

  closeDetails(){
    this.currentPoint = null;
  }

  toggleFilters(){
    this.showFilters = !this.showFilters;
  }

}
