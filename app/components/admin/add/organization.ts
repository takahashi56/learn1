import {Component} from 'angular2/core';
import {Session} from '../../../services/session';
import {ROUTER_DIRECTIVES, Router} from 'angular2/router';
import {CanActivate} from 'angular2/router';
import {AdminService} from '../../../services/admin';
import {FORM_DIRECTIVES, FormBuilder, Control, ControlGroup, Validators} from 'angular2/common';


@Component({
    selector: 'admin-add-organization',
    templateUrl: '/components/admin/add/organization.html',
    providers: [Session, AdminService],
    directives: [ROUTER_DIRECTIVES, FORM_DIRECTIVES]
})
export class AddOrganization {

    OrganizeForm: ControlGroup;
    firstName: Control;
    lastName: Control;
    organization: Control;
    department: Control;
    email: Control;
    phone: Control;
    password: Control;
    submitAttempt: boolean = false;


    constructor(private _session: Session, private _adminService: AdminService, private builder: FormBuilder, private _router: Router) {
        if (this._session.getCurrentId() == null) {
            this._router.navigateByUrl('/login');
        } else {
            this.firstName = new Control('', Validators.required);
            this.lastName = new Control('', Validators.required);
            this.organization = new Control('', Validators.required);
            this.email = new Control('', Validators.required);
            this.password = new Control('', Validators.compose([Validators.required, Validators.minLength(6)]))

            this.OrganizeForm = builder.group({
                firstName: this.firstName,
                lastName: this.lastName,
                organization: this.organization,
                email: this.email,
                phone: this.phone,
                department: this.department,
                password: this.password
            })

        }

    }

    cancel() {
        this._router.navigate(['AdminMain']);
    }

    AddOrgs(form: any) {
        // this._session.login(form.username, form.password);
        this.submitAttempt = true;
        if (this.OrganizeForm.valid) {
            var data = {
                firstName: form.firstName,
                lastName: form.lastName,
                organization: form.organization,
                email: form.email,
                password: form.password,
                department: form.department,
                phone: form.phone,
                employeecount: 0,
                creditcount: 0,
                subscribing: false,
            };

            this._adminService.addTutor(data)
                .subscribe((res) => {
                    if (res.success) {
                        this._router.navigate(['AdminMain']);
                    }
                })
        }
    }
}
