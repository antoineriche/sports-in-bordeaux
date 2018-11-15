import { Injectable }     from '@angular/core';
import { NativeStorage }  from '@ionic-native/native-storage/ngx';
import { SportPoint }     from "../../interfaces/SportPoint";

const SPORT_POINT_KEY = "sportpoint_";

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

  getSportPointKey(sportPoint: SportPoint) {
    return SPORT_POINT_KEY + sportPoint.entityid;
  }

  addFavoriteSportPoint(sportPoint: SportPoint) {
    console.log('addFavoriteSportPoint');
    let key = this.getSportPointKey(sportPoint);
    this.nativeStorage.setItem(key, sportPoint)
      .then(
        () => console.log('Stored item (' + key + ')! '),
        error => console.error('Error storing item', error)
      );
  }

  removeFavoriteSportPoint(sportPoint: SportPoint) {
    console.log('removeFavoriteSportPoint');
    this.nativeStorage.remove(this.getSportPointKey(sportPoint));
  }

  getFavoriteSportPoints(): Promise<SportPoint[]> {
    return new Promise(resolve => {
      let results: SportPoint[] = [];
      this.nativeStorage.keys()
        .then(keys =>
          keys
            .filter(key => key.includes(SPORT_POINT_KEY))
            .forEach(key =>
              this.nativeStorage.getItem(key).then(data => results.push(data))
            )
        );
      return resolve(results);
    });
  }

  isFavoriteSportPoint(sportPoint: SportPoint){
    console.log('isFavoriteSportPoint');
    return this.nativeStorage.getItem(this.getSportPointKey(sportPoint));
  }

  toggleFavoriteSportPoint(sportPoint: SportPoint) {
    console.log('toggleFavoriteSportPoint');
    this.isFavoriteSportPoint(sportPoint).then(
      ()      =>  this.removeFavoriteSportPoint(sportPoint),
      error   =>  {
        error.code == ITEM_NOT_FOUND ?
          this.addFavoriteSportPoint(sportPoint) : console.log(error);
      }
    );
  }
}
