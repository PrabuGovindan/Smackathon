import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the RestapiService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class RestapiService {
data:any;
  constructor(public http: Http) {
    console.log('Hello RestapiService Provider');
  }

  getUsers() {
  if (this.data) {
    return Promise.resolve(this.data);
  }

  return new Promise(resolve => {
    this.http.get('http://10.244.6.237:8000/campaign')
      .map(res => res.json())
      .subscribe(data => {
        this.data = data;
        resolve(this.data);
      }
      , err => {
         console.log(err.message);
          console.log(new Error().stack);
          console.log(err.json);
      }
      
      );
  });
}

}
