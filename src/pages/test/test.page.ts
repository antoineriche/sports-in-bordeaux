import { Component, OnInit } from '@angular/core';
import { ViewChild, ElementRef } from '@angular/core';

import { Geolocation } from '@ionic-native/geolocation/ngx';

import { OpenBordeauxService } from '../../services/open-bordeaux/open-bordeaux.service';
import { SportPoint, SportPointUtils } from '../../interfaces/SportPoint';

declare var google;
const DEFAULT_MAX_DISTANCE = 50000;

@Component({
  selector: 'app-test',
  templateUrl: './test.page.html',
  styleUrls: ['./test.page.scss'],
})
export class TestPage implements OnInit {

  currentSegment: String = 'map';
  showFilters: boolean = false;
  load: boolean = false;

  currentTypeFilter: String = "Tous";
  sportPointsTypes: String[] = ["Tous"];
  maxDistance: number = DEFAULT_MAX_DISTANCE;
  currentDistanceFilter: number = this.maxDistance;

  allSportPoints: SportPoint[] = [];
  currentList: SportPoint[] = [];
  currentPoint: SportPoint;

  @ViewChild('map_canvas') mapElement: ElementRef;
  map: any;
  userPosition: google.maps.LatLng;
  currentMarker: google.maps.Marker;
  markers: any[] = [];

  watchPositionListener: any;
  error: any;

  constructor(
    private openBordeauxService: OpenBordeauxService,
    private sportPointUtils: SportPointUtils,
    private geolocation: Geolocation) {
  }

  ngOnInit() {
    console.log('ngOnInit TestPage');
    this.getSportPointsFromOpenBordeaux();
  }

  ngAfterViewInit(){
    console.log('ngAfterViewInit TestPage');
    this.loadMap();

    this.geolocation.getCurrentPosition().then(
      position => {
        this.userPosition = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        this.map.setCenter(this.userPosition);
    });

    this.watchPositionListener = this.geolocation.watchPosition().subscribe(
      position => {
        this.userPosition = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        this.computeDistance();

        if(this.currentMarker){
          this.currentMarker.setMap(null);
        }

        this.currentMarker = new google.maps.Marker({
          position: this.userPosition,
          map: this.map,
          icon: 'http://maps.google.com/mapfiles/kml/paddle/blu-circle.png'
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

  loadMap() {
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
    this.showFilters = false;
    this.closeDetails();
  }

  toggleFilters(){
    this.showFilters = !this.showFilters;
    this.closeDetails();
  }

  getSportPointsFromOpenBordeaux(){
    this.load = true;
    this.openBordeauxService.getSportPoints().subscribe(
      data  => {
        this.setSportPointList(data);
        this.load = false;
      },
      error => {
        this.error = error;
        console.log(this.error);
        this.load = false;
      }
    );
  }

  setSportPointList(data: any){
    this.allSportPoints = this.sportPointUtils.extractFromJSON(data);
    this.sportPointsTypes = this.sportPointsTypes.concat(this.sportPointUtils.getFilterTypes(this.allSportPoints));

    for(let sportPoint of this.allSportPoints) {
      var position = new google.maps.LatLng(sportPoint.y_lat, sportPoint.x_long);
      let icon: String;
      switch(sportPoint.stheme){
        case "Piscines et baignades":
          icon = "../assets/icon/pool.svg"
        break;
        case "Nautisme":
          icon = "../assets/icon/boat.svg"
        break;
        case "Equipements sportifs et ludiques":
          icon = "../assets/icon/gym.svg"
        break;
        case "Terrains et salles de sport":
          icon = "../assets/icon/gym.svg"
        break;
        default:
          icon = '';
        break;
      }

      this.addMarker(position, this.map, icon, sportPoint.entityid);
    }
    this.computeDistance();
    this.applyFilters();
  }

  computeDistance(){
    if(this.userPosition && this.allSportPoints.length){
      console.log('Compute distance');
      var distMax = 0;

      for(let sportPoint of this.allSportPoints) {
        var distance = google.maps.geometry.spherical.computeDistanceBetween(
          this.userPosition, new google.maps.LatLng(Number(sportPoint.y_lat), Number(sportPoint.x_long)));
        sportPoint.distance = distance;
        distMax = distance > distMax ? distance : distMax;
      }

      var dizaine = distMax - distMax % 10000
      this.maxDistance = ( dizaine + 1 ) * 10000;
      this.currentDistanceFilter = this.currentDistanceFilter > this.maxDistance ? this.maxDistance : this.currentDistanceFilter;
      this.applyFilters();
    }
    else if (!this.userPosition){ console.log("Can't compute distance: Waiting for user position."); }
    else if (this.allSportPoints.length == 0){ console.log("Can't compute distance: Waiting for sport points."); }
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
      this.currentList = this.allSportPoints.filter(
        point => (point.distance <= this.currentDistanceFilter) && (point.stheme == this.currentTypeFilter)
      );
    } else {
      this.currentList = this.allSportPoints.filter(
        point => point.distance <= this.currentDistanceFilter
      );
    }

    let keys = this.currentList.map(point => point.entityid);
    for(let marker of this.markers){
      marker.setMap(keys.includes(marker.title) ? this.map : null);
    }

    this.currentList.sort(function(a, b){return a['distance'] - b['distance']});
    console.log('Apply filters >> ' + this.currentList.length);
  }

  addMarker(location, map, icon, key) {
    var marker = new google.maps.Marker({
      position: location,
      map: map,
      icon: icon,
      title: key
    });

    let ctxt = this;
    google.maps.event.addListener(marker, 'click', function() {
        ctxt.showSportPointDetails(key);
    });

    this.markers.push(marker);
  }

  showSportPointDetails(key: string){
    this.currentPoint = this.allSportPoints.filter(point => point.entityid == key)[0];
    this.showFilters = false;
  }

  closeDetails(){
    this.currentPoint = null;
  }

}
