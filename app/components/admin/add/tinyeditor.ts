import {Component, ElementRef, OnInit, Input, Output, EventEmitter, OnChanges} from 'angular2/core';
declare var tinymce: any;
@Component({
    selector: 'tiny-editor',
    template: `
    <div id="tinyFormGroup" class="form-group">
      <div class="hidden">
          <textarea id="baseTextArea">{{htmlContent}}</textarea>
      </div>
  </div>`
})
export class TinyEditor implements OnInit {
    @Input() value: any;
    @Output() valueChange = new EventEmitter();

    htmlContent: string;
    elementRef: ElementRef;
    elementID: string;

    constructor(elementRef: ElementRef) {
        this.elementRef = elementRef;

        var randLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
        var uniqid = randLetter + Date.now();

        this.elementID = 'tinymce' + uniqid;
        this.valueChange = new EventEmitter();

    }

    ngOnInit() {
        //this.value = "<body style='background-color: #00f0f0;'>" + this.value + "</div>";
        this.htmlContent = this.value;
        var that = this;
        var baseTextArea = this.elementRef.nativeElement.querySelector("#baseTextArea");
        var clonedTextArea = baseTextArea.cloneNode(true);
        clonedTextArea.id = this.elementID;

        var formGroup = this.elementRef.nativeElement.querySelector("#tinyFormGroup");
        formGroup.appendChild(clonedTextArea);
        tinymce.init(
            {
                selector: 'textarea',
                height: 500,
                theme: 'modern',
                plugins: [
                    'advlist autolink lists link image charmap print preview hr anchor pagebreak',
                    'searchreplace wordcount visualblocks visualchars code fullscreen',
                    'insertdatetime media nonbreaking save table contextmenu directionality',
                    'emoticons template paste textcolor colorpicker textpattern imagetools codesample toc'
                ],
                toolbar1: 'undo redo | insert | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image',
                toolbar2: 'print preview media | forecolor backcolor emoticons mybutton | codesample',
                image_advtab: true,
                templates: [
                    { title: 'Test template 1', content: 'Test 1' },
                    { title: 'Test template 2', content: 'Test 2' }
                ],
                content_css: [
                    '//fonts.googleapis.com/css?family=Lato:300,300i,400,400i',
                    '//www.tinymce.com/css/codepen.min.css'
                ],
                elements: this.elementID,
                setup: this.tinyMCESetup.bind(this)
            });
            
            tinymce.get(this.elementID).setContent(this.value);

            if (tinymce.activeEditor.dom.getStyle('mybackground', 'background-color') != undefined)
                tinymce.activeEditor.contentDocument.body.style.backgroundColor = tinymce.activeEditor.dom.getStyle('mybackground', 'background-color');
    }
    tinyMCESetup(ed) {
        ed.on('keyup', this.tinyMCEOnKeyup.bind(this));
        ed.on('click', this.tinyMCEOnKeyup.bind(this));
        ed.on('NodeChange', this.tinyMCEOnKeyup.bind(this));
        ed.on('change', this.tinyMCEOnKeyup.bind(this));

        ed.addButton('mybutton', {
          type: 'menubutton',
          text: 'Background',
          icon: false,
          menu: [{
            text: 'Light Grey #ff0000',
            tooltip: '#ff0000',
            onclick: function() {
                tinymce.activeEditor.dom.remove('mybackground');
                ed.insertContent("<b id='mybackground' style='background-color:#f0f0f0'></b>");
                
                //tinymce.activeEditor.dom.remove(tinymce.activeEditor.dom.select('style'));
                //ed.insertContent("<style>background-color:#f0f0f0;</style>");
                
                tinymce.activeEditor.contentDocument.body.style.backgroundColor = '#f0f0f0';
            }
          }, {
            text: 'Light Blue #00f0f0',
            tooltip: '#0000ff',
            onclick: function() {
                tinymce.activeEditor.dom.remove('mybackground');
                ed.insertContent("<b id='mybackground' style='background-color:#00f0f0'></b>");
                
                //tinymce.activeEditor.dom.remove(tinymce.activeEditor.dom.select('style'));
                //ed.insertContent("<style>background-color:#f0f0f0;</style>");
                
                tinymce.activeEditor.contentDocument.body.style.backgroundColor = '#00f0f0';
            }
          }]
        });
    }

    tinyMCEOnKeyup(e) {
        if(tinymce.get(this.elementID) == null) return;
        this.valueChange.emit(tinymce.get(this.elementID).getContent());
    }

    onChanges(changes) {
        if (tinymce.activeEditor)
            tinymce.activeEditor.setContent(this.value);
    }
}