import {Injectable} from 'angular2/core';
import 'rxjs/add/operator/map';
import {Http, Headers} from 'angular2/http';

const HEADER = {
  headers: new Headers({
    'Content-Type': 'application/json'
  })
};

@Injectable()
export class AuthService {
	private loginUrl: string = "/api/login";

	constructor(private _http: Http) {}

	Login(data) {
		return this._http.post(this.loginUrl, JSON.stringify(data), HEADER)
			.map((res) => {
				return	res.json();
			});
	}

  forgetpwd(data){
    return this._http.post(this.loginUrl + '/forgetpwd', JSON.stringify(data), HEADER)
			.map((res) => {
				return res.json();
			})
  }

  resetpwd(data){
    return this._http.post(this.loginUrl + '/resetpwd', JSON.stringify(data), HEADER)
			.map((res) => {
				return res.json();
			})
  }
}
