import { Injectable } from '@angular/core';

export class SportPoint {
  adresse: string;
  entityid: string;
  nom: string;
  x_long: string;
  y_lat: string;
  stheme: string;
  distance: number;
  icon: any;
}

@Injectable({
  providedIn: 'root'
})
export class SportPointUtils {

  extractFromJSON(json: any): SportPoint[] {
    var res: SportPoint[] = [];
    for(var i = 0 ; i < json.d.length ; i++){
      if(this.isComplete(json.d[i])){
        res.push(this.jsonToSportPoint(json.d[i]));
      }
    }
    return res;
  }

  getFilterTypes(sportPoints: SportPoint[]): String[] {
    let types: String[] = [];
    // types.push("Tous");
    sportPoints.forEach(function(sportPoint) {
      if(!types.includes(sportPoint.stheme)){
        types.push(sportPoint.stheme);
      }
    });
    return types;
  }

  isComplete(json: any): boolean{
    return json.adresse && json.entityid
      && json.nom && json.x_long
      && json.y_lat && json.stheme;
  }

  friendlyDistance(distance: number): String{
    return (distance / 1000).toFixed(2) + " km";
  }

  jsonToSportPoint(json: any): SportPoint {
    let icon;
    switch(json.stheme){
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
    
    return {
      adresse:  json.adresse,
      entityid: json.entityid,
      nom:      json.nom,
      x_long:   json.x_long,
      y_lat:    json.y_lat,
      stheme:   json.stheme,
      distance: null,
      icon: icon;
    };
  }
}
