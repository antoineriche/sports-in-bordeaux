import { Injectable } from '@angular/core';

export class CityPoint {
  address: string;
  key: string;
  name: string;
  longitude: number;
  latitude: number;
  category: string;
  distance: number;
  icon: any;
}

@Injectable({
  providedIn: 'root'
})
export class CityPointUtils {

  extractFromJSON(json: any): CityPoint[] {
    var res: CityPoint[] = [];
    for(var i = 0 ; i < json.d.length ; i++){
      if(this.isComplete(json.d[i])){
        res.push(this.jsonToCityPoint(json.d[i]));
      }
    }
    return res;
  }

  getCategories(cityPoints: CityPoint[]): string[] {
    let categories: string[] = [];
    cityPoints.forEach(function(cityPoint) {
      if(!categories.includes(cityPoint.category)){
        categories.push(cityPoint.category);
      }
    });
    return categories;
  }

  isComplete(json: any): boolean{
    return json.adresse && json.entityid
      && json.nom && json.x_long
      && json.y_lat && json.stheme;
  }

  friendlyDistance(distance: number): string {
    return (distance / 1000).toFixed(2) + " km";
  }

  jsonToCityPoint(json: any): CityPoint {
    let icon;
    switch(json.stheme){
      case "Bibliothèquess":
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
      case "Piscines et baignades":
        icon = "../assets/icon/pool.svg"
      break;
      default:
        icon = '';
      break;
    }

    return {
      address:    json.adresse,
      key:        json.entityid,
      name:       json.nom,
      longitude:  Number(json.x_long),
      latitude:   Number(json.y_lat),
      category:   json.stheme,
      distance:   null,
      icon:       icon
    };
  }
}
