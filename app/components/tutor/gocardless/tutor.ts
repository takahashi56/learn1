import {Component} from 'angular2/core';
import {Session} from '../../../services/session';
import {ROUTER_DIRECTIVES, Router} from 'angular2/router';
import {CanActivate} from 'angular2/router';
import {TutorService} from '../../../services/tutor';
import {FORM_DIRECTIVES, FormBuilder, Control, ControlGroup, Validators} from 'angular2/common';

@Component({
	selector: 'tutor-gocardless-tutor',
	templateUrl: '/components/tutor/gocardless/tutor.html',
	providers: [Session, TutorService],
	directives: [ROUTER_DIRECTIVES, FORM_DIRECTIVES]
})
export class GoCardlessPayment {
	tutor_id: string = "";

	constructor(private _session: Session, private _tutorService: TutorService, private builder: FormBuilder, private _router: Router) {
			this.tutor_id = this._session.getCurrentId();
	}

	gotoGoCardlessPage(count, amount){
		this._tutorService.getRedirectUrl({tutor_id: this.tutor_id, count: count, amount: amount}).subscribe((res) => {
				console.log(res);
				window.open(res.redirect_url, '_blank');
		});
	}
}
