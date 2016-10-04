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
    show: boolean = true;

    constructor(private _tutorService: TutorService, private _router: Router, private _session: Session){
        this.data = JSON.parse(this._session.getItem('certificate'));
        if(this.data == null) this._router.navigateByUrl('/login');

    }

    ngOnInit(){
      this.downloadpdf()  
    }

    downloadpdf(){
        let self = this;
        html2canvas(document.getElementById('pdffromHtml'), {
            onrendered: function (canvas) {
                // canvas.width = 1224;
                // canvas.height = 1584;
                // canvas.style.width = "1224pt";
                // canvas.style.height = "1584pt";
                canvas.scale(2.04, 1.87);

                var data = canvas.toDataURL();
                console.log(canvas.width)
                var docDefinition = {
                    content: [{
                        image: data,
                        width: 400,
                    }]
                };

                var para = document.createElement("div"),
                    image = document.createElement("img");
                image.src = data;
                    
                para.appendChild(image);
                // console.log(docDefinition);
                // pdfMake.createPdf(docDefinition).download("Score_Details.pdf");
                console.log(para);
                self._tutorService.makePdf({data:para.innerHTML}).subscribe((res) => {            
                   window.location.href = '/pdf-viewer/web/viewer.html?file=/pdf/' + res.url;
                   console.log(res.url);
                })
            }
        });
    }
}
