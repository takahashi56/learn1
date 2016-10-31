import {Component} from 'angular2/core';
import {Session} from '../../../services/session';
import {ROUTER_DIRECTIVES, Router} from 'angular2/router';
import {CanActivate} from 'angular2/router';
import {AdminService} from '../../../services/admin';
import {FORM_DIRECTIVES, FormBuilder, Control, ControlGroup, Validators} from 'angular2/common';


@Component({
    selector: 'admin-add-course',
    templateUrl: '/components/admin/add/course.html',
    providers: [Session, AdminService],
    directives: [ROUTER_DIRECTIVES, FORM_DIRECTIVES]
})

export class AddCourse {

    courseForm: ControlGroup;
    coursetitle: Control;
    coursedescription: Control;
    submitAttempt: boolean = false;
    courseData: any = {};
    lessonData: any = [];
    show_back: boolean = false;

    show_remove_lesson: boolean = false;
    selectLesson: any = [];

    constructor(private _session: Session, private _adminService: AdminService, private builder: FormBuilder, private _router: Router) {
        if (this._session.getCurrentId() == null) {
            this._router.navigateByUrl('/login');
        } else {
            this.courseData = JSON.parse(this._session.getItem('Course'));
            this.coursetitle = new Control(this.courseData.coursetitle, Validators.required);
            this.coursedescription = new Control(this.courseData.coursedescription, Validators.required);
            this.lessonData = this.courseData.lesson;
            this.show_remove_lesson = false;

            this.courseForm = builder.group({
                coursetitle: this.coursetitle,
                coursedescription: this.coursedescription,
            });
        }
    }

    cancel() {
        this._session.setItem('Course', null);
        this._router.navigate(['AdminMain']);
    }

    showBack() {
        if (Number(this._session.getItem('valid_input')) == 1) {
            this.show_back = true;
        } else {
            this.cancel();
        }
    }

    getVideoCount(lesson) {
        let count = 0;
        lesson.content.forEach((obj) => {
            if (obj.videoOrQuestion) count++;
        })
        return count;
    }

    gotoEditLesson(lesson) {
        this._session.setItem('valid_input', 0);
        this._session.setItem('Lesson_new', JSON.stringify(lesson));
        this._session.setItem('Content', JSON.stringify(lesson.content));
        this._router.navigate(['AdminAddLesson']);
    }

    addLesson(form: any) {
        this._session.setItem('valid_input', 0);
        var data2 = {
            course_id: this.courseData.course_id,
            coursetitle: this.courseForm.controls["coursetitle"].value,
            coursedescription: this.courseForm.controls["coursedescription"].value,
            lesson: this.courseData.lesson,
        }

        var data = [{
            _content_id: (Date.now()).toString(),
            videoOrQuestion: true,
            questionType: false,
            videoLabel: '',
            videoEmbedCode: '',
            singleOrMulti: false,
            question: '',
            answerA: '',
            answerB: '',
            answerC: '',
            answerD: '',
            image: '',
            trueNumber: '',
        }];

        var data1 = {
            lesson_id: (Date.now()).toString(),
            lessonname: '',
            lessondescription: '',
            content: data,
            created_at: new Date()
        }

        this._session.setItem('Course', JSON.stringify(data2));
        this._session.setItem('Lesson_new', JSON.stringify(data1));
        this._session.setItem('Content', JSON.stringify(data));
        this._router.navigate(['AdminAddLesson']);
    }

    SubmitCourse(form: any) {
        var submitAttempt = true;
        var editORadd = JSON.parse(this._session.getItem('editORadd'));
        if (this.courseForm.valid) {
            var data = JSON.parse(this._session.getItem('Course'));

            data.coursetitle = form.coursetitle;
            data.coursedescription = form.coursedescription;
            // if(data.lesson.length == 0) return false;

            this._adminService.addCourse(data, editORadd.flag)
                .subscribe((res) => {
                    if (res.success) {
                        this._session.setItem('Course', null);
                        this._session.setItem('Lesson_new', null);
                        this._session.setItem('Content', null);
                        this._router.navigate(['AdminMain']);
                    } else {
                        console.log("");
                    }
                })
        }
    }

    getCourseName() {
        if (this.courseData.coursetitle != "") {
            return this.courseData.coursetitle;
        } else {
            return "Add Course";
        }
    }

    beforeRemoveLesson() {
        if (this.selectLesson.length == 0) {
            this.show_remove_lesson = false;
            return false;
        }
        this.show_remove_lesson = true;
    }

    removeLesson() {
        if (this.selectLesson.length == 0) return false;
        this.show_remove_lesson = false;

        this.selectLesson.map((id) => {
            this.lessonData = this.lessonData.filter((lesson) => {
                return lesson.lesson_id != id;
            })
        });
				this.selectLesson = [];

        this.courseData.lesson = this.lessonData;

        var data = JSON.parse(this._session.getItem('Course'));
        data.lesson = this.lessonData;
        this._session.setItem('Course', JSON.stringify(data));
    }

    checkLesson(event, object) {
        if (event.currentTarget.checked) {
            this.selectLesson.push(object.lesson_id);
        } else {
            this.selectLesson = this.selectLesson.filter((o) => {
                return o != object.lesson_id;
            })
        }
    }
}
