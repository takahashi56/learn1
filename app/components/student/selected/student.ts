import {Component, OnInit} from 'angular2/core';
import {Session} from '../../../services/session';
import {ROUTER_DIRECTIVES, Router} from 'angular2/router';
import {CanActivate} from 'angular2/router';
import {StudentService} from '../../../services/student';
import {StudentVideo} from '../video/student';
import {QuestionText} from '../questiontext/student';
import {QuestionChoice} from '../questionchoice/student';


@Component({
    selector: 'selected-content',
    templateUrl: '/components/student/selected/student.html',
    // template: '<h1>22</h1>',
    providers: [Session, StudentService],
    directives: [ROUTER_DIRECTIVES, StudentVideo, QuestionText, QuestionChoice],
})
export class SelectedContent implements OnInit {

    currentLesson: any = [];
    contents: any;
    currentContent: any;
    lessonname: string;
    lessonindex: number;
    lessontotal: number;
    index: number = 0;

    constructor(private _session: Session, private _studentService: StudentService, private _router: Router) {
        if (this._session.getCurrentId() == null) {
            this._router.navigateByUrl('/login');
        } else {
            this.contents = JSON.parse(this._session.getItem('SelectedContents'));
            var count = 0;
            this.contents.forEach(function(content) {
                if (content.slideOrQuestion == false) {
                    count++;
                }
            })

            this._session.setItem('questionCount', count);
            this._session.setItem('rightQuestionCount', 0);

            this.currentLesson = JSON.parse(this._session.getItem('SelectedLessonById'));

            this.currentContent = this.contents[0];
            this.index = 0;
            this.lessonindex = Number(this._session.getItem('SelectedLessonIndex'));
            this.lessontotal = Number(this._session.getItem('TotalLesson'));
            this.lessonname = this.currentLesson.lessonname;
            this._session.setItem('LessonName', this.lessonname);

            this._session.setItem('currentStep', 1);
            this._session.setItem('totalCount', this.contents.length);
        }

    }

    ngOnInit() {

    }


    gotoNextContent(event) {
        if ((this.index + 1) >= this.contents.length) {
            return this.gotoResultPage();
        } else {
            this.index += 1;
            this.currentContent = this.contents[this.index];
            this._session.setItem('currentStep', this.index + 1);
        }
    }

    gotoPreviousContent(event) {
        if ((this.index - 1) < 0) {
            this._router.navigate(['StudentLesson']);
            return false;
        }

        this.index -= 1;
        this.currentContent = this.contents[this.index];
        this._session.setItem('currentStep', this.index + 1);
    }

    gotoResultPage() {
        var totalCount = Number(this._session.getItem('questionCount')),
            rightCount = Number(this._session.getItem('rightQuestionCount')),
            score = Math.floor(rightCount / totalCount * 100),
            score = isNaN(score) ? 0 : score,
            lesson_id = this._session.getItem('SelectedLessonId'),
            student_id = this._session.getCurrentId(),
            data = {
                student_id: student_id,
                lesson_id: lesson_id,
                score: score,
            },
            status = {
                total: totalCount,
                right: rightCount,
                score: score
            };

        this._session.setItem(lesson_id, JSON.stringify(status));
        this._studentService.setScoreForLesson(data).subscribe((res) => {
            this._router.navigate(['LessonResult'])
        })
    }


}
