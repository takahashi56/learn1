import {Component, Input, Output, OnInit, EventEmitter} from 'angular2/core';
import {Session} from '../../../services/session';
import {AdminService} from '../../../services/admin';
import {FORM_DIRECTIVES, FormBuilder, Control, ControlGroup, Validators} from 'angular2/common';


@Component({
	selector: 'lesson-content',
	templateUrl: '/components/admin/add/content.html',
	providers: [Session, AdminService],
})

export class LessonContent implements OnInit{
	@Input() content: any;
	@Output() manageContent = new EventEmitter();

	videoOrQuestion: boolean = false;
	contentForm: ControlGroup;
	videoLabel: Control;
	videoEmbedCode: Control;
	singleOrMulti: boolean = false;
	questionType: boolean = false;
	question: Control;
	answerA: Control;
	answerB: Control;
	answerC: Control;
	answerD: Control;
	image: string;
	trueNumber: number = 0;
	submitAttempt: boolean = false;

	private _content_id : string;

	constructor(private _session: Session, private builder: FormBuilder, private _adminService: AdminService) {

	}

	ngOnInit(){
		this._content_id = this.content._content_id ? this.content._content_id : this.content._id;
		this.videoOrQuestion = this.content.videoOrQuestion;
		this.singleOrMulti = this.content.singleOrMulti;

		this.questionType = this.content.questionType == true ? true : false;
		this.image = this.content.image;
		this.videoLabel = new Control(this.content.videoLabel,Validators.required);
		this.videoEmbedCode = new Control(this.content.videoEmbedCode , Validators.required);
		this.question = new Control(this.content.question, Validators.required);
		this.answerA = new Control(this.content.answerA , Validators.required);
		this.answerB = new Control(this.content.answerB , Validators.required);
		this.answerC = new Control(this.content.answerC , Validators.required);
		this.answerD = new Control(this.content.answerD , Validators.required);
		this.trueNumber = this.content.trueNumber;

		this.contentForm = this.builder.group({
			videoLabel : this.videoLabel,
			videoEmbedCode : this.videoEmbedCode,
			question: this.question,
			answerA: this.answerA,
			answerB: this.answerB,
			answerC: this.answerC,
			answerD: this.answerD,
			trueNumber: this.trueNumber,
		})
	}

	choiceChange(flag: number){
		switch (flag) {
			case 0:
				this.questionType = false;
				this.singleOrMulti = false;
				break;
			case 1:
				this.questionType = false;
				this.singleOrMulti = true;
				break;
			case 2:
				this.questionType = true;
				this.singleOrMulti = true;
				break;
			default:
				break;
		}
	}
	choiceAnswer(form: any, n: number){
		this.trueNumber = n;
		this.blurChange(form);
	}

	removeContent(){

		var original = JSON.parse(this._session.getItem('Content')),
			id = this._content_id;

		if(original.length == 1) return false;

		original = original.filter(function( obj ) {
			var content_id = obj._content_id ? obj._content_id : obj._id;

			return content_id !== id;
		});
		this._session.setItem('Content', JSON.stringify(original));
		this.manageContent.emit(original);
	}


	blurChange(form: any){
		this.submitAttempt = true;
		var original = JSON.parse(this._session.getItem('Content')), updated = true, original_copy = [];
		if(this.videoOrQuestion){
			if(form.videoLabel != "" && form.videoEmbedCode != "") updated = false;
		}else{

			switch (this.singleOrMulti) {
				case false:
					if(form.question != "" ) updated = false;
					break;
				case true:
					if(form.question == "" || form.answerA == "" || form.answerB == "" || form.answerC == "" || form.answerD == "" || this.trueNumber == 0 || (this.questionType && this.image == null)) {
						updated = true;
					}else{
						updated = false;
					}
					break;
				default:
					updated = true;
					break;
			}
		}


		if(!updated){
			this.content.videoLabel = form.videoLabel;
			this.content.videoEmbedCode = form.videoEmbedCode;
			this.content.question = form.question;
			this.content.image = this.image;
			this.content.questionType = this.questionType;
			this.content.singleOrMulti = this.singleOrMulti;
			this.content.answerA = form.answerA;
			this.content.answerB = form.answerB;
			this.content.answerC = form.answerC;
			this.content.answerD = form.answerD;
			this.content.trueNumber = this.trueNumber;

			var data = this.content;
			original.forEach(function(obj){
				var first_id = obj._content_id ? obj._content_id : obj._id;
				var second_id = data._content_id ? data._content_id: data._id;

				if((first_id == second_id)){
					original_copy.push(data)
				}else{
					original_copy.push(obj)
				}
			});
			this._session.setItem('Content', JSON.stringify(original_copy));
			this.manageContent.emit(original_copy);
		}

	}
	addQuestionOrVideo(form: any, flag: boolean){
		this.submitAttempt = true;

		var original = JSON.parse(this._session.getItem('Content')), updated = true, original_copy = [];
		if(this.videoOrQuestion){
			if(form.videoLabel != "" && form.videoEmbedCode != "") updated = false;
		}else{
			switch (this.singleOrMulti) {
				case false:
					if(form.question != "" ) updated = false;
					break;
				case true:
					if(form.question == "" || form.answerA == "" || form.answerB == "" || form.answerC == "" || form.answerD == "" || (this.questionType && this.image == "") ) {
						updated = true;
					}else{
						updated = false;
					}
					break;
				default:
					updated = true;
					break;
			}
		}


		if(!updated){
			this.content.videoLabel = form.videoLabel;
			this.content.videoEmbedCode = form.videoEmbedCode;
			this.content.question = form.question;
			this.content.questionType = this.questionType;
			this.content.image = this.image;
			this.content.singleOrMulti = this.singleOrMulti;
			this.content.answerA = form.answerA;
			this.content.answerB = form.answerB;
			this.content.answerC = form.answerC;
			this.content.answerD = form.answerD;
			this.content.trueNumber = this.trueNumber;
			var data = this.content;

			var new_data = {
				_content_id: (Date.now()).toString(),
				videoOrQuestion: flag,
				questionType: false,
				videoLabel: '',
				videoEmbedCode: '',
				singleOrMulti: false,
				question: '',
				answerA: '',
				answerB: '',
				answerC: '',
				answerD: '',
				image: '',
				trueNumber: '',
			}
			original_copy = [];

			original.forEach(function(obj){
				var first_id = obj._content_id ? obj._content_id : obj._id;
				var second_id = data._content_id ? data._content_id: data._id;
				if(first_id == second_id){
					original_copy.push(data);
					original_copy.push(new_data);
				}else{
					original_copy.push(obj)
				}
			});

			this._session.setItem('Content', JSON.stringify(original_copy));
			this.manageContent.emit(original_copy);
		}

	}

	public updateContent() : void {
		this.addQuestionOrVideo(this.contentForm.value, true);
	}

	onFileChange(event, form: any) {
		var files = event.srcElement.files;
		this._adminService.upload(files).subscribe((res)=>{
			this.image = res.image;
			this.blurChange(form);
		})
	}
}
