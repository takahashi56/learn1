import {Component, OnInit, Input, Output, EventEmitter, AfterViewInit} from 'angular2/core';
import {Session} from '../../../services/session';
import {ROUTER_DIRECTIVES, Router} from 'angular2/router';
import {CanActivate} from 'angular2/router';
import {StudentService} from '../../../services/student';

@Component({
    selector: 'student-video',
    templateUrl: '/components/student/video/student.html',
    providers: [Session, StudentService],
    directives: [ROUTER_DIRECTIVES],
})
export class StudentVideo implements AfterViewInit {

    @Input() content: any;
    @Input() lessonname: string;
    @Input() index: number;
    @Input() total: number;

    @Output() gotoNextContent = new EventEmitter();
    @Output() gotoPreviousContent = new EventEmitter();

    htmlString: string = '';
    currentStep: number = 1;
    totalCount: number = 1;
    tempSession: any;

    constructor(private _session: Session, private _studentService: StudentService, private _router: Router) {
        this.tempSession = _session;
    }

    ngOnInit() {
        setInterval(() => {
            if (this.htmlString != this.content.slideContent) {
                this.writeContent();
            }
        }, 200);
    }

    ngAfterViewInit() {
    }

    writeContent() {
        var parser = new DOMParser();
        var doc = parser.parseFromString(this.content.slideContent, "text/xml");
        var element = doc.getElementById('mybackground');
        var bgColor = "#fff";
        if (element != undefined) {
            bgColor = element.getAttribute('style');
            bgColor = bgColor.replace("background-color: ", "");
            bgColor = bgColor.replace(";", "");        
        }

        if (element == null) {
            var temp = this.content.slideContent.split('id="mybackground"');
            if (temp.length > 1) {
                bgColor = temp[1].substr(26, 7);
            }
        }

        document.getElementById('iframe_container_id').style.backgroundColor = bgColor;
        document.getElementById('header_id').style.display = "none";

        var h = window.innerHeight;
        var w = window.innerWidth;
        document.getElementById('section_id').setAttribute("style","height:" + h + "px");

        if (w <= 550) {
            document.getElementById('section_id').setAttribute("style","height:" + (h * 3) + "px");
            //document.getElementById('a_prev_id').setAttribute("style","height:" + (h - 40) + "px");
            //document.getElementById('a_next_id').setAttribute("style","height:" + (h - 40) + "px");
        }

        this.htmlString = this.content.slideContent;
				document.getElementById('iframe_id')['contentWindow'].document.open();
        document.getElementById('iframe_id')['contentWindow'].document.write(`
<html><head><style id="mceDefaultStyles" type="text/css">.mce-content-body div.mce-resizehandle {position: absolute;border: 1px solid black;box-sizing: box-sizing;background: #FFF;width: 7px;height: 7px;z-index: 10000}.mce-content-body .mce-resizehandle:hover {background: #000}.mce-content-body img[data-mce-selected],.mce-content-body hr[data-mce-selected] {outline: 1px solid black;resize: none}.mce-content-body .mce-clonedresizable {position: absolute;outline: 1px dashed black;opacity: .5;filter: alpha(opacity=50);z-index: 10000}.mce-content-body .mce-resize-helper {background: #555;background: rgba(0,0,0,0.75);border-radius: 3px;border: 1px;color: white;display: none;font-family: sans-serif;font-size: 12px;white-space: nowrap;line-height: 14px;margin: 5px 10px;padding: 5px;position: absolute;z-index: 10001}
.mce-visual-caret {position: absolute;background-color: black;background-color: currentcolor;}.mce-visual-caret-hidden {display: none;}*[data-mce-caret] {position: absolute;left: -1000px;right: auto;top: 0;margin: 0;padding: 0;}
.mce-content-body .mce-offscreen-selection {position: absolute;left: -9999999999px;max-width: 1000000px;}.mce-content-body *[contentEditable=false] {cursor: default;}.mce-content-body *[contentEditable=true] {cursor: text;}
</style><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"><link type="text/css" rel="stylesheet" href="https://cdn.tinymce.com/4/skins/lightgray/content.min.css"><link type="text/css" rel="stylesheet" href="//fonts.googleapis.com/css?family=Lato:300,300i,400,400i"><link type="text/css" rel="stylesheet" href="//www.tinymce.com/css/codepen.min.css"><link rel="stylesheet" data-mce-href="https://cdn.tinymce.com/4/plugins/codesample/css/prism.css" href="https://cdn.tinymce.com/4/plugins/codesample/css/prism.css"></head><body id="tinymce" class="mce-content-body " data-id="tinymceN1481899178641" style="background-color: ${bgColor};margin-left: 55px;margin-right: 100px;" spellcheck="false">${this.htmlString}</body></html>`);
				document.getElementById('iframe_id')['contentWindow'].document.close();

        this.currentStep = this.tempSession.getItem('currentStep');
        this.totalCount = this.tempSession.getItem('totalCount');

        $(".section_div .iframe-progress span").css("width", this.currentStep/this.totalCount*100+"%");

        if (this.currentStep == 1) {
            $(".section_div .iframe-controls_prev").fadeOut(200);
        }
    }
    gotoNext() {
        var self = this;
        
        this.currentStep++;
        if (this.currentStep == 1) {
            $(".section_div .iframe-controls_prev").fadeOut(50);
        }
        //if (this.currentStep == this.total) {
        //    $(".section_div .iframe-controls_next").fadeOut(50);
        //}

        $(".section_div .iframe-container-inner iframe").fadeOut(150, function(){
            self.gotoNextContent.emit({});
            $(".section_div .iframe-container-inner iframe").fadeIn(300);
        });

        $(".section_div .iframe-controls_prev").fadeIn(200);

        $(".section_div .iframe-progress span").css("width", this.currentStep/this.totalCount*100+"%");
    }
    gotoPrevious() {
        var self = this;
        
        this.currentStep--;
        if (this.currentStep == 1) {
            $(".section_div .iframe-controls_prev").fadeOut(50);
        }
        
        $(".section_div .iframe-container-inner iframe").fadeOut(150, function(){
            self.gotoPreviousContent.emit({});
            $(".section_div .iframe-container-inner iframe").fadeIn(300);
        });

        $(".section_div .iframe-controls_next").fadeIn(200);

        $(".section_div .iframe-progress span").css("width", this.currentStep/this.totalCount*100+"%");
    }
    getEmbedUrl() {
        let videoNumber = this.content.videoEmbedCode.replace(/\D/g, '');
        if (this.content.videoEmbedCode.includes('youtube')) {
            return this.content.videoEmbedCode;
        } else {
            return 'https://player.vimeo.com/video/' + videoNumber;
        }
    }
    getIndex() {
        return this.index + 1;
    }
}
