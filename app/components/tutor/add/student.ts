import {Component, AfterViewInit} from 'angular2/core';
import {Session} from '../../../services/session';
import {ROUTER_DIRECTIVES, Router} from 'angular2/router';
import {CanActivate} from 'angular2/router';
import {TutorService} from '../../../services/tutor';
import {FORM_DIRECTIVES, FormBuilder, Control, ControlGroup, Validators} from 'angular2/common';

declare var $: JQueryStatic;

@Component({
    selector: 'tutor-add-student',
    templateUrl: '/components/tutor/add/student.html',
    providers: [Session, TutorService],
    directives: [ROUTER_DIRECTIVES, FORM_DIRECTIVES]
})
export class AddTutorStudent implements AfterViewInit {

    student: any;
    allStudentData: any;
    StudentForm: ControlGroup;
    firstName: Control;
    lastName: Control;
    username: Control;
    password: Control;
    verifiedpassword: Control;
    phone: Control;
    dob_day: Control;
    dob_month: Control;
    dob_year: Control;
    submitAttempt: boolean = false;
    showGotoBack: boolean = false;
    selectedNew: boolean = false;
    selectedMonth: number = 0;
    saving: boolean = false;
    showNotSave: boolean = false;
    months: any = ['Month', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];


    constructor(private _session: Session, private _tutorService: TutorService, private builder: FormBuilder, private _router: Router) {
        if (this._session.getCurrentId() == null) {
            this._router.navigateByUrl('/login');
        } else {
            this.student = JSON.parse(this._session.getItem('TutorStudent'));
            this.allStudentData = JSON.parse(this._session.getItem('TutorAllStudent'));

            this.firstName = new Control(this.student.firstName, Validators.required);
            this.lastName = new Control(this.student.lastName, Validators.required);
            this.username = new Control(this.student.username);
            this.phone = new Control(this.student.phone);
            this.password = new Control(this.student.hashed_pwd, Validators.compose([Validators.required, Validators.minLength(6)]))
            this.verifiedpassword = new Control(this.student.hashed_pwd, Validators.compose([Validators.required, Validators.minLength(6)]))

            let [day, month, year] = this.student.DOB.split('/');
            this.selectedMonth = Number(month);

            this.dob_day = new Control(day.trim());
            this.dob_month = new Control(month);
            this.dob_year = new Control(year.trim());

            this.StudentForm = builder.group({
                firstName: this.firstName,
                lastName: this.lastName,
                username: this.username,
                dob_day: this.dob_day,
                dob_month: this.dob_month,
                dob_year: this.dob_year,
                phone: this.phone,
                password: this.password,
                verifiedpassword: this.verifiedpassword
            })
            this.generatePassword()

        }
    }

    ngAfterViewInit() {
        $("input.datepicker").datepicker({ dateFormat: 'dd/mm/yy' });
    }

    generatePassword() {
        var pwd = this.randomString();
        if (this.student.hashed_pwd != '') return;
        (<Control>this.StudentForm.controls['password']).updateValue(pwd);
        (<Control>this.StudentForm.controls['verifiedpassword']).updateValue(pwd);
    }

    cancel() {
        this._router.navigate(['TutorMain']);
    }

    getValue(form: any) {
        if (form.firstName == "" || form.lastName == "") return '';

        var firstName = form.firstName,
            lastName = form.lastName,
            username = firstName.charAt(0).toLowerCase() + lastName.toLowerCase(),
            i = 0;

        if (this.allStudentData == null) {
            i = 0;
        } else {
            this.allStudentData.forEach((student) => {
                if (student.username.includes(username)) i++;
            })
        }
        if (i != 0) username = username + i;

        (<Control>this.StudentForm.controls['username']).updateValue(username);
    }

    getUserName(form: any) {
        var username = form.username.toLowerCase(), i = 0;
        this.allStudentData.forEach((student) => {
            if (student.username.includes(username)) i++;
        })
        if (i != 0) username = username + i;

        (<Control>this.StudentForm.controls['username']).updateValue(username);
    }

    matchedPassword(form: any) {
        var password = form.password,
            verifiedpassword = form.verifiedpassword;
        if (password == verifiedpassword) {
            return true;
        } else {
            return false;
        }

    }

    validDob(form: any) {
        if (form.dob_day == '' && Number(form.dob_month) == 0 && form.dob_year == '') return true;
        if (form.dob_day > 31) return false;
        if (form.dob_month > 12 || form.dob_month < 0) return false;
        if (form.dob_year.length < 4) return false;
        return true;
    }

    AddStudent(form: any) {
        this.submitAttempt = true;
        this.showNotSave = false;
        if (this.StudentForm.valid && this.matchedPassword(form) && this.validDob(form)) {
            console.log('submit')
            var dob = "";
            console.log(form.dob_day);

            console.log(form.dob_month);

            console.log(form.dob_year);

            if (form.dob_day == '' || Number(form.dob_day) == 0 || Number(form.dob_year) == 0 || Number(form.dob_month) == 0 || form.dob_month == '' || form.dob_year == '') {
                dob = ''
            } else {
                dob = `${form.dob_day.length == 2 ? form.dob_day : '0' + form.dob_day}/${form.dob_month.length == 2 ? form.dob_month : '0' + form.dob_month}/${form.dob_year}`
            }
            var data = {
                firstName: form.firstName,
                lastName: form.lastName,
                username: form.username,
                DOB: dob,
                hashed_pwd: form.password,
                phone: form.phone,
                isCompleted: false,
                completedAt: '',
                certificate: '',
                tutor_id: this._session.getCurrentId()
            };
            var flag = JSON.parse(this._session.getItem('editORadd'))
            if (flag.flag) data["_id"] = this.student.student_id;

            this.saving = true;
            this._tutorService.addStudent(data, flag.flag)
                .subscribe((res) => {
                    this.saving = false;
                    if (res.success) {
                        this._router.navigate(['TutorMain']);
                    }else{
                      this.showNotSave = true;
                    }
                })
        }

        console.log('cancel')
    }
    onKey(event: any) {
        var value = event.target.value;
        value = value.replace(/\D/g, '');
        (<Control>this.StudentForm.controls['phone']).updateValue(value);
    }

    beforeGotoBack(form: any) {
        if (form.firstName != this.student.firstName || form.lastName != this.student.lastName || form.username != this.student.username || form.phone != this.student.phone) {
            this.showGotoBack = true;
        } else {
            this.showGotoBack = false;
            this.cancel();
        }
    }

    isNumberKey(evt) {
        evt = (evt) ? evt : window.event;
        var charCode = (evt.which) ? evt.which : evt.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            return false;
        }
        return true;
    }

    isDayKey(evt, form: any) {
        evt = (evt) ? evt : window.event;
        var charCode = (evt.which) ? evt.which : evt.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            return false;
        }
        var val = form.dob_day == null ? '' : form.dob_day;
        if (val.length < 2) {
            val = val + (charCode - 48);
        }
        if (Number(val) > 31) return false;

        return true;
    }

    isYearKey(evt, form: any) {
        evt = (evt) ? evt : window.event;
        var charCode = (evt.which) ? evt.which : evt.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            return false;
        }
        var val = form.dob_year == null ? '' : form.dob_year;
        if (val.length < 4) {
            val = val + (charCode - 48);
        }
        if (val.length == 4) {
            if (Number(val) < 1950) return false;
        }
        if (Number(val) > (new Date()).getFullYear()) return false;

        return true;
    }

    private randomString(): string {
        var length = 8,
            chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        var result = '';
        for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
        return result;
    }

}
