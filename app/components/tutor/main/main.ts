import {Component, OnInit, EventEmitter} from 'angular2/core';
import {Session} from '../../../services/session';
import {ROUTER_DIRECTIVES, Router} from 'angular2/router';
import {CanActivate} from 'angular2/router';
import {TutorService} from '../../../services/tutor';
import {Location} from 'angular2/platform/common';
import {FORM_DIRECTIVES, FormBuilder, Control, ControlGroup, Validators} from 'angular2/common';

@Component({
	selector: 'tutor-main',
	templateUrl: '/components/tutor/main/main.html',
	providers: [Session, TutorService],
	directives: [ROUTER_DIRECTIVES, FORM_DIRECTIVES],
})
export class TutorMain implements OnInit {

	studentList: any = [];
	courseList: any = [];
	tutor_id: string;
	selectStudents: any = [];
	showRemoveStudent: boolean = false;
	selectedStudentsName: string = '';
	creditcount: number = 0;
	employeecount: number = 0;

	SettingForm: ControlGroup;
	newpwd: Control;
	oldpwd: Control;
	newpwdconfirm: Control;
	validateoldconfirm: boolean = false;
	validatenewconfirm: boolean = false;
	changeSuccess: boolean = false;
	showAlert: boolean = false;
	validOldPassword: boolean = true;
	failure: string = '';
	matchedTrue: boolean = false;

	constructor(private _location: Location, private _session: Session, private _tutorService: TutorService, private _router: Router, private builder: FormBuilder) {
		this.tutor_id = this._session.getCurrentId()

		if(this.tutor_id == "" || this.tutor_id == null ){
			this._router.navigateByUrl('/login');
		}else{
			var role=this._session.getCurrentRole();
			this._session.setItem('editORadd', JSON.stringify({flag: false}));
			this.creditcount = Number(this._session.getItem('creditcount'));
			this.employeecount = Number(this._session.getItem('employeecount'));

			this._tutorService.getAllCourses({tutor_id: this.tutor_id}).subscribe((res)=>{
				this.courseList = res;
				console.log(res);
			});
			this._tutorService.getAllStudents({tutor_id: this.tutor_id}).subscribe((res)=>{
				this.studentList = res;
				this._session.setItem('TutorAllStudent', JSON.stringify(res))
			});

			this._tutorService.getAllMatrix({tutor_id: this.tutor_id}).subscribe((res) => {
	      console.log(res)
	      this._session.setItem('studentList', JSON.stringify(res));
	    })

			// this._tutorService.getAlUnCompleted({tutor_id: this.tutor_id}).subscribe((res) => {
	    //   console.log(res)
	    //   this._session.setItem('uncompleted', JSON.stringify(res));
	    // })
			this._tutorService.updateTutorInfo({tutor_id: this.tutor_id}).subscribe((res) => {
				this._session.setItem('employeecount', res.employeecount);
				this._session.setItem('creditcount', res.creditcount);
				this.creditcount = Number(this._session.getItem('creditcount'));
				this.employeecount = Number(this._session.getItem('employeecount'));
			});

			this.oldpwd = new Control('', Validators.compose([Validators.required, Validators.minLength(6)]));
			this.newpwd = new Control('', Validators.compose([Validators.required, Validators.minLength(6)]));
			this.newpwdconfirm = new Control('', Validators.compose([Validators.required, Validators.minLength(6)]));

			this.SettingForm = builder.group({
				newpwd: this.newpwd,
				newpwdconfirm: this.newpwdconfirm,
				oldpwd: this.oldpwd
			})
		}
	}

	editStudent(student: any){
		console.log(student.student_id);
		this._session.setItem('editORadd', JSON.stringify({flag: true}));
		this._session.setItem('TutorStudent', JSON.stringify(student));
		this._router.navigate(['AddTutorStudent']);
	}


	ngOnInit(){
		if(this.tutor_id == "" || this.tutor_id == null ){
			this._router.navigateByUrl('/login');
		}
	}

	gotoStudentDetail(student: any){
		this._session.setItem('TutorStudent', JSON.stringify(student));
		this._router.navigate(['DetailTutorStudent']);
	}
	gotoDetail(course: any){
		this._session.setItem('TutorCourse', JSON.stringify(course));
		this._router.navigate(['DetailTutorCourse']);
	}

