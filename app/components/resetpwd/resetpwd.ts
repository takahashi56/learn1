import {Component} from 'angular2/core';
import {Session} from '../../services/session';
import {ROUTER_DIRECTIVES, Router} from 'angular2/router';
import {CanActivate} from 'angular2/router';
import {AuthService} from '../../services/authentication';
import {FORM_DIRECTIVES, FormBuilder, Control, ControlGroup, Validators} from 'angular2/common';

@Component({
	selector: 'reset-pwd',
	templateUrl: '/components/resetpwd/resetpwd.html',
	providers: [Session,AuthService],
	directives: [ROUTER_DIRECTIVES,FORM_DIRECTIVES]
})
export class Resetpwd {
	ResetpwdForm: ControlGroup;
	password: Control;
  verfiedPassword: Control;
	submitAttempt: boolean = false;
  matched: boolean = false;
	show_class: string = '';
	show_string: string = '';
	length_6: boolean = false;


	constructor(private _session: Session, private _adminService: AuthService, private builder: FormBuilder, private _router: Router) {
		var email = this._session.getItem('forget_user');

		if(email == null){
			this._router.navigate(['Login']);
		}else{
			this.password = new Control('', Validators.required);
			this.verfiedPassword = new Control('', Validators.required);
			this.show_class ="alert alert-info alert-dismissable";
			this.show_string = "Enter your new password and log in again!";
			this.length_6 = false;

			this.ResetpwdForm = builder.group({
				password: this.password,
				verfiedPassword: this.verfiedPassword,
			})
		}
	}

  matchedPassword(form: any){
    var password = form.password,
			verifiedpassword = form.verfiedPassword;
		if(password == verifiedpassword){
      console.log('true');
      this.matched = true;
			return true;
		}else{
      console.log('false');
      this.matched = false;
			return false;
		}
  }

	Resetpwd(form: any){
		this.submitAttempt = true;
		this.length_6 = false;

		if(form.password.length < 6 || form.verfiedPassword.length < 6){
			this.show_class = "alert alert-danger alert-dismissable";
			this.show_string = "The Password Must be At Least 6 characters!";
			this.length_6 = true;
			return;
		}

		if(this.matched == false){
			this.show_class = "alert alert-danger alert-dismissable";
			this.show_string = "The Password Must be Matched!";
			return;
		}

		if(this.ResetpwdForm.valid && this.matched){
      console.log('valid');
      var email = this._session.getItem('forget_user');
      console.log(email);
			this._adminService.resetpwd({password: form.password, email: email}).subscribe((res) => {
				if(res.success){
					localStorage.clear();
          this._router.navigateByUrl("/login");
				}
			})
		}
	}
}
