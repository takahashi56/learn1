import {Component} from 'angular2/core';
import {Session} from '../../services/session';
import {ROUTER_DIRECTIVES} from 'angular2/router';
import {CanActivate} from 'angular2/router';
import {AuthService} from '../../services/authentication';
import {FORM_DIRECTIVES, FormBuilder, Control, ControlGroup, Validators} from 'angular2/common';

@Component({
    selector: 'forget-pwd',
    templateUrl: '/components/forgetpwd/forgetpwd.html',
    providers: [Session, AuthService],
    directives: [ROUTER_DIRECTIVES, FORM_DIRECTIVES]
})
export class Forgetpwd {
    ForgetpwdForm: ControlGroup;
    email: Control;
    sentStatus: string = "";
    sentShow: boolean = false;
    showClass: string = "";
    submitAttempt: boolean = false;
    button_name: string;

    constructor(private _session: Session, private _adminService: AuthService, private builder: FormBuilder) {
        this.sentShow = false;
        this.sentStatus = "";
        this.email = new Control('', Validators.required);
        this.button_name = 'Reset';

        this.ForgetpwdForm = builder.group({
            email: this.email,
        })
    }

    doLogin(form: any) {
        // this._session.login(form.username, form.password);
    }

    Forgetpwd(form: any) {
        this.submitAttempt = true;

        if (this.ForgetpwdForm.valid) {
            this._adminService.forgetpwd({ email: form.email }).subscribe((res) => {
                this.sentShow = true;
                if (res.success) {
                    this.showClass = "alert alert-success alert-dismissable";
                    this.sentStatus = `An email containing instructions to reset your password has been sent to ${form.email}.
														\n
														if you did not receive the email, please contact us to recover your account.`;

                    // this._session.setUser(form.email, null, "");
                    this._session.setItem('forget_user', form.email);
                    this.button_name = 'Sent';
                } else if (res.success == false && res.status != 500) {
                    this.showClass = "alert alert-danger alert-dismissable";
                    this.sentStatus = "This email was not sent. Please type the email correctly!";
                } else if (res.status == 500 && res.success == false) {
                    this.showClass = "alert alert-danger alert-dismissable";
                    this.sentStatus = "You tried to send to a recipient that has been marked as inactive. Please type the email correctly!";
                }
            })
        }
    }
}
