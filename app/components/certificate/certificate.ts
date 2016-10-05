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
                var ctx = canvas.getContext("2d");
                var data = canvas.toDataURL("image/png", 1.5);
                console.log(data)
                var docDefinition = {
                    content: [{
                        image: data,
                        width: 520,
                    }]
                };

                var para =  document.getElementById("editor"),
                    para1 = document.createElement("div"),
                    image = document.createElement("img"),
                    image1 = document.createElement('img');
                image.src = data;
                para.appendChild(image);
                // self.makeHighResScreenshot(image, image1, 200);                    
                // para1.appendChild(image);
                // self._tutorService.makePdf({data:para.innerHTML}).subscribe((res) => {            
                //    window.location.href = '/pdf-viewer/web/viewer.html?file=/pdf/' + res.url;
                //    console.log(res.url);
                // })
            }
        });
    }

    makeHighResScreenshot(srcEl, destIMG, dpi) {
        var scaleFactor = Math.floor(dpi / 96);
        // Save original size of element
        var originalWidth = srcEl.offsetWidth;
        var originalHeight = srcEl.offsetHeight;
        // Save original document size
        var originalBodyWidth = document.body.offsetWidth;
        var originalBodyHeight = document.body.offsetHeight;

        // Add style: transform: scale() to srcEl
        srcEl.style.transform = "scale(" + scaleFactor + ", " + scaleFactor + ")";
        srcEl.style.transformOrigin = "left top";

        // create wrapper for srcEl to add hardcoded height/width
        var srcElWrapper = document.createElement('div');
        srcElWrapper.id = srcEl.id + '-wrapper';
        srcElWrapper.style.height = originalHeight*scaleFactor + 'px';
        srcElWrapper.style.width = originalWidth*scaleFactor + 'px';
        // insert wrapper before srcEl in the DOM tree
        srcEl.parentNode.insertBefore(srcElWrapper, srcEl);
        // move srcEl into wrapper
        srcElWrapper.appendChild(srcEl);

        // Temporarily remove height/width constraints as necessary
        document.body.style.width = originalBodyWidth*scaleFactor +"px";
        document.body.style.height = originalBodyHeight*scaleFactor +"px";

        window.scrollTo(0, 0); // html2canvas breaks when we're not at the top of the doc, see html2canvas#820
        html2canvas(srcElWrapper, {
            onrendered: function(canvas) {
                destIMG.src = canvas.toDataURL("image/png");
                srcElWrapper.style.display = "none";
                // Reset height/width constraints
                document.body.style.width = originalBodyWidth + "px";
                document.body.style.height = originalBodyHeight + "px";
            }
        });
    };
}
