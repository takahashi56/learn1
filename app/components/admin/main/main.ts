import {Component, OnInit} from 'angular2/core';
import {Session} from '../../../services/session';
import {ROUTER_DIRECTIVES, Router} from 'angular2/router';
import {CanActivate} from 'angular2/router';
import {AdminService} from '../../../services/admin';
import {FORM_DIRECTIVES, FormBuilder, Control, ControlGroup, Validators} from 'angular2/common';

@Component({
	selector: 'admin-main',
	templateUrl: '/components/admin/main/main.html',
	providers: [Session, AdminService],
	directives: [ROUTER_DIRECTIVES, FORM_DIRECTIVES],
})
export class Main implements OnInit {

	courseList: any = [];
	orgList: any = [];
	adminList: any = [];
	coursesData: any = [];
	lessonsData: any = [];
	contentsData: any = [];
	selectOrg: any = [];
	selectCourse: any = [];
	selectAdmin: any = [];
	showRemoveOrg: boolean = false;
	showRemoveCourse: boolean = false;
	showRemoveAdmin: boolean = false;
	admin_id: string;

	SettingForm: ControlGroup;
	newpwd: Control;
	oldpwd: Control;
	newpwdconfirm: Control;
	validateoldconfirm: boolean = false;
	validatenewconfirm: boolean = false;
	changeSuccess: boolean = false;
	showAlert: boolean = false;
	validOldPassword: boolean = true;

	constructor(private _session: Session, private _adminService: AdminService, private _router: Router, private builder: FormBuilder) {
		// var admin_id = this._session.getCurrentId(), role=this._session.getCurrentRole();

		// if(admin_id == '' || parseInt(role) != 0){
		// 	this._router.navigate(['Login']);
		// }
		this.admin_id = this._session.getCurrentId();

		this._adminService.getAllCourses().subscribe((res) => {
			this.courseList = res;
		});

		this._adminService.getAllOrgs().subscribe((res)=>{
			this.orgList = res;
		})

		this._adminService.getAllAdmins({admin_id: this.admin_id}).subscribe((res)=>{
			this.adminList = res;
		})

		this.oldpwd = new Control('', Validators.compose([Validators.required, Validators.minLength(6)]));
		this.newpwd = new Control('', Validators.compose([Validators.required, Validators.minLength(6)]));
		this.newpwdconfirm = new Control('', Validators.compose([Validators.required, Validators.minLength(6)]));

		this.SettingForm = builder.group({
			newpwd: this.newpwd,
			newpwdconfirm: this.newpwdconfirm,
			oldpwd: this.oldpwd
		})
	}

	editCourse(course: any){
		var lessons = [];
		console.log(course.course_id);
		this._adminService.getEditCourses(course.course_id).subscribe((res) => {
			this._session.setItem('editORadd', JSON.stringify({flag: true}));
			this._session.setItem('Course', JSON.stringify(res));
			this._router.navigate(['AdminAddCourse']);
		})
	}

	gotoEdit(org: any){
		this._session.setItem('org', JSON.stringify(org));
		this._router.navigate(['AdminEditOrganization']);
	}

	gotoEditAdmin(admin: any){
		this._session.setItem('admin', JSON.stringify(admin));
		this._router.navigate(['AdminEditAdmin']);
	}

	ngOnInit(){

	}

	gotoAddCourse(){
		var data = {
			course_id: Date.now(),
			coursetitle: '',
			coursedescription: '',
			lesson: [],
		}
		this._session.setItem('editORadd', JSON.stringify({flag: false}));
		this._session.setItem('Course', JSON.stringify(data));

		this._router.navigate(['AdminAddCourse']);
	}

	removeCourse(){
		if(this.selectCourse.length == 0) return false;
		let instance = this;
		console.log(this.selectCourse);
		this.showRemoveCourse = false;
		this._adminService.removeCourseById(this.selectCourse).subscribe((res)=>{
			instance.selectCourse.map((id) => {
				instance.courseList = instance.courseList.filter((course) => {
					return course.course_id != id;
				})
			})
		})
	}

