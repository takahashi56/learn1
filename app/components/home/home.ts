import {Component, OnInit} from 'angular2/core';

import {Header} from '../header/header';
import {Router, Route, RouteConfig, RouterOutlet, ROUTER_DIRECTIVES} from 'angular2/router';
import {Admin} from '../admin/admin';
import {Session} from '../../services/session';
import {Tutor} from '../tutor/tutor';
import {CanActivate} from 'angular2/router';
import {Student} from '../student/student';

@Component({
	selector: 'home',
	templateUrl: '/components/home/home.html',
	providers: [Session],
	directives: [ROUTER_DIRECTIVES, Header, RouterOutlet],
})

@RouteConfig([
	new Route({ path: '/admin/...', component: Admin, name: 'Admin'  }),
	new Route({ path: '/tutor/...', component: Tutor, name: 'Tutor' }),
	new Route({ path: '/student/...', component: Student, name: 'Student', useAsDefault:true}),
])

export class Home implements OnInit {
	constructor(private _router: Router, private _session: Session) {
		console.log(this._session.getCurrentRole())

		var role = this._session.getCurrentRole(),
			url = this._session.getItem('homeUrl');
		console.log(url);
		// this._router.navigate(['AdminMain']);
		this._router.navigateByUrl(url);
	}
	ngOnInit(){

	}
}
