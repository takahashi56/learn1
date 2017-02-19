import {Component, OnInit, EventEmitter} from 'angular2/core';
import {Session} from '../../../services/session';
import {ROUTER_DIRECTIVES, Router} from 'angular2/router';
import {CanActivate} from 'angular2/router';
import {StudentService} from '../../../services/student';

@Component({
    selector: 'student-lesson',
    templateUrl: '/components/student/lesson/student.html',
    providers: [Session, StudentService],
    directives: [ROUTER_DIRECTIVES],
})
export class StudentLesson {

    lessonList: any = [];
    course: any;
    student_id: string;
    htmlstring: string;

    constructor(private _session: Session, private _studentService: StudentService, private _router: Router) {
        if (this._session.getCurrentId() == null) {
            this._router.navigateByUrl('/login');
        } else {
            this.course = JSON.parse(this._session.getItem('selectedCourse'));
            this.student_id = this._session.getItem('MainStudentId');
            var self = this;
            this.htmlstring = "";

            this._studentService.getLessonListById(this.course.course_id, this.student_id).subscribe((res) => {
                this.lessonList = res;
                this._session.setItem('lessonList', JSON.stringify(res));
                this.lessonList.forEach((lesson) => {
                    this._session.setItem(lesson.lesson_id, JSON.stringify({
                        total: lesson.count,
                        right: 0,
                        score: lesson.score
                    }));
                })
            })
        }

        document.getElementById('header_id').style.display = "block";

        // this._studentService.getScoreListByCourse({course_id: this.course.course_id, student_id: this.student_id}).subscribe((res)=>{
        // 	res.forEach(function(score){
        // 		self._session.setItem(score.lesson_id, score.score);
        // 	})
        // })
    }

    ngOnInit() {

    }
    getCountLesson() {
        return this.lessonList.length;
    }

    getCourseTitle() {
        return this.titleCase(this.course.coursetitle);
    }

    getLessonName(lesson) {
        return this.titleCase(lesson.lessonname);
    }

    gotoVideoOrQust() {
        this._router.navigate(['StudentLesson']);
    }
    getCurrentLessonStatus(lesson: any) {
        var score = lesson.score;
        if (Number(score) == -1 && lesson.lock == false) {
            return `
				<div class="col-sm-3 text-right">
	                <div> Locked </div>
	            </div>
			`;
        }

        if (lesson.lock == true) {
            return `<div class="col-sm-3 text-right">
	                <div> Ready </div>
	            	</div>
	            `;
        } else if (lesson.score >= 0) {
            return `
				<div class="col-sm-3 text-right">
	                <div> <i class="ion-checkmark-round m-r-5"></i> Completed ${lesson.completedAt.toString().slice(0, 10)} </div>
	            </div>
			`;
        }

    }


    countVideo(lesson: any) {

    }
    gotoLessonVideo(lesson: any, i: number) {
        var score = lesson.score;
        if (Number(score) == -1 && lesson.lock == false) {
            return false;
        }

        this._studentService.getContentsByLessonId(lesson.lesson_id).subscribe((res) => {
            this._session.setItem('SelectedContents', '');
            this._session.setItem('SelectedContents', JSON.stringify(res));
            this._session.setItem('SelectedLessonById', JSON.stringify(lesson));
            this._session.setItem('SelectedLessonId', lesson.lesson_id);
            this._session.setItem('SelectedLessonIndex', i);
            this._session.setItem('TotalLesson', this.lessonList.length);
            this._router.navigate(['SelectedContent']);
        });

    }

    GotoBackMed(){
      this._router.navigate(['StudentCourse']);
    }

    private titleCase(str: string): string {
        return str.split(' ').map(function(val) {
            return val.charAt(0).toUpperCase() + val.substr(1).toLowerCase();
        }).join(' ');
    }
}
