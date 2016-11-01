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
    submit_disabled: boolean = false;


    constructor(private _session: Session, private _tutorService: TutorService, private builder: FormBuilder, private _router: Router, private _ngZone: NgZone) {
        if (this._session.getCurrentId() == null) {
            this._router.navigateByUrl('/login');
        } else {
            this.tutor_id = this._session.getCurrentId();
            this.sentShow = false;
            this.sentStatus = "";

            this._tutorService.getStripeTransactionHistory({ tutor_id: this.tutor_id }).subscribe((res) => {
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

    }

    isNumberKey(evt) {
        evt = (evt) ? evt : window.event;
        var charCode = (evt.which) ? evt.which : evt.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            return false;
        }
        return true;
    }

    isCreditNumber(evt, form: any) {
        evt = (evt) ? evt : window.event;
        var charCode = (evt.which) ? evt.which : evt.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57) ) {
            return false;
        }
        var val = form.card_number;
        if(val.length >= 19) return false;
        var newval = '';
        val = val.replace(/\D+/g, '');
        for (var i = 0; i < val.length; i++) {
            if (i % 4 == 0 && i > 0) newval = newval.concat(' ');
            newval = newval.concat(val[i]);
        }
        (<Control>this.stripe_form.controls['card_number']).updateValue(newval);
    }

    isValidateEmail(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

    getPaid(form: any) {
        this.submit_validate = true;
        if (this.stripe_form.valid && !this.validateExpireDate(form) && !this.validateCardNumber(form.card_number) && this.isValidateEmail(form.email)) {
            this.getToken(form);
        }
    }

    validateCardNumber(card_number) {
        if (this.submit_validate == true && (card_number == '' || card_number == null || card_number.length != 19)) {
            this.sentShow = true;

            this.showClass = "alert alert-danger alert-dismissable";
            this.sentStatus = "Your Card Number Must be Correct. Please type card number again";
            return true;
        }
        this.sentShow = false;
        return false;
    }

    validateExpireDate(form) {
        var date = new Date();

        if (this.submit_validate == true &&
            ((Number(form.expire_year) < (date.getFullYear() - 2000)) ||
                (Number(form.expire_year) == (date.getFullYear() - 2000) && Number(form.expire_month) < (date.getMonth())) ||
                (Number(form.expire_year) > (date.getFullYear() - 2000) && Number(form.expire_month) > 12))) {

            this.sentShow = true;

            this.showClass = "alert alert-danger alert-dismissable";
            this.sentStatus = "Expire Information Must be Correct. Please type expire month and year again";
            return true;

        }
        this.sentShow = false;
        return false;
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
        this.submit_disabled = false;
        if (flag == true) {
            this._session.setItem('creditcount', res.creditcount);
            this.trans_history.push(res.trans);

            this.showClass = "alert alert-success alert-dismissable";
            this.sentStatus = "Your Payment has been successfully. You have got the new credits " + res.creditcount;

            setTimeout(() => {
                this._router.navigate(['TutorMain'])
            }, 2000)
        } else {
            this.showClass = "alert alert-danger alert-dismissable";
            this.sentStatus = "Your Payment has not been failed. Please type your card information correctly!";

        }
    }

    getToken(form) {
        this.submit_disabled = true;
        var creditcount = this._session.getItem('creditcount');
        this._tutorService.performPayment({ tutor_id: this.tutor_id, form: form, creditcount: creditcount }).subscribe((res) => {
            this.updateUI(res.flag, res.data);
        })
    }

    cancel() {
        this._router.navigate(['TutorMain']);
    }
}
