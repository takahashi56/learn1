import {Component, ViewChild, ElementRef, AfterViewInit} from 'angular2/core';
import {Session} from '../../services/session';
import {ROUTER_DIRECTIVES, Router} from 'angular2/router';
import {CanActivate} from 'angular2/router';
import {TutorService} from '../../services/tutor';

declare var $:JQueryStatic;
declare let html2canvas;
declare let pdfMake;
declare let PDFJS;


@Component({
	selector: 'uncompleted-course',
  templateUrl: '/components/uncompleted/course.html',
	providers: [Session,TutorService],
	directives: [ROUTER_DIRECTIVES]
})
export class UnCompletedCourse implements AfterViewInit {
  studentList: any[];
  courseList: any[];
  organization: string = '';

	constructor(private _session: Session, private _tutorService: TutorService, private _router: Router) {
    if(this._session.getCurrentId() == null || this._session.getCurrentUser() == null){
      this._router.navigate(['Login'])
    }else{
      this.organization = this._session.getItem('organization')
      this.courseList = JSON.parse(this._session.getItem('courseList'));
      var tutor_id = this._session.getCurrentId();
      this.studentList = JSON.parse(this._session.getItem('studentList'))
    }
	}

  ngAfterViewInit() {
			this.downloadpdf();
  }

	downloadpdf(){
		this._tutorService.makePdfLandscape({data:document.getElementById('pdffromHtml').innerHTML, direction: true}).subscribe((res) => {
			 window.location.href = '/pdf-viewer/web/viewer.html?file=/pdf/' + res.url;
		})
			/*let self = this;
			html2canvas(document.getElementById('pdffromHtml'), {
					onrendered: function (canvas) {
							var ctx = canvas.getContext("2d");
							var data = canvas.toDataURL("image/png", 1.5);
							var docDefinition = {
									content: [{
											image: data,
											width: 520,
									}]
							};

							var para =  document.getElementById("editor"),
									para1 = document.createElement("div"),
									image = document.createElement("img"),
									image1 = document.createElement('img');
							image.src = data;
							para.appendChild(image);
							// self.makeHighResScreenshot(image, image1, 200);
							// para1.appendChild(image);
							self._tutorService.makePdf({data:document.getElementById('pdffromHtml').innerHTML, direction: true}).subscribe((res) => {
								 window.location.href = '/pdf-viewer/web/viewer.html?file=/pdf/' + res.url;
							})
					}
			});*/
	}
  getCourseName(student_course: any){
    var course_names:string = "";
    student_course.forEach((c) => {
      this.courseList.forEach((course) => {
        if(c.course_id == course.course_id && c.isCompleted == false){
          course_names += course.coursetitle + "; ";
        }
      })
    })
    return course_names;
  }
}
