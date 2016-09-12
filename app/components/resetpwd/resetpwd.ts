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

	constructor(private _session: Session, private _adminService: AuthService, private builder: FormBuilder, private _router: Router) {
		console.log('in the constructor');

		this.password = new Control('', Validators.required);
    this.verfiedPassword = new Control('', Validators.required);

		this.ResetpwdForm = builder.group({
			password: this.password,
      verfiedPassword: this.verfiedPassword,
		})
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

		if(this.ResetpwdForm.valid && this.matched){
      console.log('valid');
      var email = this._session.getCurrentUser();
      console.log(email);
			this._adminService.resetpwd({password: form.password, email: email.username}).subscribe((res) => {
				if(res.success){
          this._router.navigateByUrl("/login");
				}
			})
		}
	}
}
