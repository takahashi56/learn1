import {Component} from 'angular2/core';
import {Session} from '../../../services/session';
import {ROUTER_DIRECTIVES, Router} from 'angular2/router';
import {CanActivate} from 'angular2/router';
import {AdminService} from '../../../services/admin';
import {FORM_DIRECTIVES, FormBuilder, Control, ControlGroup, Validators} from 'angular2/common';

@Component({
    selector: 'admin-edit-organization',
    templateUrl: '/components/admin/edit/organization.html',
    providers: [Session, AdminService],
    directives: [ROUTER_DIRECTIVES, FORM_DIRECTIVES]
})
export class EditOrganization {

    OrganizeForm: ControlGroup;
    firstName: Control;
    lastName: Control;
    organization: Control;
    department: Control;
    email: Control;
    phone: Control;
    password: Control;
    notes: Control;
    submitAttempt: boolean = false;
    org: any;

    constructor(private _session: Session, private _adminService: AdminService, private builder: FormBuilder, private _router: Router) {
        if (this._session.getCurrentId() == null) {
            this._router.navigateByUrl('/login');
        } else {

            this.org = JSON.parse(this._session.getItem('org'));
            this.firstName = new Control(this.org.firstName, Validators.required);
            this.lastName = new Control(this.org.lastName, Validators.required);
            this.organization = new Control(this.org.organization, Validators.required);
            this.email = new Control(this.org.email, Validators.required);
            this.password = new Control('', Validators.compose([Validators.required, Validators.minLength(6)]))
            this.phone = new Control(this.org.phone);
            this.notes = new Control(this.org.notes);
            this.department = new Control(this.org.department);

            this.OrganizeForm = builder.group({
                firstName: this.firstName,
                lastName: this.lastName,
                organization: this.organization,
                email: this.email,
                phone: this.phone,
                department: this.department,
                password: this.password,
                notes: this.notes
            })
        }
    }
    cancel() {
        this._router.navigate(['AdminMain']);
    }
    
    isValidPassword(password: string) {
      if(password == '') return true;
      if(password.length > 5) return true;
      return false;
    }

    isNumberKey(evt) {
        evt = (evt) ? evt : window.event;
        var charCode = (evt.which) ? evt.which : evt.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            return false;
        }
        return true;
    }

    update(form: any) {
        this.submitAttempt = true;
        if (form.firstName != this.org.firstName || form.lastName != this.org.lastName || this.isValidPassword(form.password) || form.email != this.org.email || form.organization != this.org.organization || form.phone != this.org.phone || form.department != this.org.department || form.notes != this.org.notes) {
            var data = {
                _id: this.org.id,
                firstName: form.firstName,
                lastName: form.lastName,
                organization: form.organization,
                email: form.email,
                password: form.password,
                department: form.department,
                phone: form.phone,
                notes: form.notes
            };

            this._adminService.updateTutor(data)
                .subscribe((res) => {
                    if (res.success) {
                        this._router.navigate(['AdminMain']);
                    }
                })
        }
    }
}
