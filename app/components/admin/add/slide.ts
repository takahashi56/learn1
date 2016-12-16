import {Component} from 'angular2/core';
import {Session} from '../../../services/session';
import {ROUTER_DIRECTIVES, Router} from 'angular2/router';
import {CanActivate} from 'angular2/router';
import {AdminService} from '../../../services/admin';
import {TinyEditor} from './tinyeditor';
import {FORM_DIRECTIVES, FormBuilder, Control, ControlGroup, Validators} from 'angular2/common';

@Component({
    selector: 'admin-add-slide',
    templateUrl: '/components/admin/add/slide.html',
    providers: [Session, AdminService],
    directives: [ROUTER_DIRECTIVES, FORM_DIRECTIVES, TinyEditor]
})

export class Slide {
    slideForm: ControlGroup;
    slideName: Control;
    submitAttempt: boolean = false;
    isValidContent: boolean = false;
    disableSubmit: boolean = false;
    data: any;

    constructor(private _session: Session, private _adminService: AdminService, private builder: FormBuilder, private _router: Router) {
        this.data = JSON.parse(this._session.getItem('slide'));
        console.log('slide');
        console.log(this.data)
        this.slideName = new Control(this.data.label, Validators.required);
        this.slideForm = this.builder.group({
            slideName: this.slideName,
        });
    }

    cancel() {
        this._router.navigate(['AdminAddLesson']);
    }

    getCourseName() {
        var course = JSON.parse(this._session.getItem('Course'));
        if (course.coursetitle == "") {
            return "Add Slide";
        } else {
            return course.coursetitle;
        }
    }

    getLessonName() {
        var lessonData = JSON.parse(this._session.getItem('Lesson_new'));
        if (lessonData.lessonname == "") {
            return "Lesson Name";
        } else {
            return lessonData.lessonname;
        }
    }

    SubmitSlide(form: any) {
        this.submitAttempt = true;

        if (this.data.slideContent == "") {
            this.isValidContent = true;
        } else {
            this.isValidContent = false;
        }

        if (this.slideForm.valid && this.data.slideContent != '') {
            this.isValidContent = false;
            this.disableSubmit = true;
            this.data.label = form.slideName;
            let contents = JSON.parse(this._session.getItem('Content')),
                editAdd = JSON.parse(this._session.getItem('editAdd'));
            if (editAdd == true) {
                contents = this.updateArray(contents, this.data._id, this.data.slideContent, this.data.label);
            } else {
                contents.push(this.data);
            }
            this._session.setItem('Content', JSON.stringify(contents));
            this._router.navigate(['AdminAddLesson']);
        }
    }

    updateArray(array, find, value, label) {
        for (var i in array) {
            if (array[i]._id == find) {
                array[i].slideContent = value;
                array[i].label = label;
                break; //Stop this loop, we found it!
            }
        }
        return array;
    }
}