	gotoAddStudent(){
		var data = {
			student_id: Date.now(),
			firstName: '',
			lastName: '',
			DOB: '',
			username: '',
			hashed_pwd: '',
			other: '',
			phone: '',
		}

		console.log("DDDDDDDDDDDDDDDDDDDDDDDDD" + this.employeecount);

		var studentLength = this.studentList.length;
		if((studentLength + 1) > this.employeecount){
			return ;
		}else{
			this._session.setItem('editORadd', JSON.stringify({flag: false}));
			this._session.setItem('TutorStudent', JSON.stringify(data));

			this._router.navigate(['AddTutorStudent']);
		}
	}

	beforeAssignStudent(course){
		this._session.setItem('AssignCourse', course.course_id)
	}

	onSelectCourse(value){
		this._session.setItem('SelectCourseWithId', value)
	}

	onSelectStudent(value){
		this._session.setItem('SelectStudentWithId', value)
	}

	studentAssign(){
		var id = this._session.getItem('SelectStudentWithId');
		if(!id) return false;

		if(this.creditcount == 0){
			console.log("You cannot assign the course to students!");
			return false;
		}

		let selectedId = this._session.getItem('AssignCourse');
		if(!selectedId) return false;

		let ids = [];
		ids.push(id);

		this._tutorService.setAssignStudentsWithCourse(this.tutor_id, selectedId,ids).subscribe((res)=>{
			console.log(res);
			this.creditcount--;
			this._session.setItem('creditcount', this.creditcount);
			this._tutorService.event_emitter.emit('decrease_credit');

			this._router.navigateByUrl('/home/tutor/main');

			this._tutorService.getAllStudents({tutor_id: this.tutor_id}).subscribe((res)=>{
				this.studentList = res;
				this._session.setItem('TutorAllStudent', JSON.stringify(res))
			});

			this._tutorService.getAllCourses({tutor_id: this.tutor_id}).subscribe((res)=>{
				this.courseList = res;
				console.log(res);
			});

		});;
	}

	courseAssign(){
		var id = this._session.getItem('SelectCourseWithId');
		if(!id) return false;

		if(this.creditcount == 0){
			console.log("You cannot assign the course to students!");
			return false;
		}

		if(this.selectStudents.length == 0) return false;

		let ids = this.selectStudents;

		this._tutorService.setAssignStudentsWithCourse(this.tutor_id, id,ids).subscribe((res)=>{

			console.log(res);
			this.creditcount--;
			this._session.setItem('creditcount', this.creditcount);
			console.log("DDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD");
			console.log(Number(this._session.getItem('creditcount')))
			// this._tutorService.event_emitter.emit('decrease');
			console.log(this._tutorService.event_emitter);

			this._router.navigateByUrl('/home/tutor/main');

			this._tutorService.getAllStudents({tutor_id: this.tutor_id}).subscribe((res)=>{
				this.studentList = res;
				this._session.setItem('TutorAllStudent', JSON.stringify(res))
			});

			this._tutorService.getAllCourses({tutor_id: this.tutor_id}).subscribe((res)=>{
				this.courseList = res;
				console.log(res);
			});
		});

	}

	importAddStudent($event: any) {
	    var self = this;
	    var file:File = $event.target.files[0];
	    var myReader:FileReader = new FileReader();
	    myReader.readAsText(file);
	    var resultSet = [];
	  	 myReader.onloadend = (e) => {
	      // you can perform an action with data read here
	      // as an example i am just splitting strings by spaces
	      var columns = myReader.result.split(/\r\n|\r|\n/g);
	      for (var i = 0; i < columns.length; i++) {
						console.log(columns[i]);
						if(columns[i].split(',').length < 3) continue;
	          resultSet.push(columns[i].split(']'));
	      }
				console.log(resultSet);
				var studentLength = this.studentList.length, remainderLength=0;
				if((studentLength + resultSet.length) > this.employeecount){
					remainderLength = (studentLength + resultSet.length) - this.employeecount;
				}
				if(remainderLength <= 0){
					return false;
				}else{
					resultSet = resultSet.slice(0, remainderLength);
				}
	      self._tutorService.addStudentCSV({result:resultSet, tutor_id: self._session.getCurrentId()}).subscribe((res)=>{

					// self._router.navigateByUrl('/home/tutor/main');

					self._tutorService.getAllStudents({tutor_id: self.tutor_id}).subscribe((res)=>{
						self.studentList = res;
						self._session.setItem('TutorAllStudent', JSON.stringify(res))
					});
				})
	 	}


	}

	assignCourseToStudent(){

	}

	assignStudentToCourse(){

	}

	gotoCourseByClick(){

	}

	doLogin(form: any) {

	}

