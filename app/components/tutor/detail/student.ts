import {Component, AfterViewInit} from 'angular2/core';
import {Session} from '../../../services/session';
import {ROUTER_DIRECTIVES, Router} from 'angular2/router';
import {CanActivate} from 'angular2/router';
import {TutorService} from '../../../services/tutor';

import {FORM_DIRECTIVES, FormBuilder, Control, ControlGroup, Validators} from 'angular2/common';

@Component({
    selector: 'tutor-detail-student',
    templateUrl: '/components/tutor/detail/student.html',
    providers: [Session, TutorService],
    directives: [ROUTER_DIRECTIVES, FORM_DIRECTIVES]
})
export class DetailTutorStudent implements AfterViewInit {

    student: any;
    allStudentData: any;
    StudentDetailForm: ControlGroup;
    firstName: Control;
    lastName: Control;
    username: Control;
    password: Control;
    verifiedpassword: Control;
    phone: Control;
    dob: Control;
    dob_day: Control;
    dob_month: Control;
    dob_year: Control;
    courseList: any;
    totalCourseList: any;
    submitAttempt: boolean = false;
    valid_username: boolean = false;
    selectedMonth: boolean = false;
    selectedObject: number = 0;
    show_un_save: boolean = false;

    months: any = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    constructor(private _session: Session, private _tutorService: TutorService, private builder: FormBuilder, private _router: Router) {
        if (this._session.getCurrentId() == null) {
            this._router.navigateByUrl('/login');
        } else {

            this.student = JSON.parse(this._session.getItem('TutorStudent'));
            this.allStudentData = JSON.parse(this._session.getItem('TutorAllStudent'));
            var id = this.student.student_id;
            console.log(this.student);
            this._tutorService.getCoursesByStudentId(id, this._session.getCurrentId()).subscribe((res) => {
                this.totalCourseList = res;
                console.log(res);
                this.courseList = this.totalCourseList.slice(0, 30);
                console.log(this.courseList);
            })

            this.firstName = new Control(this.student.firstName, Validators.required);
            this.lastName = new Control(this.student.lastName, Validators.required);
            this.username = new Control(this.student.username);
            this.phone = new Control(this.student.phone);
            this.password = new Control(this.student.hashed_pwd, Validators.compose([Validators.required, Validators.minLength(6)]))
            this.verifiedpassword = new Control(this.student.hashed_pwd, Validators.compose([Validators.required, Validators.minLength(6)]))
            this.dob = new Control(this.student.DOB);
            this.selectedMonth = JSON.parse(this._session.getItem('editORadd'))



            let [day, month, year] = ['', '', ''];
            if (this.student.DOB != '' || this.student.DOB != null)
                [day, month, year] = this.student.DOB.split('/');

            this.dob_day = new Control(day);
            this.dob_month = new Control(month);

            this.dob_year = new Control(year);
            this.selectedObject = Number(month);

            this.StudentDetailForm = builder.group({
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
        }
    }

    ngAfterViewInit() {
        $("input.datepicker").datepicker({ dateFormat: 'dd/mm/yy' });
    }

    getUserFullName() {
        return this.titleCase(this.student.firstName) + " " + this.titleCase(this.student.lastName);
    }

    cancel() {
        if(JSON.parse(this._session.getItem('pastRoute')) == true){
            this._router.navigate(['PastTutorStudent']);
        }else{
          this._router.navigate(['TutorMain']);
        }
    }


    getCompletedStatus(flag) {
        return flag ? 'Yes' : 'No';
    }

    getValue(form: any) {
        if (form.firstName == "" || form.lastName == "") return '';

        var firstName = form.firstName,
            lastName = form.lastName,
            username = firstName.charAt(0).toLowerCase() + lastName.toLowerCase(),
            i = 0;

        this.allStudentData.forEach(function(student) {
            if (student.username.includes(username)) i++;
        })
        if (i != 0) username = username + i;

        (<Control>this.StudentDetailForm.controls['username']).updateValue(username);
    }

    validUserName(form: any) {
        var username = form.username, flag: boolean = false;
        if (username == '') {
            this.valid_username = true;
            return;
        }
        this.allStudentData.forEach(function(student) {
            if (student.username == username) flag = true;
        });

        if (flag) {
            this.valid_username = true;
            alert("Username cannot be used!");
            (<Control>this.StudentDetailForm.controls['username']).updateValue('');
            return;
        }
        this.valid_username = false;
        return;
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
        if (form.dob_day == '' && isNaN(form.dob_month) && form.dob_year == null) return true;

        if (form.dob_day > 31) return false;
        if (form.dob_month > 12 || form.dob_month < 0) return false;
        if (form.dob_year.length < 4) return false;
        return true;
    }

    AddStudent(form: any) {
        this.submitAttempt = true;
        if (this.StudentDetailForm.valid && this.matchedPassword(form) && this.validDob(form)) {
            var dob = "";
            if (form.dob_day == null || Number(form.dob_day) == 0 || Number(form.dob_year) == 0 || Number(form.dob_month) == 0 || form.dob_month == null || form.dob_year == null) {
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

            this._tutorService.addStudent(data, flag.flag)
                .subscribe((res) => {
                    if (res.success) {
                        this._router.navigate(['TutorMain']);
                    }
                })
        }

        console.log('cancel')
    }

    private titleCase(str: string): string {
        return str.split(' ').map(function(val) {
            return val.charAt(0).toUpperCase() + val.substr(1).toLowerCase();
        }).join(' ');
    }

    gotoCertificate(course: any) {
        if (course.isCompleted == false) return false;
        var self = this;
        this._tutorService.getLessonsNameByCourseId({ course_id: course.course_id }).subscribe((res) => {
            var data = {
                coursename: course.coursetitle,
                studentname: `${this.student.firstName} ${this.student.lastName}`,
                score: course.score,
                completed_at: course.completedAt,
                lessons: res.data.join(', '),
                organization: this._session.getItem("organization")
            }
            self._session.setItem('certificate', JSON.stringify(data));
            window.open('/#/certificate');
            // self._router.navigateByUrl('/certificate');
        });
    }

    getCompleteDate(course: any) {
        var date = course.completedAt, isCompleted = course.isCompleted;
        if (date == null || date == '') return '';

        var d = new Date(date),
            day = d.getDate().toString().length == 1 ? '0' + d.getDate() : d.getDate(),
            month = (d.getMonth() + 1).toString().length == 1 ? '0' + (d.getMonth() + 1) : (d.getMonth() + 1),
            datestring = day + "/" + month + "/" + d.getFullYear();

        return datestring;
    }

    onKey(event: any) {
        var value = event.target.value;
        value = value.replace(/\D/g, '');
        (<Control>this.StudentDetailForm.controls['phone']).updateValue(value);
    }

    getNumber(num:number, str: string='') {
        if(num == 1){ console.log("true");return true;}
        console.log("false");
        return false;
        // return Number(str) == num;
    }

    beforeGotoBack(form: any) {
        var dob = `${form.dob_day.length == 2 ? form.dob_day : '0' + form.dob_day}/${form.dob_month.length == 2 ? form.dob_month : '0' + form.dob_month}/${form.dob_year}`;
        console.log(form);
        console.log(this.student)
        if (form.firstName != this.student.firstName || form.lastName != this.student.lastName || form.username != this.student.username || form.phone != this.student.phone || form.password != this.student.hashed_pwd || dob != this.student.DOB) {
            this.show_un_save = true;
        } else {
            this.show_un_save = false;
            this.cancel();
        }
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
            if (Number(val) < 1916) return false;
        }
        if (Number(val) > (new Date()).getFullYear()) return false;

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

    getPastEmployees(num: number){
      if(num == -1){
        this.courseList = this.totalCourseList;
      }else{
        this.courseList = this.totalCourseList.slice(0, num);
      }
    }
}
