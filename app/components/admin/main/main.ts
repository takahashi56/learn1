import {Component, OnInit} from 'angular2/core';
import {Session} from '../../../services/session';
import {ROUTER_DIRECTIVES, Router} from 'angular2/router';
import {CanActivate} from 'angular2/router';
import {AdminService} from '../../../services/admin';
import {FORM_DIRECTIVES, FormBuilder, Control, ControlGroup, Validators} from 'angular2/common';

@Component({
    selector: 'admin-main',
    templateUrl: '/components/admin/main/main.html',
    providers: [Session, AdminService],
    directives: [ROUTER_DIRECTIVES, FORM_DIRECTIVES],
})
export class Main implements OnInit {

    courseList: any = [];
    orgList: any = [];
    adminList: any = [];
    coursesData: any = [];
    lessonsData: any = [];
    contentsData: any = [];
    selectOrg: any = [];
    selectCourse: any = [];
    selectAdmin: any = [];
    showRemoveOrg: boolean = false;
    showRemoveCourse: boolean = false;
    showRemoveAdmin: boolean = false;
    admin_id: string;

    SettingForm: ControlGroup;
    newpwd: Control;
    oldpwd: Control;
    newpwdconfirm: Control;
    validateoldconfirm: boolean = false;
    validatenewconfirm: boolean = false;
    changeSuccess: boolean = false;
    showAlert: boolean = false;
    validOldPassword: boolean = true;
    matchedTrue: boolean = false;
    failure: string = '';

    course_tab: string = '';
    org_tab: string = '';
    admin_tab: string = '';
    select_tab_item: number = 1;

    constructor(private _session: Session, private _adminService: AdminService, private _router: Router, private builder: FormBuilder) {
        // var admin_id = this._session.getCurrentId(), role=this._session.getCurrentRole();

        // if(admin_id == '' || parseInt(role) != 0){
        // 	this._router.navigate(['Login']);
        // }
        this.admin_id = this._session.getCurrentId();

        if (this.admin_id == null) {
            this._router.navigateByUrl('/home');
        } else {
            this._adminService.getAllCourses().subscribe((res) => {
                this.courseList = res;
            });

            this._adminService.getAllOrgs().subscribe((res) => {
                this.orgList = res;
            })

            this._adminService.getAllAdmins({ admin_id: this.admin_id }).subscribe((res) => {
                this.adminList = res;
            })

            this.oldpwd = new Control('', Validators.compose([Validators.required, Validators.minLength(6)]));
            this.newpwd = new Control('', Validators.compose([Validators.required, Validators.minLength(6)]));
            this.newpwdconfirm = new Control('', Validators.compose([Validators.required, Validators.minLength(6)]));

            this.SettingForm = builder.group({
                newpwd: this.newpwd,
                newpwdconfirm: this.newpwdconfirm,
                oldpwd: this.oldpwd
            })

            if (this._session.getItem('select_tab') == null) {
                this.onTabClick(1);
            } else {
                this.onTabClick(Number(this._session.getItem('select_tab')));
            }
        }

    }

    editCourse(course: any) {
        var lessons = [];
        this._adminService.getEditCourses(course.course_id).subscribe((res) => {
            this._session.setItem('editORadd', JSON.stringify({ flag: true }));
            console.log('abc')
            console.log(JSON.parse(this._session.getItem('Course')));
            var course = JSON.parse(this._session.getItem('Course'));
            console.log('dbd')
            if(course == null){
              this._session.setItem('Course', JSON.stringify(res));
            }else if(course.course_id == res.course_id){
              this._session.setItem('Course', JSON.stringify(course));
            }
            this._router.navigate(['AdminAddCourse']);
        })
    }

    gotoEdit(org: any) {
        this._session.setItem('org', JSON.stringify(org));
        this._router.navigate(['AdminEditOrganization']);
    }

    gotoEditAdmin(admin: any) {
        this._session.setItem('admin', JSON.stringify(admin));
        this._router.navigate(['AdminEditAdmin']);
    }

    ngOnInit() {

    }

    gotoAddCourse() {
        var data = {
            course_id: Date.now(),
            coursetitle: '',
            coursedescription: '',
            lesson: [],
        }
        this._session.setItem('editORadd', JSON.stringify({ flag: false }));
        this._session.setItem('Course', JSON.stringify(data));

        this._router.navigate(['AdminAddCourse']);
    }

    removeCourse() {
        if (this.selectCourse.length == 0) return false;
        this.showRemoveCourse = false;
        this._adminService.removeCourseById(this.selectCourse).subscribe((res) => {
            this.selectCourse.map((id) => {
                this.courseList = this.courseList.filter((course) => {
                    return course.course_id != id;
                })
            })
            this.selectCourse = [];
        })
    }

    removeOrg() {
        if (this.selectOrg.length == 0) return false;
        this.showRemoveOrg = false;
        this._adminService.removeOrgById(this.selectOrg).subscribe((res) => {
            this.selectOrg.map((id) => {
                this.orgList = this.orgList.filter((org) => {
                    return org.id != id;
                })
            })
            this.selectOrg = [];
        })


    }

