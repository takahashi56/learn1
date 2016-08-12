import {Injectable} from 'angular2/core';
import 'rxjs/add/operator/map';
import {Http, Headers} from 'angular2/http';

const HEADER = {
  headers: new Headers({
    'Content-Type': 'application/json'
  })
};

@Injectable()
export class TutorService {
	private baseUrl: string = "/api/tutor/";

	constructor(private _http: Http) {}

	getAllCourses(){		
		return this._http.get(this.baseUrl + "courses", HEADER).map((res) =>{ 
			return res.json();
		});
	}

	getAllStudents(){
		return this._http.get(this.baseUrl + "students", HEADER).map((res) =>{ 
			return res.json();
		});
	}

	addStudent(data, flag){
		if(!flag){
			return this._http.post(this.baseUrl + "student", JSON.stringify(data), HEADER)
			.map((res) => {		
				return res.json();
			})
		}else{
			return this._http.put(this.baseUrl + "student", JSON.stringify(data), HEADER)
			.map((res) => {		
				return res.json();
			})
		}
		
	}
}