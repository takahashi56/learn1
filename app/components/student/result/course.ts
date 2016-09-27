import {Component} from 'angular2/core';
import {Session} from '../../../services/session';
import {CanActivate} from 'angular2/router';
import {ROUTER_DIRECTIVES, Router} from 'angular2/router';
import {StudentService} from '../../../services/student';


@Component({
	selector: 'student-course-result',
	templateUrl: '/components/student/result/course.html',
	providers: [Session,StudentService],
	directives: [ROUTER_DIRECTIVES]
})


export class CourseResult {
	username: string = "";
	coursetitle: string;
	score: number = 0;
	showResultOrfalse: boolean = false;
	showLessonResult: any= [];

	constructor(private _session: Session, private _studentService: StudentService, private router:Router) {
		this.showLessonResult = [];
		this.username = _session.getCurrentUsername();

		this.coursetitle = this._session.getItem('CourseName');

		var lessonList = JSON.parse(this._session.getItem('lessonList')), self = this, count = 0;

		lessonList.forEach(function(lesson){
			console.log("lesson list ok")
			console.log(lessonList);
			console.log(lesson.lesson_id);
			var status = JSON.parse(self._session.getItem(lesson.lesson_id));

			var	s = parseInt(status == null ? 0 : status.score);

			s = isNaN(s) ? 0 : s;
			self.score += s
		});

		console.log("--------------------------------------------------")
		console.log(this.score);
		this.score = Math.floor( this.score / (lessonList.length));

		var student_id = this._session.getCurrentId(), coures_id = this._session.getItem('CourseId'), score = this.score;

		console.log(`student id = ${student_id}`);
		this._studentService.setCourseScoreWithStudent({student_id: student_id, course_id:coures_id, score: score }).subscribe((res)=>{
			console.log(res)
		});

		lessonList.forEach((lesson)=>{
			var status = JSON.parse(this._session.getItem(lesson.lesson_id)),
				temp = {
					lessonname: lesson.lessonname,
					total: status == null? 0 : status.total,
					right: status == null? 0 : status.right
				};
			this.showLessonResult.push(temp);
		})

	}

	showResult(){
		this.showResultOrfalse = true;
	}

	gotoFinish(){
		this.router.navigate(['StudentCourse']);
	}

	doLogout(){
		this.router.navigate(['Login'])
	}
}