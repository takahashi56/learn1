import {provide} from 'angular2/core';
import {bootstrap} from 'angular2/platform/browser';
import {HTTP_PROVIDERS, Http} from 'angular2/http';
import {ROUTER_PROVIDERS} from 'angular2/router';
import {Location,PathLocationStrategy, LocationStrategy, HashLocationStrategy} from 'angular2/platform/common';
import {AppComponent} from './app';
import {Session} from './services/session';
import {TutorService} from './services/tutor';
import {AppConfig} from './services/config';
import {AuthHttp, AuthConfig} from 'angular2-jwt';
import {enableProdMode} from 'angular2/core';
// import {IDLE_PROVIDERS} from 'ng2-idle/core';

enableProdMode();

bootstrap(AppComponent, [
		Session,
		TutorService,
		AppConfig,
		HTTP_PROVIDERS,
		ROUTER_PROVIDERS,
		// IDLE_PROVIDERS,
		provide(LocationStrategy, {useClass: HashLocationStrategy}),
		provide(AuthHttp, {
			useFactory: (http) => {
				return new AuthHttp(new AuthConfig(), http);
			},
			deps: [Http]
		})
	])
	.catch(err => console.error(err));
