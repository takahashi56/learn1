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
    iterator: any = [1,2,3,4];
	checkedStatus: string = '';

	@Input() content: any;
	@Input() lessonname: string;
	@Input() index: number;

	@Output() gotoNextContent=new EventEmitter();
	@Output() gotoPreviousContent=new EventEmitter();

	constructor(private _session: Session, private _studentService: StudentService, private _router: Router) {
	}
	

	ngOnInit(){
		this.checkedStatus = '<i class="fa"></i>';
		var h = window.innerHeight;
        document.getElementById('section_id').setAttribute("style","height:" + (h - 56) + "px");
		console.log(this.content);
	}

	chooseAnswer(n: number){
		switch(n){
			case 1: this.checkedRadio = 'first'; break;
			case 2: this.checkedRadio = 'second'; break;
			case 3: this.checkedRadio = 'third'; break;
			case 4: this.checkedRadio = 'fourth'; break;
			default: this.checkedRadio = ''; break;
		}

		this.answerNumber = n;
	}

	gotoNext(){

		if(this.checkedRadio == 'fifth') return;

		if(this.answerNumber == 0) return false;

		this.checkedRadio = 'fifth';
		if(this.content.trueNumber == this.answerNumber){
			var count = parseInt(this._session.getItem('rightQuestionCount'));
			count++;

			this._session.setItem('rightQuestionCount', count);
		}
		this.gotoNextContent.emit({});
	}

	gotoPrevious(){
		// this.changeChecked(null);
		this.checkedRadio = 'fifth';
		this.gotoPreviousContent.emit({});
	}

	getImagePath(image: string) : string{
		return "images/upload/"+image;
	}
}
