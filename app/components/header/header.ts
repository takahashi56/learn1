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
	show_credits: boolean = true;

	constructor(private _session: Session, private router:Router, private _tutorService: TutorService) {
		this.username = _session.getCurrentUsername();
		this.currentRole = this._session.getCurrentRole();
		var id = this._session.getCurrentId();

		if(this.username == null || id == null) {
			this.router.navigate(['Login'])
		}else if(this.currentRole == 1){
			this.creditcount = Number(this._session.getItem("creditcount"));
		}
	}

	ngOnInit(){
		setInterval(()=>{
			this.updateCreditCount()
		}, 1000);
		// this._tutorService.event_emitter.subscribe((decrease)=>{
		// 	console.log("decrease credit");
		// 	console.log(decrease);
		// 	this.creditcount = Number(this._session.getItem('creditcount'));
		// })
	}

	updateCreditCount(){
		this.creditcount = Number(this._session.getItem('creditcount'));
		this.username = this._session.getCurrentUsername();
		this.show_credits = Number(this._session.getItem('subscribing')) == 0 ? true : false;
	}

	doLogout(){
		localStorage.clear();
		this.router.navigate(['Login'])
	}

	gotoCreditsTab(){
		this.router.navigateByUrl('/home/tutor/main');
		this._session.setItem('select_tutor_tab', 4)
	}
}
