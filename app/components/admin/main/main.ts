import {Component, OnInit} from 'angular2/core';
import {Session} from '../../../services/session';
import {ROUTER_DIRECTIVES, Router} from 'angular2/router';
import {CanActivate} from 'angular2/router';
import {AdminService} from '../../../services/admin';

@Component({
	selector: 'admin-main',
	templateUrl: '/components/admin/main/main.html',
	providers: [Session, AdminService],
	directives: [ROUTER_DIRECTIVES],
})
export class Main{

	courseList: any = [];
	orgList: any = [];

	constructor(private _session: Session, private _adminService: AdminService, private _router: Router) {
		console.log('in the constructor');
		this.courseList = this._adminService.getAllCourses(); 
		this._adminService.getAllOrgs().subscribe((res)=>{
			this.orgList = res;	
		})
	}

	gotoEdit(org: any){
		this._session.setItem('org', JSON.stringify(org));
		this._router.navigate(['AdminEditOrganization']);
	}

	ngOnInit(){
		
	}

	doLogin(form: any) {
		
	}
}