import { Injectable }     from '@angular/core';
import { NativeStorage }  from '@ionic-native/native-storage/ngx';
import { CityPoint }     from "../../interfaces/CityPoint";

const SPORT_POINT_KEY = "sportpoint_";
const CULTURAL_POINT_KEY = "culturalpoint_";

const NATIVE_WRITE_FAILED = 1
const ITEM_NOT_FOUND = 2
const NULL_REFERENCE = 3
const UNDEFINED_TYPE = 4
const JSON_ERROR = 5
const WRONG_PARAMETER = 6

@Injectable({
  providedIn: 'root'
})
export class FavoriteHandlerService {

  constructor(private nativeStorage: NativeStorage) { }

  getSportPointKey(sportPoint: CityPoint): string {
    return this.getCityPointKey(SPORT_POINT_KEY, sportPoint.key);
  }

  getCulturalPointKey(culturalPoint: CityPoint): string {
    return this.getCityPointKey(CULTURAL_POINT_KEY, culturalPoint.key);
  }

  private getCityPointKey(prefix: string, pointKey: string): string{
    return prefix + pointKey;
  }

  addFavoriteSportPoint(sportPoint: CityPoint) {
    console.log('addFavoriteSportPoint');
    let key = this.getSportPointKey(sportPoint);
    this.addFavoriteCityPoint(key, sportPoint);
  }

  addFavoriteCulturalPoint(culturalPoint: CityPoint) {
    console.log('addFavoriteCulturalPoint');
    let key = this.getCulturalPointKey(culturalPoint);
    this.addFavoriteCityPoint(key, culturalPoint);
  }

  private addFavoriteCityPoint(storageKey: string, point: CityPoint){
    console.log('addFavoriteCityPoint');
    this.nativeStorage.setItem(storageKey, point)
      .then(
        () => console.log('Stored item (' + storageKey + ')! '),
        error => console.error('Error storing item', error)
      );
  }

  removeFavoriteSportPoint(sportPoint: CityPoint) {
    console.log('removeFavoriteSportPoint');
    this.removeFavoriteCityPoint(this.getSportPointKey(sportPoint));
  }

  removeFavoriteCulturalPoint(culturalPoint: CityPoint) {
    console.log('removeFavoriteCulturalPoint');
    this.removeFavoriteCityPoint(this.getCulturalPointKey(culturalPoint));
  }

  private removeFavoriteCityPoint(storageKey: string) {
    console.log('removeFavoriteCulturalPoint');
    this.nativeStorage.remove(storageKey);
  }

  getFavoriteSportPoints(): Promise<CityPoint[]> {
    return this.getFavoriteCityPoints(SPORT_POINT_KEY);
  }

  getFavoriteCulturalPoints(): Promise<CityPoint[]> {
    return this.getFavoriteCityPoints(CULTURAL_POINT_KEY);
  }

  private getFavoriteCityPoints(prefixKey: string): Promise<CityPoint[]> {
    return new Promise(resolve => {
      let results: CityPoint[] = [];
      this.nativeStorage.keys()
        .then(keys =>
          keys
            .filter(key => key.includes(prefixKey))
            .forEach(key => this.nativeStorage.getItem(key).then(data => results.push(data)))
        );
      return resolve(results);
    });
  }

  isFavoriteSportPoint(sportPoint: CityPoint){
    console.log('isFavoriteSportPoint');
    return this.isFavoriteCityPoint(this.getSportPointKey(sportPoint));
  }

  isFavoriteCulturalPoint(culturalPoint: CityPoint){
    console.log('isFavoriteCulturalPoint');
    return this.isFavoriteCityPoint(this.getCulturalPointKey(culturalPoint));
  }

  private isFavoriteCityPoint(storageKey: string){
    console.log('isFavoriteCityPoint');
    return this.nativeStorage.getItem(storageKey);
  }

  toggleFavoriteSportPoint(sportPoint: CityPoint) {
    console.log('toggleFavoriteSportPoint');
    this.toggleFavoriteCityPoint(this.getSportPointKey(sportPoint), sportPoint);
  }

  toggleFavoriteCulturalPoint(culturalPoint: CityPoint) {
    console.log('toggleFavoriteCulturalPoint');
    this.toggleFavoriteCityPoint(this.getCulturalPointKey(culturalPoint), culturalPoint);
  }

  private toggleFavoriteCityPoint(storageKey: string, point: CityPoint) {
    console.log('toggleFavoriteCityPoint');
    this.isFavoriteCityPoint(storageKey).then(
      ()      =>  this.removeFavoriteCityPoint(storageKey),
      error   =>  {
        error.code == ITEM_NOT_FOUND ?
          this.addFavoriteCityPoint(storageKey, point) : console.log(error);
      }
    );
  }
}
