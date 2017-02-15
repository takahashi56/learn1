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

	@Output() gotoNextContent = new EventEmitter();
	@Output() gotoPreviousContent = new EventEmitter();

	currentStep: number = 1;
    totalCount: number = 1;
    tempSession: any;

	constructor(private _session: Session, private _studentService: StudentService, private _router: Router) {
		this.tempSession = _session;
	}
	

	ngOnInit(){
		this.checkedStatus = '<i class="fa"></i>';
		var h = window.innerHeight;
        document.getElementById('section_id').setAttribute("style","height:" + (h - 30) + "px");
        document.getElementById('iframe_div_id').setAttribute("style", "height: " + (h - 30) + "px");

		this.currentStep = this.tempSession.getItem('currentStep');
        this.totalCount = this.tempSession.getItem('totalCount');

        $(".section_div .iframe-progress span").css("width", this.currentStep/this.totalCount*100+"%");

        if (this.currentStep == 1) {
            $(".section_div .iframe-controls_prev").fadeOut(200);
        }
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

		var self = this;
        
        this.currentStep++;
        if (this.currentStep == 1) {
            $(".section_div .iframe-controls_prev").fadeOut(50);
        }

        $(".section_div .iframe-container-wrap").fadeOut(150, function(){
            self.gotoNextContent.emit({});
            $(".section_div .iframe-container-wrap").fadeIn(300);
        });

        $(".section_div .iframe-controls_prev").fadeIn(200);

        $(".section_div .iframe-progress span").css("width", this.currentStep/this.totalCount*100+"%");
	}

	gotoPrevious(){
		this.checkedRadio = 'fifth';
		//var self = this;

		//self.gotoPreviousContent.emit({});

		var self = this;
        
        this.currentStep--;
        if (this.currentStep == 1) {
            $(".section_div .iframe-controls_prev").fadeOut(50);
        }
        
        $(".section_div .iframe-container-wrap").fadeOut(150, function(){
            self.gotoPreviousContent.emit({});
            $(".section_div .iframe-container-wrap").fadeIn(300);
        });

        $(".section_div .iframe-controls_next").fadeIn(200);

        $(".section_div .iframe-progress span").css("width", this.currentStep/this.totalCount*100+"%");
	}

	getImagePath(image: string) : string{
		return "images/upload/"+image;
	}
}