    removeAdmin() {
        if (this.selectAdmin.length == 0) return false;
        this.showRemoveAdmin = false;
        this._adminService.removeAdminById(this.selectAdmin).subscribe((res) => {
            if (res.success == false) {
                return;
            }
            else {
                this.selectAdmin.map((id) => {
                    this.adminList = this.adminList.filter((admin) => {
                        return admin._id != id;
                    })
                })
                this.selectAdmin = [];
            }
        })
    }

    checkCourse(event, object) {
        if (event.currentTarget.checked) {
            this.selectCourse.push(object.course_id);
        } else {
            this.selectCourse = this.selectCourse.filter((o) => {
                return o != object.course_id;
            })
        }
    }


    checkOrganization(event, object) {
        if (event.currentTarget.checked) {
            this.selectOrg.push(object.id);
        } else {
            this.selectOrg = this.selectOrg.filter(function(o) {
                return o != object.id;
            })
        }
    }

    checkAdmin(event, object) {
        if (event.currentTarget.checked && this.admin_id != object._id) {
            this.selectAdmin.push(object._id);
        } else {
            this.selectAdmin = this.selectAdmin.filter(function(o) {
                return o != object._id;
            })
        }
    }

    beforeRemoveOrg() {
        if (this.selectOrg.length == 0) {
            this.showRemoveOrg = false;
            return false;
        }
        this.showRemoveOrg = true;
    }

    beforeRemoveAdmin() {
        if (this.selectAdmin.length == 0) {
            this.showRemoveAdmin = false;
            return false;
        }
        this.showRemoveAdmin = true;
    }

    beforeRemoveCourse() {
        if (this.selectCourse.length == 0) {
            this.showRemoveCourse = false;
            return false;
        }
        this.showRemoveCourse = true;
    }


    matchedPassword(form: any) {
        var password = form.newpwd,
            verifiedpassword = form.newpwdconfirm;
        if (password == verifiedpassword) {
            this.matchedTrue = true;
            return true;
        } else {
            this.matchedTrue = false;
            return false;
        }
    }

    ChangePassowrd(form: any) {
        if (form.oldpwd == "" || form.oldpwd == null || this.validOldPassword == true) {
            this.validateoldconfirm = true;
            return;
        }
        this.validatenewconfirm = true;
        if (this.SettingForm.valid && !this.matchedTrue) {
            this.showAlert = true;
            this.changeSuccess = false;
            this.failure = 'The Password Must Be Matched';
        }

        if (this.SettingForm.valid && this.matchedTrue) {
            var newPwd = form.newpwd;
            this._adminService.changePassword({ admin_id: this.admin_id, pwd: newPwd }).subscribe((res) => {
                this.showAlert = true;
                if (res.success) {
                    this.changeSuccess = true;
                } else {
                    this.changeSuccess = false;
                    this.failure = 'Your update have been failed.';
                }
            });
        }
    }

    blurChange(form: any) {
        var oldPwd = form.oldpwd;
        this.isValidOldPassword(oldPwd);
    }

    onKey(event: any) {
        if (event.keyCode !== 13) return;
        var value = event.target.value;
        this.isValidOldPassword(value);
    }

    isValidOldPassword(pwd: string) {
        this.validateoldconfirm = true;
        this._adminService.isValidOldPassword({ admin_id: this.admin_id, pwd: pwd }).subscribe((res) => {
            if (res.success) {
                this.validOldPassword = false;
            } else {
                this.validOldPassword = true;
                this.validateoldconfirm = false;
            }
        })
    }

    cancel(form: any) {
        (<Control>this.SettingForm.controls['oldpwd']).updateValue('');
        (<Control>this.SettingForm.controls['newpwd']).updateValue('');
        (<Control>this.SettingForm.controls['newpwdconfirm']).updateValue('');
    }

    getCompleteDate(date){
        if (date == null || date == '') return '';

        var d = new Date(date),
            day = d.getDate().toString().length == 1 ? '0' + d.getDate() : d.getDate(),
            month = (d.getMonth() + 1 ).toString().length == 1 ? '0' + (d.getMonth() + 1 ) : (d.getMonth() + 1 ),
                datestring = day  + "/" + month + "/" + d.getFullYear();

        return datestring;
    }


    check(control: any) {
    }

    onTabClick(num: number) {
        this.course_tab = "tab-pane";
        this.org_tab = "tab-pane";
        this.admin_tab = "tab-pane";
        this._session.setItem('select_tab', num);
        this.select_tab_item = num;

        switch (num) {
            case 1:
                this.course_tab = "tab-pane active";
                break;
            case 2:
                this.org_tab = "tab-pane active";
                break;
            case 3:
                this.admin_tab = "tab-pane active";
                break;
            default:
                break;
        }
    }
}
