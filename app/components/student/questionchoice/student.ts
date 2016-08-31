import {Component, OnInit, Input, Output, EventEmitter} from 'angular2/core';
import {Session} from '../../../services/session';
import {ROUTER_DIRECTIVES, Router} from 'angular2/router';
import {CanActivate} from 'angular2/router';
import {StudentService} from '../../../services/student';

@Component({
	selector: 'student-choice',
	templateUrl: '/components/student/questionchoice/student.html',
	providers: [Session, StudentService],
	directives: [ROUTER_DIRECTIVES],
})
export class QuestionChoice implements OnInit {

	courseList: any = [];
	answerNumber: number = 0;
	checkedRadio: string = '0';
    iterator: any = [1,2,3];

	@Input() content: any;
	@Input() lessonname: string;
	@Input() index: number;

	@Output() gotoNextContent=new EventEmitter();
	@Output() gotoPreviousContent=new EventEmitter();
	
	constructor(private _session: Session, private _studentService: StudentService, private _router: Router) {

	}

	ngOnInit(){
	}

	chooseAnswer(n: number){
		console.log(`checked radio before: ${this.checkedRadio}`)
		this.checkedRadio = n.toString();
		this.answerNumber = n;
		console.log(`checked radio after: ${this.checkedRadio}`)
	}

	gotoNext(){
		console.log(`checked radio next before: ${this.checkedRadio}`)
		if(this.answerNumber == 0) return false;

		console.log(this.content.trueNumber);
		if(this.content.trueNumber == this.answerNumber){
			var count = parseInt(this._session.getItem('rightQuestionCount'));
			count++;
			console.log("Count :"+ count);

			this._session.setItem('rightQuestionCount', count);
		}
		this.checkedRadio = '0';
		console.log(`checked radio next after: ${this.checkedRadio}`)
		this.gotoNextContent.emit({});
	}

	gotoPrevious(){
		this.checkedRadio = '0';
		this.gotoPreviousContent.emit({});	
	}
}

