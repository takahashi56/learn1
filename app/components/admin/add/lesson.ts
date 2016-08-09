import {Component} from 'angular2/core';
import {Session} from '../../../services/session';
import {ROUTER_DIRECTIVES} from 'angular2/router';
import {CanActivate} from 'angular2/router';

@Component({
	selector: 'admin-add-lesson',
	templateUrl: '/components/admin/add/lesson.html',
	providers: [Session],
	directives: [ROUTER_DIRECTIVES]
})
export class AddLesson {
	constructor(private _session: Session) {
		console.log('in the constructor');
	}

	doLogin(form: any) {
		// this._session.login(form.username, form.password);
	}
}