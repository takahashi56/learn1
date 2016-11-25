import {Component, OnInit} from 'angular2/core';

import {Router, Route, RouteConfig, RouterOutlet, ROUTER_DIRECTIVES} from 'angular2/router';
import {TutorMain} from './main/main';
import {AddTutorStudent} from './add/student';
import {DetailTutorStudent} from './detail/student';
import {DetailTutorCourse} from './detail/course';
import {StripePayment} from './stripe/tutor';
import {GoCardlessPayment} from './gocardless/tutor';
import {GoCardlessPaymentSuccess} from './gocardless/success';
import {GoCardlessPaymentFailure} from './gocardless/failure';
import {PastTutorStudent} from './past/tutor';


@Component({
	selector: 'tutor',
	templateUrl: '/components/admin/admin.html',
	directives: [ROUTER_DIRECTIVES, RouterOutlet]
})

@RouteConfig([
	new Route({ path: '/main', component: TutorMain, name: 'TutorMain', useAsDefault:true }),
	new Route({ path: '/main/stripe', component: StripePayment, name: 'StripePayment'}),
	new Route({ path: '/main/gocardless', component: GoCardlessPayment, name: 'GoCardlessPayment'}),
	new Route({ path: '/main/gocardless/success', component: GoCardlessPaymentSuccess, name: 'GoCardlessPaymentSuccess'}),
	new Route({ path: '/main/gocardless/failure', component: GoCardlessPaymentFailure, name: 'GoCardlessPaymentFailure'}),
	new Route({ path: '/add/student', component: AddTutorStudent,  name: 'AddTutorStudent'}),
	new Route({ path: '/detail/student', component: DetailTutorStudent, name: 'DetailTutorStudent' }),
	new Route({ path: '/detail/course', component: DetailTutorCourse, name: 'DetailTutorCourse' }),
	new Route({ path: '/main/past', component: PastTutorStudent, name: 'PastTutorStudent' })
])

export class Tutor {
	constructor() {

	}

}
