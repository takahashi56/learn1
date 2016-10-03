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
declare let html2canvas;
declare let pdfMake;
declare let PDFJS;

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
        if(this.data == null) this._router.navigateByUrl('/login');
    }

    ngOnInit(){


      setTimeout(this.downloadpdf(), 5000)
    }

    downloadpdf(){
        let data = window.location.href; 
          
        this._tutorService.makePdf({data:data}).subscribe((res) => {            
           window.location.href = '/pdf-viewer/web/viewer.html?file=/pdf/' + res.url;
           console.log(res.url);
        })

    }

    extractDomain(url) {
        var domain;
        //find & remove protocol (http, ftp, etc.) and get domain
        if (url.indexOf("://") > -1) {
            domain = url.split('/')[2];
        }
        else {
            domain = url.split('/')[0];
        }

        //find & remove port number
        //domain = domain.split(':')[0];

        return domain;
    }
}