	removeOrg(){
		if(this.selectOrg.length == 0) return false;
		let instance = this;
		console.log(this.selectOrg);
		this.showRemoveOrg = false;
		this._adminService.removeOrgById(this.selectOrg).subscribe((res)=>{
			instance.selectOrg.map(function(id){
				instance.orgList = instance.orgList.filter(function(org){
					return org.id != id;
				})
			})
		})

	}

	removeAdmin(){
		if(this.selectAdmin.length == 0) return false;
		let instance = this;
		console.log(this.selectAdmin);
		this.showRemoveAdmin = false;
		this._adminService.removeAdminById(this.selectAdmin).subscribe((res)=>{
			instance.selectAdmin.map(function(id){
				instance.adminList = instance.adminList.filter(function(admin){
					return admin.id != id;
				})
			})
		})

	}

	checkCourse(event, object){
		console.log(event.currentTarget.checked);
		console.log(`coures  = ${JSON.stringify(object)}`);

		if(event.currentTarget.checked){
			this.selectCourse.push(object.course_id);
		}else{
			this.selectCourse = this.selectCourse.filter((o) => {
				return o != object.course_id;
			})
		}
		console.log(this.selectCourse);
	}


	checkOrganization(event, object){
		console.log(event.currentTarget.checked);

		if(event.currentTarget.checked){
			this.selectOrg.push(object.id);
		}else{
			this.selectOrg = this.selectOrg.filter(function(o){
				return o != object.id;
			})
		}
		console.log(this.selectOrg);
	}

	checkAdmin(event, object){
		console.log(event.currentTarget.checked);

		if(event.currentTarget.checked){
			this.selectAdmin.push(object.id);
		}else{
			this.selectAdmin = this.selectAdmin.filter(function(o){
				return o != object.id;
			})
		}
		console.log(this.selectAdmin);
	}

	beforeRemoveOrg(){
		if(this.selectOrg.length == 0){
			this.showRemoveOrg = false;
			return false;
		}
		this.showRemoveOrg = true;
	}

	beforeRemoveAdmin(){
		if(this.selectAdmin.length == 0){
			this.showRemoveAdmin = false;
			return false;
		}
		this.showRemoveAdmin = true;
	}

	beforeRemoveCourse(){
		if(this.selectCourse.length == 0){
			this.showRemoveCourse = false;
			return false;
		}
		this.showRemoveCourse = true;
	}


	matchedPassword(form: any){
		var password = form.newpwd,
			verifiedpassword = form.newpwdconfirm;
		if(password == verifiedpassword){
			return true;
		}else{
			return false;
		}
	}

	ChangePassowrd(form: any){
		if(form.oldpwd == "" || form.oldpwd == null || this.validOldPassword == true){
			this.validateoldconfirm = true;
			return;
		}
		this.validatenewconfirm = true;
		console.log("abc")
		if(this.SettingForm.valid){
			var newPwd = form.newpwd;
			console.log("abc")
			this._adminService.changePassword({admin_id: this.admin_id, pwd: newPwd}).subscribe((res) => {
				this.showAlert = true;
				if(res.success){
					this.changeSuccess = true;
				}else{
					this.changeSuccess = false;
				}
			});
		}
	}

	blurChange(form: any){
		var oldPwd = form.oldpwd;
		this.isValidOldPassword(oldPwd);
		console.log(oldPwd)
	}

	onKey(event: any){
		if(event.keyCode !== 13) return;
		var value = event.target.value;
		console.log(value);
		this.isValidOldPassword(value);
	}

	isValidOldPassword(pwd: string){
		this.validateoldconfirm = true;
		this._adminService.isValidOldPassword({admin_id: this.admin_id, pwd: pwd}).subscribe((res)=>{
			if(res.success){
				this.validOldPassword = false;
			}else{
				this.validOldPassword = true;
				this.validateoldconfirm = false;
			}
		})
	}

	cancel(form: any){
		(<Control>this.SettingForm.controls['oldpwd']).updateValue('');
		(<Control>this.SettingForm.controls['newpwd']).updateValue('');
		(<Control>this.SettingForm.controls['newpwdconfirm']).updateValue('');
	}
}
