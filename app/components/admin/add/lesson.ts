import {Component} from 'angular2/core';
import {Session} from '../../../services/session';
import {ROUTER_DIRECTIVES, Router} from 'angular2/router';
import {CanActivate} from 'angular2/router';
import {AdminService} from '../../../services/admin';
import {LessonContent} from './content';
import {FORM_DIRECTIVES, FormBuilder, Control, ControlGroup, Validators} from 'angular2/common';

@Component({
    selector: 'admin-add-lesson',
    templateUrl: '/components/admin/add/lesson.html',
    providers: [Session, AdminService],
    directives: [ROUTER_DIRECTIVES, FORM_DIRECTIVES, LessonContent]
})

export class AddLesson {

    lessonForm: ControlGroup;
    lessonname: Control;
    lessondescription: Control;
    lesson_id: string;
    submitAttempt: boolean = false;
    lessonData: any = [];
    contents: any = [];
    created_at: Date;
    position: number = 0;
    selectContent: any = [];
    show_remove_content: boolean = false;
    stringRemoveContent: string = '';
    show_warning: boolean = false;
    show_not_save: boolean = false;

    constructor(private _session: Session, private _adminService: AdminService, private builder: FormBuilder, private _router: Router) {
        if (this._session.getCurrentId() == null) {
            this._router.navigateByUrl('/login');
        } else {
            this.newInit(false);
        }

    }

    manageContent(value) {
        this.contents = value; //JSON.parse(this._session.getItem('Content'));
    }

    cancel() {
        this._session.setItem('Lesson_new', null);
        this._session.setItem('Content', null);
        this._router.navigate(['AdminAddCourse']);
    }

    beforeCancel() {
      this.show_not_save = false;
      let contents = JSON.parse(this._session.getItem('Content')), result = false;
      contents.forEach((content) => {
        if(content._id.length < 15) {
          result = true;
        }
      });
      if(result) {
        this.show_not_save = true;
      } else {
        this.show_not_save = false;
        this.cancel();
      }
    }

    SubmitLesson(form: any) {
        this.submitAttempt = true;
        if (this.lessonForm.valid) {
            this.handleData(form);
            this._session.setItem('valid_input', 1);
            this._router.navigate(['AdminAddCourse']);
        }
    }

    addNextLesson(form: any) {
        this.submitAttempt = true;
        if (this.lessonForm.valid) {

            this.handleData(form);

            var data = [{
                _id: (Date.now()).toString(),
                slideOrQuestion: true,
                questionType: 1,
                label: '',
                question: '',
                answerA: '',
                answerB: '',
                answerC: '',
                answerD: '',
                answerText: '',
                image: '',
                trueNumber: '',
                order: null
            }];

            let data1 = {
                lesson_id: (Date.now()).toString(),
                lessonname: '',
                lessondescription: '',
                content: data,
                created_at: new Date()
            }
            this._session.setItem('Lesson_new', JSON.stringify(data1));
            this._session.setItem('Content', JSON.stringify(data));
            this.newInit(true);
        }
    }

    private handleData(form: any): void {
        let contentData = JSON.parse(this._session.getItem('Content'));
        
        contentData.forEach((content, index, array) => {
          content.order = index;
        });
        
        let lesson = {
            lesson_id: this.lesson_id,
            lessonname: this.lessonForm.controls['lessonname'].value,
            lessondescription: this.lessonForm.controls['lessondescription'].value,
            content: contentData,
            created_at: this.created_at
        }
        this.submitAttempt = false;
        let course = JSON.parse(this._session.getItem('Course')), lessons_copy = [], update_lesson = false, lesson_original = [];
        lesson_original = course.lesson;

        lesson_original.forEach(function(obj) {
            if (obj.lesson_id == lesson.lesson_id) {
                update_lesson = true;
                lessons_copy.push(lesson);
            } else {
                lessons_copy.push(obj);
            }
        });
        if (!update_lesson) {
            lessons_copy.push(lesson);
        }
        course.lesson = lessons_copy;
        this._session.setItem('Course', JSON.stringify(course));
        
    }

    private newInit(flag: boolean): void {
        this.lessonData = JSON.parse(this._session.getItem('Lesson_new'));
        this.created_at = this.lessonData.created_at;
        this.lesson_id = this.lessonData.lesson_id;
        this.contents = JSON.parse(this._session.getItem('Content')) || []; //this.lessonData.content;
        console.log(this.contents)
        console.log(this.contents.length)
        this.position = this.contents.length;
        if (!flag) {
            this.lessonname = new Control(this.lessonData.lessonname, Validators.required);
            this.lessondescription = new Control(this.lessonData.lessondescription, Validators.required);

            this.lessonForm = this.builder.group({
                lessonname: this.lessonname,
                lessondescription: this.lessondescription,
            })
        } else {
            (<Control>this.lessonForm.controls['lessonname']).updateValue(this.lessonData.lessonname);
            (<Control>this.lessonForm.controls['lessondescription']).updateValue(this.lessonData.lessondescription);
        }
    }

