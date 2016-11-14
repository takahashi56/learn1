import {Component, OnInit} from 'angular2/core';
import {Session} from '../../../services/session';
import {ROUTER_DIRECTIVES, Router} from 'angular2/router';
import {CanActivate} from 'angular2/router';
import {StudentService} from '../../../services/student';

@Component({
    selector: 'student-main',
    templateUrl: '/components/student/main/main.html',
    providers: [Session, StudentService],
    directives: [ROUTER_DIRECTIVES],
})
export class StudentMain implements OnInit {

    courseList: any = [];
    course: any = {};
    studentInfo: any;
    studentId: string;
    empty: boolean = false;

    constructor(private _session: Session, private _studentService: StudentService, private _router: Router) {
        this._session.setItem('editORadd', JSON.stringify({ flag: false }));
        this.studentId = this._session.getItem('MainStudentId');

        var role = this._session.getCurrentRole(),
            count = Number(this._session.getItem('CourseCount')),
            id = this._session.getCurrentId();

        if (id == null || role == null) {
            this._router.navigateByUrl('/login');
        }else{
          if (role == 2) {
            this._studentService.getCourseListById(this.studentId).subscribe((res) => {
              this.courseList = res;
            })

            this._studentService.getStudentInfo(this.studentId).subscribe((res) => {
              this.studentInfo = res;
            })

            if (count == 0) {
              this.empty = true;
            } else {
              this.empty = false;
            }
          } else {
            var url = this._session.getItem('homeUrl');
            this._router.navigateByUrl(url);
          }
        }
    }

    ngOnInit() {
      this._studentService.updateCourse(this.studentId).subscribe((res) => {
        console.log('')
      })
    }

    gotoLessonList(course) {
        this._session.setItem('selectedCourse', JSON.stringify(course));
        this._session.setItem('CourseName', this.getCourseName(course));
        this._session.setItem('CourseId', course.course_id);
        this._router.navigate(['StudentLesson']);
    }

    getHeadingClass(course: any) {
        if (course.isCompleted)
            return "panel-heading panel-completed";
        else
            return "panel-heading";
    }

    getCourseName(course: any) {
        return this.titleCase(course.coursetitle);
    }

    getCurrentStatus(course: any) {
        if (course.isCompleted == false) {
            return `In progress ${course.progress}% Complete`;
        }
        if (course.isCompleted == true) {
            return `Completed, ${this.getCompleteDate(course.completedAt)}, Score ${course.score}%`;
        }
    }

    beforeGotoLessonList(course: any) {
        if (course.isCompleted == false) {
            this.gotoLessonList(course);
        }
        return;
        // this.course = course;
    }

    retakeCourse() {
        this._studentService.resetCourse(this.studentId, this.course.course_id).subscribe((res) => {
            this.gotoLessonList(this.course);
        })
    }

    getCompleteDate(date) {
        if (date == null) return '';


        var d = new Date(date),
            day = d.getDate().toString().length == 1 ? '0' + d.getDate() : d.getDate(),
            month = (d.getMonth() + 1).toString().length == 1 ? '0' + (d.getMonth() + 1) : (d.getMonth() + 1),
            datestring = day + "/" + month + "/" + d.getFullYear();

        return datestring;
    }


    private titleCase(str: string): string {
        return str.split(' ').map(function(val) {
            return val.charAt(0).toUpperCase() + val.substr(1).toLowerCase();
        }).join(' ');
    }
}
