import { Injectable } from '@angular/core';

export class CulturalPoint {
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
export class CulturalPointUtils {

  extractFromJSON(json: any): CulturalPoint[] {
    var res: CulturalPoint[] = [];
    for(var i = 0 ; i < json.d.length ; i++){
      if(this.isComplete(json.d[i])){
        res.push(this.jsonToCulturalPoint(json.d[i]));
      }
    }
    return res;
  }

  getFilterTypes(culturalPoints: CulturalPoint[]): string[] {
    let types: string[] = [];
    culturalPoints.forEach(function(culturalPoint) {
      if(!types.includes(culturalPoint.stheme)){
        types.push(culturalPoint.stheme);
      }
    });
    return types;
  }

  isComplete(json: any): boolean{
    return json.adresse && json.entityid
      && json.nom && json.x_long
      && json.y_lat && json.stheme;
  }

  distance(distance: number): string {
    return (distance / 1000).toFixed(2) + " km";
  }

  jsonToCulturalPoint(json: any): CulturalPoint {
    let icon;
    switch(json.stheme){
      case "Bibliothèquesdsf":
        icon = "../assets/icon/book2.png"
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
      icon: icon
    };
  }
}
