import {Component} from 'angular2/core';
import {Session} from '../../../services/session';
import {ROUTER_DIRECTIVES} from 'angular2/router';
import {CanActivate} from 'angular2/router';

@Component({
	selector: 'tutor-detail-student',
	templateUrl: '/components/tutor/detail/student.html',
	providers: [Session],
	directives: [ROUTER_DIRECTIVES]
})
export class DetailTutorStudent {
	constructor(private _session: Session) {
		console.log('in the constructor');
	}

	doLogin(form: any) {
		// this._session.login(form.username, form.password);
	}
}