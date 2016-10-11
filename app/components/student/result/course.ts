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
	showOrFalse: boolean = false;

	constructor(private _session: Session, private _studentService: StudentService, private router:Router) {
		this.showLessonResult = [];
		this.username = _session.getCurrentUsername();

		this.coursetitle = this._session.getItem('CourseName');

		var lessonList = JSON.parse(this._session.getItem('lessonList')), flag = true, count = 0, progress = lessonList.length, total=0, right=0;

		lessonList.forEach((lesson) => {
			var status = JSON.parse(this._session.getItem(lesson.lesson_id)), s = 0;
			console.log(status.score);
			if(Number(status.score) == -1){
				flag = false;
				progress--;
				s = 0;
			}else{
				s = parseInt(status == null ? 0 : status.score);
			}
			
			total += parseInt(status.total);
			right += Math.floor(status.total * s / 100);

			s = isNaN(s) ? 0 : s;
			this.score += s
		});

		if(flag == false) progress = progress / lessonList.length * 100;
		this.showOrFalse = flag;

		this.score = Math.floor( right / total * 100);	
		console.log("DDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD")
		console.log(total);
		console.log(right);
		var student_id = this._session.getCurrentId(), coures_id = this._session.getItem('CourseId'), score = this.score;

		console.log(`student id = ${student_id}`);
		this._studentService.setCourseScoreWithStudent({student_id: student_id, course_id:coures_id, score: score, isCompleted: flag, progress: progress }).subscribe((res)=>{
			console.log(res)
			if(flag == false){
				this.router.navigate(['StudentCourse'])
			}
		});

		lessonList.forEach((lesson)=>{
			var status = JSON.parse(this._session.getItem(lesson.lesson_id)),
				temp = {
					lessonname: lesson.lessonname,
					total: status == null? 0 : status.total,
					right: status == null? 0 : Math.floor(status.total * status.score / 100)
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