    getCourseName() {
        var course = JSON.parse(this._session.getItem('Course'));
        if (course.coursetitle == "") {
            return "Add Lesson";
        } else {
            return course.coursetitle;
        }
    }

    getLessonName() {
        if (this.lessonData.lessonname == "") {
            return "Lesson Name";
        } else {
            return this.lessonData.lessonname;
        }
    }

    addSlide(form: any) {
        let data = {
            _id: (Date.now()).toString(),
            slideOrQuestion: true,
            label: '',
            slideContent: '',
            questionType: 1,
            question: '',
            answerA: '',
            answerB: '',
            answerC: '',
            answerD: '',
            answerText: '',
            image: '',
            trueNumber: '',
            order: null
        };
        this.setTitleAndDesc(form);
        this._session.setItem('editAdd', false);
        this._session.setItem('slide', JSON.stringify(data));
        this._router.navigate(['AdminAddSlide']);
    }

    addQuestion(form: any) {
        let data = {
            _id: (Date.now()).toString(),
            slideOrQuestion: false,
            label: '',
            slideContent: '',
            questionType: 1,
            question: '',
            answerA: '',
            answerB: '',
            answerC: '',
            answerD: '',
            answerText: '',
            image: '',
            trueNumber: 0,
            order: null
        };
        this.setTitleAndDesc(form);
        this._session.setItem('editAdd', false);
        this._session.setItem('question', JSON.stringify(data));
        this._router.navigate(['AdminAddQuestion']);
    }
    
    setTitleAndDesc(form:any) {
      let lessonData = JSON.parse(this._session.getItem('Lesson_new'));
      lessonData.lessonname = form.lessonname;
      lessonData.lessondescription = form.lessondescription;
      this._session.setItem('Lesson_new', JSON.stringify(lessonData));
    }

    gotoEditContent(content, form) {
        this._session.setItem('editAdd', true);
        this.setTitleAndDesc(form);
        if (content.slideOrQuestion == true) {
            this._session.setItem('slide', JSON.stringify(content));
            this._router.navigate(['AdminAddSlide']);
        } else {
            this._session.setItem('question', JSON.stringify(content));
            this._router.navigate(['AdminAddQuestion']);
        }
    }
    
    beforeRemoveContent() {
        if (this.selectContent.length == 0) {
            this.show_remove_content = false;
            return false;
        }
        if (this.selectContent.length == 1){
          this.stringRemoveContent = "Are you sure to remove this content?"
        }else{
          this.stringRemoveContent = "Are you sure to remove these contents?"
        }
        this.show_remove_content = true;
    }

    removeContent() {
        if (this.selectContent.length == 0) return false;
        this.show_remove_content = false;

        this.selectContent.map((id) => {
            this.contents = this.contents.filter((content) => {
                return content._id != id;
            })
        });
        this.selectContent = [];
        this.position = this.contents.length;
        this._session.setItem('Content', JSON.stringify(this.contents));
    }

    checkContent(event, object) {
        if (event.currentTarget.checked) {
            this.selectContent.push(object._id);
        } else {
            this.selectContent = this.selectContent.filter((o) => {
                return o != object._id;
            });            
        }
    }

    changePosition(num) {
        this.show_warning = false;
        if (this.selectContent.length == 0) return;

        if (this.selectContent.length != 1) {
          this.show_warning = true;
          return;
        }
        let value = this.contents.filter((content) => {
            return content._id == this.selectContent[0];
        });
        this.contents = this.moveElementInArray(this.contents, value[0], num - 1);
        this._session.setItem('Content', JSON.stringify(this.contents));
    }
    
    isValidPosition(){
      if(this.position == 0) return false;
      return true;
    }

    private range(num) {
        let a = [];
        for (let i = 0; i < num; ++i) {
            a.push(i + 1);
        }
        return a;
    }

    private moveElementInArray(array, value, positionChange) {
        let oldIndex = array.indexOf(value);
        return this.move(array, oldIndex, positionChange);
    }

    private move(array, from, to) {
        array.splice(to, 0, array.splice(from, 1)[0]);
        return array;
    };
}

