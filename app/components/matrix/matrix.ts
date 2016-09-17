import {Component, ViewChild, ElementRef, AfterViewInit} from 'angular2/core';
import {Session} from '../../services/session';
import {ROUTER_DIRECTIVES, Router} from 'angular2/router';
import {CanActivate} from 'angular2/router';
import {TutorService} from '../../services/tutor';

declare var $:JQueryStatic;

@Component({
	selector: 'matrix',
  templateUrl: '/components/matrix/matrix.html',
	providers: [Session,TutorService],
	directives: [ROUTER_DIRECTIVES]
})
export class Matrix  implements AfterViewInit {
  organization: string = '';
  courseList: any[];
  studentList: any[];

  @ViewChild('gridbasic') el:ElementRef;
	constructor(private _session: Session, private _tutorService: TutorService, private _router: Router) {
		console.log('in the constructor');
    this.organization = this._session.getItem('organization')
    this.courseList = JSON.parse(this._session.getItem('courseList'));
    var tutor_id = this._session.getCurrentId();
    this.studentList = JSON.parse(this._session.getItem('studentList'))
    console.log(this.studentList)
	}

  ngAfterViewInit() {
      $(this.el.nativeElement).bootgrid({
        navigation: 0
      });
  }

  getCompleteDatefromCourse(course, student_course){
    let coString = "";
    student_course.forEach(c => {
        if(c.course_id === course.course_id){
          coString = this.getCompleteDate(c.completedAt)
        }
    });
    return coString == ''? '' : coString;
  }

  getCompleteDate(date){
		if(date == null) return '';
		var d = new Date(date),
				datestring = d.getDate()  + "/" + (d.getMonth()+1) + "/" + d.getFullYear() + " " + d.getHours() + ":" + d.getMinutes();
		return datestring;
	}
}
