import {Component} from 'angular2/core';
import {Session} from '../../services/session';
import {ROUTER_DIRECTIVES} from 'angular2/router';
import {CanActivate} from 'angular2/router';
import {AuthService} from '../../services/authentication';
import {FORM_DIRECTIVES, FormBuilder, Control, ControlGroup, Validators} from 'angular2/common';

@Component({
	selector: 'forget-pwd',
	templateUrl: '/components/forgetpwd/forgetpwd.html',
	providers: [Session,AuthService],
	directives: [ROUTER_DIRECTIVES,FORM_DIRECTIVES]
})
export class Forgetpwd {
	ForgetpwdForm: ControlGroup;
	email: Control;
	sentStatus: string = "";
	sentShow: boolean = false;
	showClass: string="";
	submitAttempt: boolean = false;

	constructor(private _session: Session, private _adminService: AuthService, private builder: FormBuilder) {
		console.log('in the constructor');
		this.sentShow = false;
		this.sentStatus = "";
		this.email = new Control('', Validators.required);

		this.ForgetpwdForm = builder.group({
			email: this.email,
		})
	}

	doLogin(form: any) {
		// this._session.login(form.username, form.password);
	}

	Forgetpwd(form: any){
		this.submitAttempt = true;

		if(this.ForgetpwdForm.valid){
			this._adminService.forgetpwd({email: form.email}).subscribe((res) => {
				this.sentShow =  true;
				if(res.success){
					this.showClass = "alert alert-success alert-dismissable";
					this.sentStatus = "This email was sent. You can check your email";
					this._session.setUser(form.email, 0, "");
					this._session.setItem('forget_user', form.email);
				}else if(res.success ){
					this.showClass = "alert alert-danger alert-dismissable";
					this.sentStatus = "This email was not sent. Please type the email correctly!";
				}
			})
		}
	}
}
