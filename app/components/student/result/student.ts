import {Component} from 'angular2/core';
import {Session} from '../../../services/session';
import {CanActivate} from 'angular2/router';
import {ROUTER_DIRECTIVES, Router} from 'angular2/router';
import {StudentService} from '../../../services/student';


@Component({
	selector: 'student-lesson-result',
	templateUrl: '/components/student/result/student.html',
	providers: [Session,StudentService],
	directives: [ROUTER_DIRECTIVES]
})


export class LessonResult {
	username: string = "";
	lessonname: string;

	constructor(private _session: Session, private _studentService: StudentService, private router:Router) {
		console.log("this is result page");
		this.username = _session.getCurrentUsername();
		this.lessonname = this._session.getItem('LessonName');
	}

	gotoNextLesson(){
		var lessonList = JSON.parse(this._session.getItem('lessonList')), self = this, nextlesson :any = [], count = false, lessonIndex = Number(this._session.getItem('SelectedLessonIndex')) + 1;

		if(lessonList.length > lessonIndex){
			nextlesson = lessonList[lessonIndex];
			count = true;
		}
				
		console.log(count);
		console.log(nextlesson);

		if(!count){
			this.router.navigate(['CourseResult']);
		}else{
			this._studentService.getContentsByLessonId(nextlesson.lesson_id).subscribe((res) => {
				this._session.setItem('SelectedContents', '');			
				this._session.setItem('SelectedContents', JSON.stringify(res));			
				this._session.setItem('SelectedLessonById', JSON.stringify(nextlesson));
				this._session.setItem('SelectedLessonId', nextlesson.lesson_id);
				this._session.setItem('SelectedLessonIndex', lessonIndex);
				this._session.setItem('TotalLesson', lessonList.length);
				this.router.navigate(['SelectedContent']);
			});			
		}

	}

	gotoFinish(){		
		this.router.navigate(['CourseResult']);
	}
}