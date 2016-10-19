import {Component} from 'angular2/core';
import {Router, Route, RouteConfig, RouterOutlet, ROUTER_DIRECTIVES} from 'angular2/router';
// import {Idle, DEFAULT_INTERRUPTSOURCES} from 'ng2-idle/core';
// import {AuthenticatedRouterOutlet} from './directives/authnpm enticated-router-outlet';
import {Home} from './components/home/home';
import {Login} from './components/login/login';
import {Dashboard} from './components/dashboard/dashboard';
import {SignUp} from './components/signup/signup';
import {Forgetpwd} from './components/forgetpwd/forgetpwd';
import {CertificateView} from './components/certificate/certificate';
import {Resetpwd} from './components/resetpwd/resetpwd';
import {Matrix} from './components/matrix/matrix';
import {UnCompletedCourse} from './components/uncompleted/course';


@Component({
	selector: 'my-app',
	templateUrl: './app.html',
	directives: [RouterOutlet,ROUTER_DIRECTIVES]
})
@RouteConfig([
	new Route({ path: '/login', component: Login, name: 'Login', useAsDefault:true }),
	new Route({ path: '/dashboard', component: Dashboard, name: 'Dashboard' }),
	new Route({ path: '/home/...', component: Home, name: 'Home' }),
	new Route({ path: '/signup', component: SignUp, name: 'SignUp' }),
	new Route({ path: '/forgetpwd', component: Forgetpwd, name: 'Forgetpwd' }),
	new Route({ path: '/resetpwd', component: Resetpwd, name: 'Resetpwd' }),
	new Route({ path: '/certificate', component: CertificateView, name: 'CertificateView' }),
	new Route({ path: '/home/tutor/matrix', component: Matrix, name: 'Matrix' }),
	new Route({ path: '/home/tutor/uncompleted', component: UnCompletedCourse, name: 'UnCompletedCourse' })
])
export class AppComponent{

}
