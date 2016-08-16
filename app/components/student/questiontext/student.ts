import {Component, OnInit} from 'angular2/core';
import {Session} from '../../../services/session';
import {ROUTER_DIRECTIVES, Router} from 'angular2/router';
import {CanActivate} from 'angular2/router';
import {StudentService} from '../../../services/student';

@Component({
	selector: 'student-text',
	templateUrl: '/components/student/questiontext/student.html',
	providers: [Session, StudentService],
	directives: [ROUTER_DIRECTIVES],
})
export class StudentText implements OnInit {

	courseList: any = [];

	constructor(private _session: Session, private _studentService: StudentService, private _router: Router) {

		this._session.setItem('editORadd', JSON.stringify({flag: false}));

	}

	ngOnInit(){

	}	
}

