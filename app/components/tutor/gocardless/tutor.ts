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
    employeecount: number = 0;

    constructor(private _session: Session, private _tutorService: TutorService, private builder: FormBuilder, private _router: Router) {
        if (this._session.getCurrentId() == null) {
            this._router.navigateByUrl('/login');
        } else {
            this.tutor_id = this._session.getCurrentId();
            this.employeecount = Number(this._session.getItem('employeecount'));
            if(Number(this._session.getItem('subscribing')) == 0){
              this.employeecount = (JSON.parse(this._session.getItem('TutorAllStudent'))).length;
            }
        }
    }

    gotoGoCardlessPage(count, amount) {
        this._tutorService.getRedirectUrl({ tutor_id: this.tutor_id, count: count, amount: amount }).subscribe((res) => {
            window.open(res.redirect_url, '_blank');
        });
    }
    cancel() {
        this._router.navigate(['TutorMain']);
    }

    getStatus(num: number){
      if(num > this.employeecount){
        return false;
      }else{
        return true;
      }
    }
}
