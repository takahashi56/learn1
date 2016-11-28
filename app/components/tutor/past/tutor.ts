import {Component, AfterViewInit} from 'angular2/core';
import {ROUTER_DIRECTIVES, Router} from 'angular2/router';
import {Session} from '../../../services/session';
import {CanActivate} from 'angular2/router';
import {TutorService} from '../../../services/tutor';

@Component({
    selector: 'tutor-past',
    templateUrl: '/components/tutor/past/tutor.html',
    providers: [Session, TutorService],
    directives: [ROUTER_DIRECTIVES]
})
export class PastTutorStudent implements AfterViewInit {

    pastStudents: any[] = [];
    tutor_id: string = '';
    selectStudents: any = [];
    showRemoveStudent: boolean = false;
    selectedStudentsName: string = '';

    constructor(private _session: Session, private _tutorService: TutorService, private _router: Router) {
        if (this._session.getCurrentId() == null) {
            this._router.navigateByUrl('/login');
        } else {
            this.tutor_id = this._session.getCurrentId()
            this._tutorService.getArchivedStudents({ tutor_id: this.tutor_id }).subscribe((res) => {
                this.pastStudents = res;
            })
        }
    }

    ngAfterViewInit() {

    }

    beforeRemoveStudent() {
        if (this.selectStudents.length == 0) {
            this.showRemoveStudent = false;
            return false;
        }
        this.showRemoveStudent = true;
        let instance = this;
        var data = [];

        this.selectStudents.map((id) => {
            var element = this.pastStudents.filter((student) => { return student._id == id });
            data.push(`${element[0].firstName} ${element[0].lastName}`);
        });
        this.selectedStudentsName = data.join(',');
    }

    checkStudent(event, object) {
        if (event.currentTarget.checked) {
            this.selectStudents.push(object._id);
        } else {
            this.selectStudents = this.selectStudents.filter((o) => {
                return o != object._id;
            })
        }
        console.log(this.selectStudents);
    }

    cancel() {
        this._router.navigate(['TutorMain']);
    }

    restoreEmployee() {
        if (this.selectStudents.length == 0) return false;

        this._tutorService.restoreStudentById({ list: this.selectStudents }).subscribe((res) => {
            this.selectStudents.map((id) => {
                this.pastStudents = this.pastStudents.filter((student) => {
                    return student._id != id;
                })
            })
        })
    }

    fullyRemove() {
        if (this.selectStudents.length == 0) return false;

        this._tutorService.removeStudentById(this.selectStudents).subscribe((res) => {
            this.selectStudents.map((id) => {
                this.pastStudents = this.pastStudents.filter((student) => {
                    return student._id != id;
                })
            })
        })
    }

    gotoStudentDetail(student) {
        student["student_id"] = student._id;
        this._session.setItem('editORadd', JSON.stringify({ flag: true }));
        this._session.setItem('TutorStudent', JSON.stringify(student));
        this._session.setItem('pastRoute', true);
        this._router.navigate(['DetailTutorStudent']);
    }

    getCompleteDate(student) {
        var date = student.archivedDate;

        var d = new Date(date),
            day = d.getDate().toString().length == 1 ? '0' + d.getDate() : d.getDate(),
            month = (d.getMonth() + 1).toString().length == 1 ? '0' + (d.getMonth() + 1) : (d.getMonth() + 1),
            datestring = day + "/" + month + "/" + d.getFullYear();

        return datestring;
    }

}
