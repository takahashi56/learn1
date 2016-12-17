import {Component} from 'angular2/core';
import {Session} from '../../../services/session';
import {ROUTER_DIRECTIVES, Router} from 'angular2/router';
import {CanActivate} from 'angular2/router';
import {AdminService} from '../../../services/admin';
import {FORM_DIRECTIVES, FormBuilder, Control, ControlGroup, Validators} from 'angular2/common';

@Component({
    selector: 'admin-edit-admin',
    templateUrl: '/components/admin/edit/admin.html',
    providers: [Session, AdminService],
    directives: [ROUTER_DIRECTIVES, FORM_DIRECTIVES]
})
export class EditAdmin {

    AdminForm: ControlGroup;
    firstName: Control;
    lastName: Control;
    email: Control;
    password: Control;
    submitAttempt: boolean = false;
    admin: any;
    showNotSave: boolean = false;

    constructor(private _session: Session, private _adminService: AdminService, private builder: FormBuilder, private _router: Router) {
        if (this._session.getCurrentId() == null) {
            this._router.navigateByUrl('/login');
        } else {
            this.admin = JSON.parse(this._session.getItem('admin'));

            this.firstName = new Control(this.admin.firstName, Validators.required);
            this.lastName = new Control(this.admin.lastName, Validators.required);
            this.email = new Control(this.admin.email, Validators.required);
            this.password = new Control('', Validators.compose([Validators.required, Validators.minLength(6)]))

            this.AdminForm = builder.group({
                firstName: this.firstName,
                lastName: this.lastName,
                email: this.email,
                password: this.password
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

    update(form: any) {
        this.submitAttempt = true;
        this.showNotSave = false;
        if (form.firstName != this.admin.firstName || form.lastName != this.admin.lastName || form.email != this.admin.email || this.isValidPassword(form.password)) {
            var data = {
                _id: this.admin._id,
                firstName: form.firstName,
                lastName: form.lastName,
                email: form.email,
                password: form.password,
            };

            this._adminService.updateAdmin(data)
                .subscribe((res) => {
                    if (res.success) {
                        if(data._id == this._session.getCurrentId()){
                          this._session.setItem('username', data.firstName + ' ' + data.lastName);
                        }
                        this._router.navigate(['AdminMain']);
                    }else{
                      this.showNotSave = true;
                    }
                })
        }
    }
}
