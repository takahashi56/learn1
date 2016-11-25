import {Injectable, EventEmitter, Output} from 'angular2/core';
import 'rxjs/add/operator/map';
import {Http, Headers} from 'angular2/http';
import {Observable} from 'rxjs/Rx';


const HEADER = {
    headers: new Headers({
        'Content-Type': 'application/json'
    })
};

@Injectable()
export class TutorService {
    private baseUrl: string = "/api/tutor/";
    @Output() event_emitter: EventEmitter<any> = new EventEmitter(true);

    constructor(private _http: Http) {
        // this.progress$ = Observable.create(observer => {
        // 	this.progressObserver = observer
        // }).share();
    }

    emitAction(event_name: string) {
        this.event_emitter.emit(event_name);
    }

    onEmittedAction(event_name: string, callback) {
        this.event_emitter.subscribe((event_name) => {
            callback();
        })
    }

    getAllCourses(data) {
        return this._http.post(this.baseUrl + "courses", JSON.stringify(data), HEADER).map((res) => {
            return res.json();
        });
    }

    getAllStudents(data) {
        return this._http.post(this.baseUrl + "students", JSON.stringify(data), HEADER).map((res) => {
            return res.json();
        });
    }

    addStudent(data, flag) {
        if (!flag) {
            return this._http.post(this.baseUrl + "student", JSON.stringify(data), HEADER)
                .map((res) => {
                    return res.json();
                })
        } else {
            return this._http.post(this.baseUrl + "updatestudent", JSON.stringify(data), HEADER)
                .map((res) => {
                    return res.json();
                })
        }

    }

    addStudentCSV(data) {
        return this._http.post(this.baseUrl + 'studentcsv', JSON.stringify(data), HEADER)
            .map((res) => {
                return res.json();
            })
    }

    unAssign(data) {
        return this._http.post(this.baseUrl + 'unassign', JSON.stringify(data), HEADER)
            .map((res) => {
                return res.json();
            })
    }

    setAssignStudentsWithCourse(tutor_id, id, ids) {
        var data = {
            tutor_id: tutor_id,
            course_id: id,
            ids: ids
        }
        return this._http.post(this.baseUrl + "setstudentbycourse", JSON.stringify(data), HEADER).map((res) => {
            return res.json();
        });
    }

    makeFileRequest(files) {
    }

    getCoursesByStudentId(id, tutor_id) {
        var data = {
            student_id: id,
            tutor_id: tutor_id
        };
        return this._http.post(this.baseUrl + "getCoursesByStudentId", JSON.stringify(data), HEADER).map((res) => {
            return res.json();
        })
    }

    getStudentsByCourseId(id, tutor_id) {
        var data = {
            course_id: id,
            tutor_id: tutor_id
        };
        return this._http.post(this.baseUrl + "getStudentsByCourseId", JSON.stringify(data), HEADER).map((res) => {
            return res.json();
        })
    }

    removeStudentById(list) {
        return this._http.post(this.baseUrl + "removestudent", JSON.stringify({ list: list }), HEADER).map((res) => {
            return res.json();
        })
    }

    getLessonsNameByCourseId(data) {
        return this._http.post(this.baseUrl + 'getlessonsnamebycourseid', JSON.stringify(data), HEADER).map((res) => {
            return res.json();
        })
    }

    getAllMatrix(data) {
        return this._http.post(this.baseUrl + 'getallmatrix', JSON.stringify(data), HEADER).map((res) => {
            return res.json();
        })
    }

    performPayment(data) {
        return this._http.post(this.baseUrl + 'performpayment', JSON.stringify(data), HEADER).map((res) => {
            return res.json();
        })
    }

    getStripeTransactionHistory(data) {
        return this._http.post(this.baseUrl + 'getstripehistory', JSON.stringify(data), HEADER).map((res) => {
            return res.json();
        })
    }

    getRedirectUrl(data) {
        return this._http.post(this.baseUrl + 'getgcredirecturl', JSON.stringify(data), HEADER).map((res) => {
            return res.json();
        })
    }

    updateTutorInfo(data) {
        return this._http.post(this.baseUrl + 'updatetutorinfo', JSON.stringify(data), HEADER).map((res) => {
            return res.json();
        })
    }

    getAllUnCompleted(data) {
        return this._http.post(this.baseUrl + 'getalluncompleted', JSON.stringify(data), HEADER).map((res) => {
            return res.json();
        })
    }

    changePassword(data) {
        return this._http.post(this.baseUrl + 'changepassword', JSON.stringify(data), HEADER).map((res) => {
            return res.json();
        })
    }

    isValidOldPassword(data) {
        return this._http.post(this.baseUrl + 'isvalidoldpwd', JSON.stringify(data), HEADER).map((res) => {
            return res.json();
        })
    }

    makePdf(data) {
        return this._http.post(this.baseUrl + 'makepdf', JSON.stringify(data), HEADER).map((res) => {
            return res.json();
        })
    }

    getCSVFile() {
        var headers = new Headers();
        headers.append('responseType', 'arraybuffer');
        return this._http.get("/csv/SampleEmployeeImport.csv")
            .map(res => new Blob([res], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }))
    }

    getArchivedStudents(data) {
      return this._http.post(this.baseUrl + 'getArchivedStudents', JSON.stringify(data), HEADER).map((res) => {
          return res.json();
      })
    }

    restoreStudentById(data){
      return this._http.post(this.baseUrl + 'restoreStudentById', JSON.stringify(data), HEADER).map((res) => {
          return res.json();
      })
    }

    archiveStudentById(data){
      return this._http.post(this.baseUrl + 'archiveStudentById', JSON.stringify(data), HEADER).map((res) => {
          return res.json();
      })
    }
}
