import {Injectable} from 'angular2/core';
import 'rxjs/add/operator/map';
import {Http, Headers} from 'angular2/http';

const HEADER = {
  headers: new Headers({
    'Content-Type': 'application/json'
  })
};

@Injectable()
export class AdminService {
	private baseUrl: string = "/api/admin/";

	constructor(private _http: Http) {}

	getAllCourses(){
		var data = [{title: "safety", lesson: "5", video: "10", student: "20"},
					{title: "safety", lesson: "5", video: "10", student: "20"}];
		return data;
		// return this._http.get(this.baseUrl + "courses", HEADER).map(res => res.json());
	}

	getAllOrgs(){
		return this._http.get(this.baseUrl + "tutors").map((res) =>{ 
				return res.json();
			});	

		// var data = [{organization: "School1", firstname: "firstname", lastname: "lastname", phone: "01234", email: "email.com", student: "20", lastlogon: "13/5/2016"},
		// 		{organization: "School1", firstname: "firstname", lastname: "lastname", phone: "01234", email: "email.com", student: "20", lastlogon: "13/5/2016"}];
		// return data;
		
	}

	addTutor(data){
		return this._http.post(this.baseUrl + "tutor", JSON.stringify(data), HEADER)
			.map((res) => {		
				return res.json();
			})
	}

	updateTutor(data){
		return this._http.put(this.baseUrl + "tutor", JSON.stringify(data), HEADER)
			.map((res) => {		
				return res.json();
			})	
	}
}