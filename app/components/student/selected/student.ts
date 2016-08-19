import {Component, OnInit} from 'angular2/core';
import {Session} from '../../../services/session';
import {ROUTER_DIRECTIVES, Router} from 'angular2/router';
import {CanActivate} from 'angular2/router';
import {StudentService} from '../../../services/student';
import {StudentVideo} from '../video/student';
import {QuestionText} from '../questiontext/student';
import {QuestionChoice} from '../questionchoice/student';


@Component({
	selector: 'selected-content',
	templateUrl: '/components/student/selected/student.html',
	// template: '<h1>22</h1>',
	providers: [Session, StudentService],
	directives: [ROUTER_DIRECTIVES,StudentVideo,QuestionText,QuestionChoice],
})
export class SelectedContent implements OnInit {

	currentLesson: any = [];
	contents: any;
	currentContent: any;
	lessonname: string;
	lessonindex: number;
	lessontotal: number;
	index: number = 0;

	constructor(private _session: Session, private _studentService: StudentService, private _router: Router) {
		this.contents = JSON.parse(this._session.getItem('SelectedContents'));
		this.currentLesson = JSON.parse(this._session.getItem('SelectedLessonById'));
		
		this.currentContent = this.contents[0];
		this.index = 0;
		this.lessonindex = this._session.getItem('SelectedLessonIndex');
		this.lessontotal = this._session.getItem('TotalLesson');	
		this.lessonname = this.currentLesson.lessonname;
	}

	ngOnInit() {
			
	}	


	gotoNextContent(event){		
		console.log(this.contents.length);
		console.log(this.index);
		if((this.index + 1) > this.contents.length){
			return this.gotoResultPage();			
		}else{			
			this.index += 1;
			this.currentContent = this.contents[this.index];	
		}		
	}

	gotoPreviousContent(event){
		console.log(this.index);
		
		if((this.index - 1) < 0) return false;

		console.log(this.index);
		this.index -= 1;
		this.currentContent = this.contents[this.index];
	}

	gotoResultPage(){

	}


}