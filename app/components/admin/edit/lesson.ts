import {Component} from 'angular2/core';
import {Session} from '../../../services/session';
import {ROUTER_DIRECTIVES} from 'angular2/router';
import {CanActivate} from 'angular2/router';

@Component({
	selector: 'admin-edit-lesson',
	templateUrl: '/components/admin/edit/lesson.html',
	providers: [Session],
	directives: [ROUTER_DIRECTIVES]
})
export class EditLesson {
	constructor(private _session: Session) {
	}

	doLogin(form: any) {
		// this._session.login(form.username, form.password);
	}
}
