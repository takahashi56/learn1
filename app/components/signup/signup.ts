import {Component} from 'angular2/core';
import {Session} from '../../services/session';
import {ROUTER_DIRECTIVES, Router} from 'angular2/router';
import {CanActivate} from 'angular2/router';
import {AdminService} from '../../services/admin';
import {FORM_DIRECTIVES, FormBuilder, Control, ControlGroup, Validators} from 'angular2/common';


@Component({
	selector: 'signup',
	templateUrl: '/components/signup/signup.html',
	providers: [Session, AdminService],
	directives: [ROUTER_DIRECTIVES, FORM_DIRECTIVES],
})
export class SignUp {

	OrganizeForm: ControlGroup;
	firstName: Control;
	lastName: Control;
	organization: Control;
	email: Control;
	phone: Control;
	password: Control;
	submitAttempt: boolean = false;
	registerFailure: boolean = false;
	check_accept: boolean = false;

	constructor(private _session: Session, private _adminService: AdminService, private builder: FormBuilder, private _router: Router) {

		this.firstName = new Control('', Validators.required);
		this.lastName = new Control('', Validators.required);
		this.organization = new Control('', Validators.required);
		this.email = new Control('', Validators.required);
		this.phone = new Control('', Validators.required);
		this.password = new Control('', Validators.compose([Validators.required, Validators.minLength(6)]))

		this.OrganizeForm = builder.group({
			firstName: this.firstName,
			lastName: this.lastName,
			organization: this.organization,
			email: this.email,
			phone: this.phone,
			password: this.password
		})
	}

	isNumberKey(evt) {
			evt = (evt) ? evt : window.event;
			var charCode = (evt.which) ? evt.which : evt.keyCode;
			if (charCode > 31 && (charCode < 48 || charCode > 57)) {
					return false;
			}
			return true;
	}

	checkAccept(event){
			if(event.currentTarget.checked){
				this.check_accept = true;
			}else{
				this.check_accept = false;
			}
	}

	AddOrgs(form: any) {
		this.registerFailure = false;
		this.submitAttempt = true;
		if(this.OrganizeForm.valid && this.check_accept){
			var data = {
				firstName: form.firstName,
				lastName: form.lastName,
				organization: form.organization,
				email: form.email,
				password: form.password,
				phone: form.phone,
				employeecount: 0,
				creditcount: 0,
				subscribing: false,
			};

			this._adminService.addTutor(data)
				.subscribe((res) => {
					if(res.success){
						this._session.setUser(data.email, res.role, res._id)
						this._session.setItem('homeUrl', res.action);
						this._router.navigateByUrl('/home/tutor/main');
					}
					if(res.errmsg){
						this.registerFailure = true
					}
				})
		}
	}
}
