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


      setTimeout(this.downloadpdf(), 2000)
    }

    downloadpdf(){
        let self = this;
        html2canvas(document.getElementById('pdffromHtml'), {
            onrendered: function (canvas) {
                var data = canvas.toDataURL();
                console.log(canvas.width)
                var docDefinition = {
                    content: [{
                        image: data,
                        width: 520,
                    }]
                };

                var para = document.createElement("div");
                para.appendChild(canvas);
                // console.log(docDefinition);
                // pdfMake.createPdf(docDefinition).download("Score_Details.pdf");
                console.log(para);
                self._tutorService.makePdf({data:para}).subscribe((res) => {            
                   window.location.href = '/pdf-viewer/web/viewer.html?file=/pdf/' + res.url;
                   console.log(res.url);
                })
            }
        });

        // let data = document.getElementById('pdffromHtml').innerHTML;
        // let data = window.location.href; 
          
        

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
