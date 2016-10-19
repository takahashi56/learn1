import {Injectable} from 'angular2/core';
import 'rxjs/add/operator/map';
import {Http, Headers} from 'angular2/http';
//import {Observable} from 'rxjs/Rx';
import {Observable} from 'rxjs/Observable';
import {Observer} from 'rxjs/Observer';

const HEADER = {
  headers: new Headers({
    'Content-Type': 'application/json'
  })
};

@Injectable()
export class AdminService {
	private baseUrl: string = "/api/admin/";

	constructor(private _http: Http) {
		// this.progress$ = Observable.create(observer => {
  //       	this.progressObserver = observer
  //   	}).share();
	}


	getAllCourses(){
		return this._http.get(this.baseUrl + "courses", HEADER).map((res) =>{
			return res.json();
		});
	}

  getAllAdmins(data){
    return this._http.post(this.baseUrl + "adminslist", JSON.stringify(data),HEADER).map((res) =>{
			return res.json();
		});
	}

	getEditCourses(id: string){
		return this._http.post(this.baseUrl + "courses/edit", JSON.stringify({"id": id}),HEADER).map((res) =>{
			return res.json();
		});
	}

	getAllContents(){
		return this._http.get(this.baseUrl + "courses/contents", HEADER).map((res) =>{
			return res.json();
		});
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

  addAdmin(data){
		return this._http.post(this.baseUrl + "add/admin", JSON.stringify(data), HEADER)
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

  updateAdmin(data){
		return this._http.post(this.baseUrl + "edit/admin", JSON.stringify(data), HEADER)
			.map((res) => {
				return res.json();
			})
	}

	addCourse(data, flag){
		if(!flag){

			console.log("add")
			return this._http.post(this.baseUrl + "course", JSON.stringify(data), HEADER)
				.map((res) => {
				return res.json();
			})
		}else{

			console.log("edit")
			return this._http.put(this.baseUrl + "course", JSON.stringify(data), HEADER)
				.map((res) => {
				return res.json();
			})
		}
	}
	removeOrgById(list){
		return this._http.post(this.baseUrl + 'removetutor', JSON.stringify({list: list}), HEADER)
			.map((res) => {
				return res.json();
			})
	}

  removeAdminById(list){
		return this._http.post(this.baseUrl + 'removeadmin', JSON.stringify({list: list}), HEADER)
			.map((res) => {
				return res.json();
			})
	}

	removeCourseById(list){
		return this._http.post(this.baseUrl + 'removecourse', JSON.stringify({list: list}), HEADER)
			.map((res) => {
				return res.json();
			})
	}

	upload(files: File[]): Observable<any> {
		var url = this.baseUrl + 'upload';
	    return Observable.create(observer => {
			let formData: FormData = new FormData(),
				xhr: XMLHttpRequest = new XMLHttpRequest();

			for (let i = 0; i < files.length; i++) {
				formData.append("uploads", files[i], files[i].name);
			}

			xhr.onreadystatechange = () => {
				if (xhr.readyState === 4) {
				  	if (xhr.status === 200) {
				  		console.log("______________________________________________")
				  		console.log(xhr.response)
				    	observer.next(JSON.parse(xhr.response));
				    	observer.complete();
					} else {
					    observer.error(xhr.response);
				 	}
				}
			};

			xhr.open('POST', url, true);
			xhr.send(formData);
		});
	}

  changePassword(data){
    return this._http.post(this.baseUrl + 'changepassword', JSON.stringify(data), HEADER).map((res) => {
      return res.json();
		})
  }

  isValidOldPassword(data){
    return this._http.post(this.baseUrl + 'isvalidoldpwd', JSON.stringify(data), HEADER).map((res) => {
      return res.json();
		})
  }

}
