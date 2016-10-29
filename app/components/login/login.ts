import {Component} from 'angular2/core';
import {Session} from '../../services/session';
import {ROUTER_DIRECTIVES, Router} from 'angular2/router';
import {AuthService} from '../../services/authentication';
import {FORM_DIRECTIVES, FormBuilder, Control, ControlGroup, Validators} from 'angular2/common';
import {Home} from '../home/home';
declare var $: JQueryStatic;

@Component({
    selector: 'login',
    templateUrl: '/components/login/login.html',
    providers: [Session, AuthService],
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
    remember_me: boolean = false;

    constructor(private _session: Session, private _authService: AuthService, private _router: Router, private builder: FormBuilder) {
        this.actionPath = "";
        this.text = "";

        var username = _session.getCurrentUsername(), role = _session.getCurrentRole(), id = _session.getCurrentId();

        if (username != null && role != null && id != null) {
            var url = _session.getItem('homeUrl');
            this._router.navigateByUrl('/home');
        } else {
            this.username = new Control('', Validators.required);
            this.password = new Control('', Validators.compose([Validators.required, Validators.minLength(6)]))

            this.LoginForm = builder.group({
                username: this.username,
                password: this.password
            })
						this.remember_me = JSON.parse(this._session.getItem('remember_me'));
						if(this.remember_me == true){
							(<Control>this.LoginForm.controls['username']).updateValue(this._session.getItem('usrname'));
							(<Control>this.LoginForm.controls['password']).updateValue(this._session.getItem('pass'));
						}
        }
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
                    if (res.success) {
                        this._session.setUser(res.name, res.role, res._id)
                        this._session.setItem('homeUrl', res.action);
                        if (res.role == 2) {
                            this._session.setItem('MainStudentId', res.id);
                            this._session.setItem('CourseCount', res.count);
                        }
                        if (res.role == 1) {
                            this._session.setItem("organization", res.organization);
                            this._session.setItem("creditcount", res.creditcount);
                            this._session.setItem("employeecount", res.employeecount);
                            this._session.setItem("stripe_publish_key", res.stripe_publish_key);
                        }
                        this._router.navigateByUrl('/home');
                    } else {
                        this.authFailure = true;
                    }
                });
        }
    }

    onClickRemember(remember_me) {
        if (this.remember_me == false) {
						this._session.setItem('usrname', $('#username').val())
						this._session.setItem('pass', $('#pass').val());
						this._session.setItem('remember_me', !this.remember_me)
        } else {
					this._session.setItem('usrname','')
					this._session.setItem('pass', '');
					this._session.setItem('remember_me', false)
        }
    }
}
