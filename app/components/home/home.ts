import {Component, OnInit} from 'angular2/core';

import {Header} from '../header/header';
import {Router, Route, RouteConfig, RouterOutlet, ROUTER_DIRECTIVES} from 'angular2/router';
import {Admin} from '../admin/admin';
import {Session} from '../../services/session';
// import {Tutor} from '../tutor/tutor';
// import {Student} from '../student/student';

@Component({
	selector: 'home',
	templateUrl: '/components/home/home.html',
	directives: [ROUTER_DIRECTIVES, Header, RouterOutlet],
})

@RouteConfig([
	new Route({ path: '/admin/...', component: Admin, name: 'Admin', useAsDefault:true }),
	// new Route({ path: '/tutor/...', component: Admin, name: 'Tutor' }),
	// new Route({ path: '/student/...', component: Admin, name: 'Student' }),
])

export class Home implements OnInit {
	constructor(private _router: Router, private _session: Session) {

	}
	ngOnInit(){
		console.log(this._session.getCurrentRole())
		if(this._session.getCurrentRole() != '0'){
			this._router.navigateByUrl('login');
		}
	}
}