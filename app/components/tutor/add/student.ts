import {Component} from 'angular2/core';
import {Session} from '../../../services/session';
import {ROUTER_DIRECTIVES, Router} from 'angular2/router';
import {CanActivate} from 'angular2/router';
import {TutorService} from '../../../services/tutor';
import {FORM_DIRECTIVES, FormBuilder, Control, ControlGroup, Validators} from 'angular2/common';

@Component({
    selector: 'tutor-add-student',
    templateUrl: '/components/tutor/add/student.html',
    providers: [Session, TutorService],
    directives: [ROUTER_DIRECTIVES, FORM_DIRECTIVES]
})
export class AddTutorStudent {

    student: any;
    allStudentData: any;
    StudentForm: ControlGroup;
    firstname: Control;
    lastname: Control;
    username: Control;
    password: Control;
    verifiedpassword: Control;
    phone: Control;
    dob: Control;
    submitAttempt: boolean = false;
    showGotoBack: boolean = false;


    constructor(private _session: Session, private _tutorService: TutorService, private builder: FormBuilder, private _router: Router) {
        if (this._session.getCurrentId() == null) {
            this._router.navigateByUrl('/login');
        } else {
            this.student = JSON.parse(this._session.getItem('TutorStudent'));
            this.allStudentData = JSON.parse(this._session.getItem('TutorAllStudent'));

            this.firstname = new Control(this.student.firstName, Validators.required);
            this.lastname = new Control(this.student.lastName, Validators.required);
            this.username = new Control(this.student.username);
            this.phone = new Control(this.student.phone);
            this.password = new Control(this.student.hashed_pwd, Validators.compose([Validators.required, Validators.minLength(6)]))
            this.verifiedpassword = new Control(this.student.hashed_pwd, Validators.compose([Validators.required, Validators.minLength(6)]))
            console.log(this.student.DOB);

            this.StudentForm = builder.group({
                firstname: this.firstname,
                lastname: this.lastname,
                username: this.username,
                dob: this.dob,
                phone: this.phone,
                password: this.password,
                verifiedpassword: this.verifiedpassword
            })
            this.generatePassword()

        }
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
        if (form.firstname == "" || form.lastname == "") return '';

        var firstname = form.firstname,
            lastname = form.lastname,
            username = firstname.charAt(0).toLowerCase() + lastname.toLowerCase(),
            i = 0;

        this.allStudentData.forEach(function(student) {
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

    AddStudent(form: any) {
        this.submitAttempt = true;
        if (this.StudentForm.valid && this.matchedPassword(form)) {
            var data = {
                firstName: form.firstname,
                lastName: form.lastname,
                username: form.username,
                hashed_pwd: form.password,
                DOB: form.dob,
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
    }
    onKey(event: any) {
        var value = event.target.value;
        value = value.replace(/\D/g, '');
        (<Control>this.StudentForm.controls['phone']).updateValue(value);
    }

    beforeGotoBack(form: any){
      console.log(form.password != this.student.hashed_pwd);
      console.log(form.firstname != this.student.firstName);
      console.log(form.lastname != this.student.lastName);
      console.log(form.phone != this.student.phone);
      console.log(this.student);
      console.log(form);
      
      if(form.password != this.student.hashed_pwd || form.firstname != this.student.firstName || form.lastname != this.student.lastName || form.username != this.student.username || form.phone != this.student.phone){
        this.showGotoBack = true;
      } else {
        this.showGotoBack = false;
        this.cancel();      }
    }

    private randomString(): string {
        var length = 8,
            chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        var result = '';
        for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
        return result;
    }

}