	checkStudent(event, object){
		console.log(`coures  = ${JSON.stringify(object)}`);

		if(event.currentTarget.checked){
			this.selectStudents.push(object.student_id);
		}else{
			this.selectStudents = this.selectStudents.filter((o) => {
				return o != object.student_id;
			})
		}
		console.log(this.selectStudents);
	}

	removeStudent(){
		if(this.selectStudents.length == 0) return false;
		let instance = this;
		console.log(this.selectStudents);

		this._tutorService.removeStudentById(this.selectStudents).subscribe((res)=>{
			instance.selectStudents.map(function(id){
				instance.studentList = instance.studentList.filter(function(student){
					return student.student_id != id;
				})
				instance._session.setItem('TutorAllStudent', JSON.stringify(instance.studentList))
			})
		})
	}

	beforeRemoveStudent(){
		if(this.selectStudents.length == 0){
			this.showRemoveStudent = false;
			return false;
		}
		this.showRemoveStudent = true;
		let instance = this;
		var data = [];

		this.selectStudents.map((id) => {
			var element = this.studentList.filter((student) => { return student.student_id == id});
			console.log(element);
			data.push(`${element[0].firstName} ${element[0].lastName}`);
		});
		this.selectedStudentsName = data.join(',');
	}

	gotoMatrix(){
		console.log(this.courseList)
		if(this.courseList == [] || this.courseList == null || this.courseList.length == 0) return false;

		this._session.setItem('courseList', JSON.stringify(this.courseList));
		var baseurl = window.location.origin+window.location.pathname + '#/home/tutor/matrix';
		window.open(baseurl, '_blank');
		// this._router.navigateByUrl('/home/tutor/matrix');
	}

	gotoUncompleted(){
		console.log(this.courseList)
		if(this.courseList == [] || this.courseList == null || this.courseList.length == 0) return false;

		this._session.setItem('courseList', JSON.stringify(this.courseList));
		var baseurl = window.location.origin+window.location.pathname + '#/home/tutor/uncompleted';
		window.open(baseurl, '_blank');
		// this._router.navigateByUrl('/home/tutor/matrix');
	}

	matchedPassword(form: any){
		var password = form.newpwd,
			verifiedpassword = form.newpwdconfirm;
		if(password == verifiedpassword){
			this.matchedTrue = true;
			return true;
		}else{
			this.matchedTrue = false;
			return false;
		}
	}

	ChangePassowrd(form: any){
		if(form.oldpwd == "" || form.oldpwd == null || this.validOldPassword == true){
			this.validateoldconfirm = true;
			return;
		}
		this.validatenewconfirm = true;
		console.log("abc")

		if(this.SettingForm.valid && !this.matchedTrue){
			this.showAlert = true;
			this.changeSuccess = false;
			this.failure = 'The Password Must Be Matched';
		}


		if(this.SettingForm.valid  && this.matchedTrue){
			var newPwd = form.newpwd;
			console.log("abc")
			this._tutorService.changePassword({tutor_id: this.tutor_id, pwd: newPwd}).subscribe((res) => {
				this.showAlert = true;
				if(res.success){
					this.changeSuccess = true;
				}else{
					this.changeSuccess = false;
					this.failure = 'Your update have been failed.';
				}
			});
		}
	}

	blurChange(form: any){
		var oldPwd = form.oldpwd;
		this.isValidOldPassword(oldPwd);
		console.log(oldPwd)
	}

	onKey(event: any){
		if(event.keyCode !== 13) return;
		var value = event.target.value;
		console.log(value);
		this.isValidOldPassword(value);
	}

	isValidOldPassword(pwd: string){
		this.validateoldconfirm = true;
		this._tutorService.isValidOldPassword({tutor_id: this.tutor_id, pwd: pwd}).subscribe((res)=>{
			if(res.success){
				this.validOldPassword = false;
			}else{
				this.validOldPassword = true;
				this.validateoldconfirm = false;
			}
		})
	}

	cancel(form: any){
		(<Control>this.SettingForm.controls['oldpwd']).updateValue('');
		(<Control>this.SettingForm.controls['newpwd']).updateValue('');
		(<Control>this.SettingForm.controls['newpwdconfirm']).updateValue('');
	}

	/*Stripe Payment*/
	gotoStripePayment(){
		console.log("goto Stripe")
		this._router.navigate(['StripePayment']);
	}

	/*GoCardless Payment*/
	gotoGoCardlessPayment(){
		this._router.navigate(['GoCardlessPayment']);
	}
}
