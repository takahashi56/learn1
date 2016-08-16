import {Component, OnInit} from 'angular2/core';
import {Session} from '../../../services/session';
import {ROUTER_DIRECTIVES, Router} from 'angular2/router';
import {CanActivate} from 'angular2/router';
import {TutorService} from '../../../services/tutor';

@Component({
	selector: 'tutor-main',
	templateUrl: '/components/tutor/main/main.html',
	providers: [Session, TutorService],
	directives: [ROUTER_DIRECTIVES],
})
export class TutorMain implements OnInit {

	studentList: any = [];
	courseList: any = [];

	constructor(private _session: Session, private _tutorService: TutorService, private _router: Router) {

		this._session.setItem('editORadd', JSON.stringify({flag: false}));


		this._tutorService.getAllStudents().subscribe((res)=>{
			this.studentList = res;	
			this._session.setItem('TutorAllStudent', JSON.stringify(res))
		});

		this._tutorService.getAllCourses().subscribe((res)=>{
			this.courseList = res;	
			console.log(res);
		});
	}

	editStudent(student: any){
		console.log(student.student_id);
		this._session.setItem('editORadd', JSON.stringify({flag: true}));
		this._session.setItem('TutorStudent', JSON.stringify(student));
		this._router.navigate(['AddTutorStudent']);
	}


	ngOnInit(){
	}

	gotoStudentDetail(student: any){
		this._session.setItem('TutorStudent', JSON.stringify(student));
		this._router.navigate(['DetailTutorStudent']);
	}

	gotoAddStudent(){
		var data = {
			student_id: Date.now(),
			firstName: '',
			lastName: '',
			DOB: '',
			username: '',
			hashed_pwd: '',
			other: '',
			phone: '',
		}

		this._session.setItem('editORadd', JSON.stringify({flag: false}));
		this._session.setItem('TutorStudent', JSON.stringify(data));

		this._router.navigate(['AddTutorStudent']);
	}

	beforeAssignStudent(course){
		this._session.setItem('AssignCourse', course)
	}

	onSelectCourse(value){
		console.log(value);
	}

	onSelectStudent(value){
		console.log(value);
	}

	studentAssign(){
		
	}

	courseAssign(){

	}

	importAddStudent(){

	}

	assignCourseToStudent(){

	}

	assignStudentToCourse(){

	}

	gotoCourseByClick(){

	}

	doLogin(form: any) {
		
	}
}