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
	gotoDetail(course: any){
		this._session.setItem('TutorCourse', JSON.stringify(course));
		this._router.navigate(['DetailTutorCourse']);
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
		this._session.setItem('SelectCourseWithId', value)
	}

	onSelectStudent(value){
		this._session.setItem('SelectStudentWithId', value)
	}

	studentAssign(){
		var id = this._session.getItem('SelectStudentWithId');
		if(!id) return false;

		let selectedId = this._session.getItem('AssignCourse');
		if(!selectedId) return false;

		let ids = [];
		ids.push(selectedId);

		this._tutorService.setAssignStudentsWithCourse(id,ids).subscribe((res)=>{
			console.log(res);
		});;
	}

	courseAssign(){
		var id = this._session.getItem('SelectCourseWithId');
		if(!id) return false;

		let selectedId = this.studentList.filter((x)=>x.isSelected);
		if(selectedId.length == 0) return false;
		
		let ids = [];
		selectedId.forEach(function(select){
			ids.push(select.student_id);
		});

		this._tutorService.setAssignStudentsWithCourse(id,ids).subscribe((res)=>{
			console.log(res);
		});

	}

	importAddStudent(e){
		console.log(e);
		 var files = e.srcElement.files;
	    console.log(files);    

	  	// this._tutorService.makeFileRequest(files).subscribe((res)=>{
	  	// 	console.log('sent');
	  	// })
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