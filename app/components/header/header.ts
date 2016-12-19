import {Component, EventEmitter} from 'angular2/core';
import {Session} from '../../services/session';
import {ROUTER_DIRECTIVES, Router} from 'angular2/router';
import {AuthService} from '../../services/authentication';
import {TutorService} from '../../services/tutor';

@Component({
    selector: 'my-header',
    templateUrl: '/components/header/header.html',
    providers: [Session, AuthService, TutorService],
    directives: [ROUTER_DIRECTIVES]
})


export class Header {
    username: string = "";
    creditcount: Number = 0;
    currentRole: Number = Infinity;
    show_credits: boolean = true;
    show_not_save: boolean = false;

    constructor(private _session: Session, private router: Router, private _tutorService: TutorService) {
        this.username = _session.getCurrentUsername();
        this.currentRole = this._session.getCurrentRole();
        var id = this._session.getCurrentId();

        if (this.username == null || id == null) {
            this.router.navigate(['Login'])
        } else if (this.currentRole == 1) {
            this.creditcount = Number(this._session.getItem("creditcount"));
        }
    }

    ngOnInit() {
        setInterval(() => {
            this.updateCreditCount()
        }, 1000);
        // this._tutorService.event_emitter.subscribe((decrease)=>{
        // 	this.creditcount = Number(this._session.getItem('creditcount'));
        // })
    }

    updateCreditCount() {
        this.creditcount = Number(this._session.getItem('creditcount'));
        this.username = this._session.getCurrentUsername();
        this.show_credits = Number(this._session.getItem('subscribing')) == 0 ? true : false;
    }

    doLogout() {
        localStorage.clear();
        this.router.navigate(['Login'])
    }

    gotoCreditsTab() {
        this.router.navigateByUrl('/home/tutor/main');
        this._session.setItem('select_tutor_tab', 4)
    }

    beforeLogout() {
        this.show_not_save = false;
        let flag = false, result = false;
        console.log(JSON.parse(this._session.getItem('Course')));
        if (JSON.parse(this._session.getItem('Course')) == null || JSON.parse(this._session.getItem('Course')) == [] || JSON.parse(this._session.getItem('Course')) == "" || JSON.parse(this._session.getItem('Course')) == undefined) {
            this.doLogout();
            return;
        } else {
            if (JSON.parse(this._session.getItem('Content')) == null || this._session.getItem('Content') == "" || this._session.getItem('Content') == undefined) {
                flag = true;
            } else {
                flag = false;
            }
        }


        if (flag == false) {
            let contents = JSON.parse(this._session.getItem('Content'));
            contents.forEach((content) => {
                if (content._id.length < 15) {
                    result = true;
                }
            });
        } else {
            let courseData = JSON.parse(this._session.getItem('Course')),
                lessons = courseData.lesson;

            lessons.forEach((lesson) => {
                lesson.content.forEach((content) => {
                    if (content._id.length < 15) {
                        result = true;
                    }
                });
            });
        }

        if (result) {
            this.show_not_save = true;
        } else {
            this.show_not_save = false;
            this.doLogout();
        }
    }
}
