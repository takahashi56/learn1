import {Component} from 'angular2/core';
import {Session} from '../../services/session';
import {ROUTER_DIRECTIVES, Router} from 'angular2/router';
import {AuthService} from '../../services/authentication';
import {FORM_DIRECTIVES, FormBuilder, Control, ControlGroup, Validators} from 'angular2/common';
import {Home} from '../home/home';

@Component({
	selector: 'login',
	templateUrl: '/components/login/login.html',
	providers: [Session,AuthService],
	directives: [ROUTER_DIRECTIVES, FORM_DIRECTIVES, Home]
})
export class Login {
	actionPath: string = "";
	text: string = "";

	LoginForm: ControlGroup;
	username: Control;
	password: Control;
	submitAttempt: boolean = false;
	authFailure: boolean = false;

	constructor(private _session: Session, private _authService: AuthService, private _router: Router, private builder: FormBuilder) {
		console.log('in the constructor');
		this.actionPath = "";
		this.text = "";

		this.username = new Control('', Validators.required);
		this.password = new Control('', Validators.compose([Validators.required, Validators.minLength(6)]))

		this.LoginForm = builder.group({
			username: this.username,
			password: this.password
		})
	}

	doLogin(form: any) {
		this.authFailure = false;
		this.submitAttempt = true;
		if (this.LoginForm.valid) {
			var data = {
				username: form.username,
				password: form.password
			}
			this._authService.Login(data)
				.subscribe((res) => {
					console.log(res);
					if (res.success) {
						this._session.setUser(data.username, res.role, res._id)
						this._session.setItem('homeUrl', res.action);
						if(res.role == 2){
							this._session.setItem('MainStudentId', res.id);
						}
						if(res.role == 1){
							this._session.setItem("organization", res.organization);
						}
						console.log(res.action);
						// this._router.navigate(['Home']);
						console.log(this._router);
						this._router.navigateByUrl('/home');
					}else{
						this.authFailure = true;
					}
				});
		}
	}
}
