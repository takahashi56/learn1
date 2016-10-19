import {Component} from 'angular2/core';
import {Session} from '../../../services/session';
import {ROUTER_DIRECTIVES, Router} from 'angular2/router';
import {CanActivate} from 'angular2/router';
import {AdminService} from '../../../services/admin';
import {FORM_DIRECTIVES, FormBuilder, Control, ControlGroup, Validators} from 'angular2/common';

@Component({
	selector: 'admin-edit-admin',
	templateUrl: '/components/admin/edit/admin.html',
	providers: [Session,AdminService],
	directives: [ROUTER_DIRECTIVES, FORM_DIRECTIVES]
})
export class EditAdmin {

	AdminForm: ControlGroup;
	firstname: Control;
	lastname: Control;
	email: Control;
	password: Control;
	submitAttempt: boolean = false;
	admin: any;

	constructor(private _session: Session, private _adminService: AdminService, private builder: FormBuilder, private _router: Router) {
		console.log('in the constructor');

		this.admin = JSON.parse(this._session.getItem('admin'));
    console.log(this.admin);

		this.firstname = new Control(this.admin.firstName, Validators.required);
		this.lastname = new Control(this.admin.lastName, Validators.required);
		this.email = new Control(this.admin.email, Validators.required);
		this.password = new Control('', Validators.compose([Validators.required, Validators.minLength(6)]))

		this.AdminForm = builder.group({
			firstname: this.firstname,
			lastname: this.lastname,
			email: this.email,
			password: this.password
		})
	}
	cancel(){
		this._router.navigate(['AdminMain']);
	}

	update(form: any) {
		this.submitAttempt = true;
		if(this.AdminForm.valid){
			var data = {
				_id: this.admin._id,
				firstname: form.firstname,
				lastname: form.lastname,
				email: form.email,
				password: form.password,
			};

			this._adminService.updateAdmin(data)
				.subscribe((res) => {
					console.log(res.success);
					if(res.success){
						this._router.navigate(['AdminMain']);
					}
				})
		}
	}
}
