/**
 * Created by root on 31/08/2016.
 */

import {Component, OnInit} from 'angular2/core';
import {Session} from '../../services/session';
import {ROUTER_DIRECTIVES,Router} from 'angular2/router';
import {CanActivate} from 'angular2/router';
import {TutorService} from '../../services/tutor';

// import 'jspdf';
// declare let jsPDF;

@Component({
    selector: 'certificate',
    templateUrl: '/components/certificate/certificate.html',
    providers: [Session, TutorService],
    directives: [ROUTER_DIRECTIVES]
})

export class CertificateView implements OnInit{
    data: any = {};

    constructor(private _tutorService: TutorService, private _router: Router, private _session: Session){
        this.data = JSON.parse(this._session.getItem('certificate'));
    }

    ngOnInit(){
      // setTimeout(this.downloadpdf(), 2000)
          // this.downloadpdf()
    }

    downloadpdf(){
        // var pdf = new jsPDF('l', 'pt', 'letter'),
        //     source = document.getElementById('pdffromHtml').innerHTML,
        //     specialElementHandlers = {
        //         // element with id of "bypass" - jQuery style selector
        //         '#editor': function (element, renderer) {
        //             // true = "handled elsewhere, bypass text extraction"
        //             return true;
        //         }
        //     },
        //     margins = {
        //         top: 0,
        //         bottom: 0,
        //         left: 0,
        //         width: 1341
        //     };
        //
        //
        // pdf.fromHTML(
        //     source,
        //     0,
        //     0, {
        //         'width': margins.width,
        //         'elementHandlers': specialElementHandlers
        //     }, function(disposal){
        //         console.log(disposal);
        //         pdf.save('Test.pdf');
        //     }, margins);

    }
}
