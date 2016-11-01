import {Component} from 'angular2/core';
import {Session} from '../../../services/session';
import {ROUTER_DIRECTIVES, Router} from 'angular2/router';
import {CanActivate} from 'angular2/router';
import {TutorService} from '../../../services/tutor';

@Component({
    selector: 'tutor-detail-course',
    templateUrl: '/components/tutor/detail/course.html',
    providers: [Session, TutorService],
    directives: [ROUTER_DIRECTIVES]
})
export class DetailTutorCourse {

    course: any;
    studentList: any;


    constructor(private _session: Session, private _tutorService: TutorService, private _router: Router) {
        if (this._session.getCurrentId() == null) {
            this._router.navigateByUrl('/login');
        } else {

            this.course = JSON.parse(this._session.getItem('TutorCourse'));

            this._tutorService.getStudentsByCourseId(this.course.course_id, this._session.getCurrentId()).subscribe((res) => {
                this.studentList = res;
            })
        }
    }


    gotoTutorMain() {
        this._router.navigate(['TutorMain']);
    }

    doLogin(form: any) {
        // this._session.login(form.username, form.password);
    }
    getCourseName() {
        return this.titleCase(this.course.coursetitle);
    }

    getComplete(flag) {
        return flag ? 'Yes' : 'No';
    }

    private titleCase(str: string): string {
        return str.split(' ').map(function(val) {
            return val.charAt(0).toUpperCase() + val.substr(1).toLowerCase();
        }).join(' ');
    }

    getCompleteDate(student: any) {
        var date = student.completedAt, isCompleted = student.isCompleted;
        if (date == null || isCompleted == false) return '';
        var d = new Date(date),
            datestring = d.getDate() + "/" + (d.getMonth() + 1) + "/" + d.getFullYear() + " " + d.getHours() + ":" + d.getMinutes();
        return datestring;
    }

    gotoCertificate(student: any) {
        if (student.isCompleted == false) return false;
        var self = this;
        this._tutorService.getLessonsNameByCourseId({ course_id: this.course.course_id }).subscribe((res) => {
            var data = {
                coursename: this.course.coursetitle,
                studentname: `${student.firstName} ${student.lastName}`,
                score: student.score,
                completed_at: student.completedAt,
                lessons: res.data.join(','),
                organization: this._session.getItem("organization")
            }
            self._session.setItem('certificate', JSON.stringify(data));
            window.open('/#/certificate');
            // self._router.navigateByUrl('/certificate');
        });
    }
}
