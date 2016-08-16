import {Component, OnInit} from 'angular2/core';

import {Router, Route, RouteConfig, RouterOutlet, ROUTER_DIRECTIVES} from 'angular2/router';
import {StudentMain} from './main/main';
import {StudentLesson} from './lesson/student';
import {StudentText} from './questiontext/student';
import {StudentChoice} from './questionchoice/student';
import {StudentVideo} from './video/student';

@Component({
	selector: 'student',
	templateUrl: '/components/admin/admin.html',
	directives: [ROUTER_DIRECTIVES, RouterOutlet]
})

@RouteConfig([
	new Route({ path: '/main', component: StudentMain, name: 'StudentCourse', useAsDefault:true }),
	new Route({ path: '/lesson', component: StudentLesson,  name: 'StudentLesson'}),
	new Route({ path: '/text', component: StudentText, name: 'StudentText' }),
	new Route({ path: '/choice', component: StudentChoice, name: 'StudentChoice' }),
	new Route({ path: '/video', component: StudentVideo, name: 'StudentVideo' }),
])

export class Student {
	constructor() {

	}
	
}