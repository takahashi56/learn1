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
			this.downloadpdf();
  }

	downloadpdf(){
			let self = this;
			html2canvas(document.getElementById('pdffromHtml'), {
					onrendered: function (canvas) {
							var ctx = canvas.getContext("2d");
							var data = canvas.toDataURL("image/png", 1.5);
							console.log(data)
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
							self._tutorService.makePdf({data:para.innerHTML}).subscribe((res) => {
								 window.location.href = '/pdf-viewer/web/viewer.html?file=/pdf/' + res.url;
								 console.log(res.url);
							})
					}
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
