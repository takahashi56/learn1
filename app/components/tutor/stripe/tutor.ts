import {Component, NgZone} from 'angular2/core';
import {Session} from '../../../services/session';
import {ROUTER_DIRECTIVES, Router} from 'angular2/router';
import {CanActivate} from 'angular2/router';
import {TutorService} from '../../../services/tutor';
import {FORM_DIRECTIVES, FormBuilder, Control, ControlGroup, Validators} from 'angular2/common';

@Component({
    selector: 'tutor-stripe-tutor',
    templateUrl: '/components/tutor/stripe/tutor.html',
    providers: [Session, TutorService],
    directives: [ROUTER_DIRECTIVES, FORM_DIRECTIVES]
})
export class StripePayment {

    stripe_form: ControlGroup;
    card_holder: Control;
    email: Control;
    card_number: Control;
    amount: Control;
    expire_month: Control;
    expire_year: Control;
    card_cvv: Control;
    submit_validate: boolean = false;

    stripe_publish_key: string = '';
    tutor_id: string = '';
    trans_history: any[] = [];
    sentStatus: string = "";
    sentShow: boolean = false;
    showClass: string = "";
    credits: any = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];


    constructor(private _session: Session, private _tutorService: TutorService, private builder: FormBuilder, private _router: Router, private _ngZone: NgZone) {

        this.tutor_id = this._session.getCurrentId();
        this.sentShow = false;
        this.sentStatus = "";

        this._tutorService.getStripeTransactionHistory({ tutor_id: this.tutor_id }).subscribe((res) => {
            console.log(res);
            this.trans_history = res;
        })

        this.card_holder = new Control('', Validators.required);
        this.email = new Control('', Validators.required);
        this.card_number = new Control('', Validators.required);
        this.amount = new Control('', Validators.required);
        this.expire_month = new Control('', Validators.compose([Validators.required, Validators.maxLength(2)]));
        this.expire_year = new Control('', Validators.compose([Validators.required, Validators.maxLength(2)]));
        this.card_cvv = new Control('', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(4)]));

        this.stripe_form = builder.group({
            card_holder: this.card_holder,
            email: this.email,
            card_number: this.card_number,
            amount: this.amount,
            expire_month: this.expire_month,
            expire_year: this.expire_year,
            card_cvv: this.card_cvv
        });

    }

    isNumberKey(evt) {
        evt = (evt) ? evt : window.event;
        var charCode = (evt.which) ? evt.which : evt.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            return false;
        }
        return true;
    }

    isValidateEmail(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

    getPaid(form: any) {
        this.submit_validate = true;
        if (this.stripe_form.valid) {
            console.log(form);
            this.getToken(form);
        }
    }

    getCreatedPaidDate(dateString) {
        var date = new Date(dateString);
        var options = {
            weekday: "short", year: "numeric", month: "short",
            day: "numeric", hour: "2-digit", minute: "2-digit"
        };

        return date.toLocaleTimeString("en-GB", options);
    }

    updateUI(flag, res) {
        this.sentShow = true;
        if (flag == true) {
            this._session.setItem('creditcount', res.creditcount);
            this.trans_history.push(res.trans);

            console.log(this.sentShow);
            this.showClass = "alert alert-success alert-dismissable";
            this.sentStatus = "Your Payment has been successfully. You have got the new credits " + res.creditcount;
        } else {
            this.showClass = "alert alert-danger alert-dismissable";
            this.sentStatus = "Your Payment has not been failed. Please type your card information correctly!";

        }
    }

    getToken(form) {
				var creditcount = this._session.getItem('creditcount');
        this._tutorService.performPayment({ tutor_id: this.tutor_id, form: form, creditcount: creditcount }).subscribe((res) => {
            console.log(res);
            this.updateUI(res.flag, res.data);
        })
    }
}
