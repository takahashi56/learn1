import {Component, OnInit} from 'angular2/core';
import {ROUTER_DIRECTIVES} from 'angular2/router';

import {Session} from '../../services/session';
import {UserService} from '../../services/user';

@Component({
	selector: 'home',
	templateUrl: '/components/home/home.html',
	directives: [ROUTER_DIRECTIVES],
	providers: [UserService]
})
export class Home implements OnInit {
	constructor(private _session: Session, private _user: UserService) {
	}

	ngOnInit() {
	}

	login(){
		console.log("dfadsa");
		this._session.login();
	}
	
	getUserList() {
		this._user.getUsers().subscribe(
			users => console.log(users),
			error => console.error(error)
		);
	}
}