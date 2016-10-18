import {Component, EventEmitter} from 'angular2/core';
import {Session} from '../../services/session';
import {ROUTER_DIRECTIVES, Router} from 'angular2/router';
import {AuthService} from '../../services/authentication';
import {TutorService} from '../../services/tutor';

@Component({
	selector: 'my-header',
	templateUrl: '/components/header/header.html',
	providers: [Session, AuthService, TutorService],
	directives: [ROUTER_DIRECTIVES]
})


export class Header {
	username: string = "";
	creditcount: Number = 0;
	currentRole: Number = Infinity;

	constructor(private _session: Session, private router:Router, private _tutorService: TutorService) {
		this.username = _session.getCurrentUsername();
		this.currentRole = this._session.getCurrentRole();
		if(this.currentRole == 1){
			this.creditcount = Number(this._session.getItem("creditcount"));
		}
	}

	ngOnInit(){
		if(this.username == null){
			console.log(this.username);
			this.router.navigate(['Login'])
			console.log("!!!!!!!!!!!!!!!!!!!!!!!!!")
		}

		this._tutorService.event_emitter.subscribe((decrease)=>{
			console.log("decrease credit");
			console.log(decrease);
			this.creditcount = Number(this._session.getItem('creditcount'));
		})
	}

	doLogout(){
		localStorage.clear();
		this.router.navigate(['Login'])
	}
}
