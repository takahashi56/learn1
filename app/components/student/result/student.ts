import {Component} from 'angular2/core';
import {Session} from '../../../services/session';
import {ROUTER_DIRECTIVES, Router} from 'angular2/router';

@Component({
	selector: 'student-lesson-result',
	templateUrl: '/components/student/result/student.html',
	providers: [Session],
	directives: [ROUTER_DIRECTIVES]
})


export class LessonResult {
	username: string = "";

	constructor(private _session: Session, private router:Router) {
		this.username = _session.getCurrentUsername();
	}

	doLogout(){
		this.router.navigate(['Login'])
	}
}