import {Component, OnInit} from 'angular2/core';
import {Session} from '../../../services/session';
import {ROUTER_DIRECTIVES, Router} from 'angular2/router';
import {CanActivate} from 'angular2/router';
import {TutorService} from '../../../services/tutor';
import {FORM_DIRECTIVES, FormBuilder, Control, ControlGroup, Validators} from 'angular2/common';

@Component({
	selector: 'tutor-gocardless-success',
	templateUrl: '/components/tutor/gocardless/success.html',
	providers: [Session, TutorService],
	directives: [ROUTER_DIRECTIVES, FORM_DIRECTIVES]
})
export class GoCardlessPaymentSuccess implements OnInit{
	tutor_id: string = "";

	constructor(private _session: Session, private _tutorService: TutorService, private builder: FormBuilder, private _router: Router) {
			this.tutor_id = this._session.getCurrentId();
			this._session.setItem('success_subscription', true);
	}

	ngOnInit(){
		this._tutorService.updateTutorInfo({tutor_id: this.tutor_id}).subscribe((res) => {
				console.log(res);

        this._session.setItem('employeecount', res.employeecount);

        setTimeout(()=>{
          this._router.navigate(['TutorMain']);
        }, 1000)
		});
	}
}
