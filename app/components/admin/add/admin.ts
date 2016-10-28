import {Component} from 'angular2/core';
import {Session} from '../../../services/session';
import {ROUTER_DIRECTIVES, Router} from 'angular2/router';
import {CanActivate} from 'angular2/router';
import {AdminService} from '../../../services/admin';
import {FORM_DIRECTIVES, FormBuilder, Control, ControlGroup, Validators} from 'angular2/common';


@Component({
    selector: 'admin-add-admin',
    templateUrl: '/components/admin/add/admin.html',
    providers: [Session, AdminService],
    directives: [ROUTER_DIRECTIVES, FORM_DIRECTIVES]
})
export class AddAdmin {

    AdminForm: ControlGroup;
    firstname: Control;
    lastname: Control;
    email: Control;
    password: Control;
    submitAttempt: boolean = false;


    constructor(private _session: Session, private _adminService: AdminService, private builder: FormBuilder, private _router: Router) {
        if (this._session.getCurrentId() == null) {
            this._router.navigateByUrl('/login');
        } else {
            this.firstname = new Control('', Validators.required);
            this.lastname = new Control('', Validators.required);
            this.email = new Control('', Validators.required);
            this.password = new Control('', Validators.compose([Validators.required, Validators.minLength(6)]))

            this.AdminForm = builder.group({
                firstname: this.firstname,
                lastname: this.lastname,
                email: this.email,
                password: this.password
            })

        }
    }

    cancel() {
        this._router.navigate(['AdminMain']);
    }

    AddAdmin(form: any) {
        // this._session.login(form.username, form.password);
        this.submitAttempt = true;
        if (this.AdminForm.valid) {
            var data = {
                firstName: form.firstname,
                lastName: form.lastname,
                email: form.email,
                password: form.password,
            };

            this._adminService.addAdmin(data)
                .subscribe((res) => {
                    if (res.success) {
                        this._router.navigate(['AdminMain']);
                    }
                })
        }
    }
}
