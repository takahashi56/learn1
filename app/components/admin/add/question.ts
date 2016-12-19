import {Component} from 'angular2/core';
import {Session} from '../../../services/session';
import {ROUTER_DIRECTIVES, Router} from 'angular2/router';
import {CanActivate} from 'angular2/router';
import {AdminService} from '../../../services/admin';
import {FORM_DIRECTIVES, FormBuilder, Control, ControlGroup, Validators} from 'angular2/common';

@Component({
    selector: 'admin-add-question',
    templateUrl: '/components/admin/add/question.html',
    providers: [Session, AdminService],
    directives: [ROUTER_DIRECTIVES, FORM_DIRECTIVES]
})

export class Question {

    questionForm: ControlGroup;
    questionName: Control;
    questionType: number = 1;
    question: Control;
    answerA: Control;
    answerB: Control;
    answerC: Control;
    answerD: Control;
    answerText: Control;
    image: string;
    trueNumber: number = 0;
    disableSubmit: boolean = false;
    submitAttempt: boolean = false;
    showTrueNumber: boolean = false;
    data: any;


    constructor(private _session: Session, private _adminService: AdminService, private builder: FormBuilder, private _router: Router) {
        this.data = JSON.parse(this._session.getItem('question'));
        this.image = "";
        this.showTrueNumber = false;
        this.questionName = new Control(this.data.label, Validators.required);
        this.question = new Control(this.data.question, Validators.required);
        this.answerA = new Control(this.data.answerA, Validators.required);
        this.answerB = new Control(this.data.answerB, Validators.required);
        this.answerC = new Control(this.data.answerC, Validators.required);
        this.answerD = new Control(this.data.answerD, Validators.required);
        this.answerText = new Control(this.data.answerText, Validators.required);
        this.trueNumber = this.data.trueNumber;
        this.questionType = this.data.questionType;

        this.questionForm = this.builder.group({
            questionName: this.questionName,
            question: this.question,
            answerA: this.answerA,
            answerB: this.answerB,
            answerC: this.answerC,
            answerD: this.answerD,
            answerText: this.answerText,
        })
    }

    cancel() {
        this._router.navigate(['AdminAddLesson']);
    }

    getCourseName() {
        var course = JSON.parse(this._session.getItem('Course'));
        if (course.coursetitle == "") {
            return "Add Course";
        } else {
            return course.coursetitle;
        }
    }

    getLessonName() {
        var lessonData = JSON.parse(this._session.getItem('Lesson_new'));
        if (lessonData.lessonname == "") {
            return "Question Name";
        } else {
            return lessonData.lessonname;
        }
    }

    choiceChange(flag: number) {
        this.questionType = flag;
    }

    choiceAnswer(n: number) {
        this.trueNumber = n;
    }

    onFileChange(event, form: any) {
        let files = event.srcElement.files;
        this._adminService.upload(files).subscribe((res) => {
            this.image = res.image;
        });
    }

    SubmitQuestion(form: any) {
        this.submitAttempt = true;
        this.disableSubmit = true;
        this.showTrueNumber = false;
        
        if (this.questionType != 0 && this.trueNumber == 0) {
          this.disableSubmit = false;
          if(form.questionName == '') return;
          this.showTrueNumber = true;
          return;
        }
        if (this.questionType == 0 && (form.answerText == ''  || form.questionName == '')) {this.disableSubmit = false; return;}
        if (this.questionType == 1 && (form.question == '' || form.questionName == '' || form.answerA == '' || form.answerB == '' || form.answerC == '' || form.answerD == '')) {this.disableSubmit = false; return;}
        if (this.questionType == 2 && (form.question == '' || form.questionName == '' || form.answerA == '' || form.answerB == '' || form.answerC == '' || form.answerD == '' || this.image == '')) {this.disableSubmit = false; return;}

        this.data.label = form.questionName;
        this.data.question = form.question;
        this.data.answerA = form.answerA;
        this.data.answerB = form.answerB;
        this.data.answerC = form.answerC;
        this.data.answerD = form.answerD;
        this.data.answerText = form.answerText;
        this.data.image = this.image;
        this.data.questionType = this.questionType;
        this.data.trueNumber = this.trueNumber;

        let contents = JSON.parse(this._session.getItem('Content')),
            editAdd = JSON.parse(this._session.getItem('editAdd'));
        if (editAdd == true) {
            contents = this.updateArray(contents, this.data._id, this.data);
        } else {
            contents.push(this.data);
        }
        this._session.setItem('Content', JSON.stringify(contents));        
        this._router.navigate(['AdminAddLesson']);
    }

    updateArray(array, find, data) {
        for (var i in array) {
            if (array[i]._id == find) {
                array[i].label = data.label;
                array[i].question = data.question;
                array[i].answerA = data.answerA;
                array[i].answerB = data.answerB;
                array[i].answerC = data.answerC;
                array[i].answerD = data.answerD;
                array[i].answerText = data.answerText;
                array[i].trueNumber = data.trueNumber;
                break; //Stop this loop, we found it!
            }
        }
        return array;
    }
}
