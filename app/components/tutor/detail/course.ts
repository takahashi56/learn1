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
    selectStudents: any = [];
    show_un_assign:boolean = false;


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
        if (date == null || date == '' || isCompleted == false) return '';

        var d = new Date(date),
            day = d.getDate().toString().length == 1 ? '0' + d.getDate() : d.getDate(),
            month = (d.getMonth() + 1 ).toString().length == 1 ? '0' + (d.getMonth() + 1 ) : (d.getMonth() + 1 ),
                datestring = day  + "/" + month + "/" + d.getFullYear();

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

    checkStudent(event, object){
  		if(event.currentTarget.checked){
  			this.selectStudents.push(object.student_id);
  		}else{
  			this.selectStudents = this.selectStudents.filter((o) => {
  				return o != object.student_id;
  			})
  		}
  	}

    unassign(){
      var student_ids = [];
      this.show_un_assign = false;
      if(this.selectStudents.length == 0) return;
      this.selectStudents.forEach((id) => {
        this.studentList.forEach((student) => {
          if(student.student_id == id)
            if(student.isCompleted == false){
              student_ids.push(id);
            }else{
              this.show_un_assign = true;
              return;
            }
        })
      });
      if(this.show_un_assign == false && student_ids.length != 0){
        this._tutorService.unAssign({course_id: this.course.course_id, student_ids: student_ids, tutor_id: this._session.getCurrentId(), creditcount: Number(this._session.getItem('creditcount'))}).subscribe((res) => {
            this.studentList = this.studentList.filter((student) => {
              return !this.selectStudents.includes(student.student_id);
            });
            this.selectStudents = [];
            this._session.setItem('creditcount', res.creditcount);
        })
      }


    }
}
