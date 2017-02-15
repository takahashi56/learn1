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
            text: '#f0f0f0',
            tooltip: '#f0f0f0',
            onclick: function() {
                tinymce.activeEditor.dom.remove('mybackground');
                ed.insertContent("<b id='mybackground' style='background-color:#f0f0f0'></b>");
                
                tinymce.activeEditor.contentDocument.body.style.backgroundColor = '#f0f0f0';
            }
          }, {
            text: '#00f0f0',
            tooltip: '#00f0f0',
            onclick: function() {
                tinymce.activeEditor.dom.remove('mybackground');
                ed.insertContent("<b id='mybackground' style='background-color:#00f0f0'></b>");
                
                tinymce.activeEditor.contentDocument.body.style.backgroundColor = '#00f0f0';
            }
          }, {
            text: '#54ACA9',
            tooltip: '#54ACA9',
            onclick: function() {
                tinymce.activeEditor.dom.remove('mybackground');
                ed.insertContent("<b id='mybackground' style='background-color:#54ACA9'></b>");
                
                tinymce.activeEditor.contentDocument.body.style.backgroundColor = '#54ACA9';
            }
          }, {
            text: '#353759',
            tooltip: '#353759',
            onclick: function() {
                tinymce.activeEditor.dom.remove('mybackground');
                ed.insertContent("<b id='mybackground' style='background-color:#353759'></b>");
                
                tinymce.activeEditor.contentDocument.body.style.backgroundColor = '#353759';
            }
          }, {
            text: '#55AAFF',
            tooltip: '#55AAFF',
            onclick: function() {
                tinymce.activeEditor.dom.remove('mybackground');
                ed.insertContent("<b id='mybackground' style='background-color:#55AAFF'></b>");
                
                tinymce.activeEditor.contentDocument.body.style.backgroundColor = '#55AAFF';
            }
          }, {
            text: '#211F22',
            tooltip: '#211F22',
            onclick: function() {
                tinymce.activeEditor.dom.remove('mybackground');
                ed.insertContent("<b id='mybackground' style='background-color:#211F22'></b>");
                
                tinymce.activeEditor.contentDocument.body.style.backgroundColor = '#211F22';
            }
          }, {
            text: '#447FB2',
            tooltip: '#447FB2',
            onclick: function() {
                tinymce.activeEditor.dom.remove('mybackground');
                ed.insertContent("<b id='mybackground' style='background-color:#447FB2'></b>");
                
                tinymce.activeEditor.contentDocument.body.style.backgroundColor = '#447FB2';
            }
          }, {
            text: '#EC8500',
            tooltip: '#EC8500',
            onclick: function() {
                tinymce.activeEditor.dom.remove('mybackground');
                ed.insertContent("<b id='mybackground' style='background-color:#EC8500'></b>");
                
                tinymce.activeEditor.contentDocument.body.style.backgroundColor = '#EC8500';
            }
          }, {
            text: '#4AA8AE',
            tooltip: '#4AA8AE',
            onclick: function() {
                tinymce.activeEditor.dom.remove('mybackground');
                ed.insertContent("<b id='mybackground' style='background-color:#4AA8AE'></b>");
                
                tinymce.activeEditor.contentDocument.body.style.backgroundColor = '#4AA8AE';
            }
          }, {
            text: '#FFD700',
            tooltip: '#FFD700',
            onclick: function() {
                tinymce.activeEditor.dom.remove('mybackground');
                ed.insertContent("<b id='mybackground' style='background-color:#FFD700'></b>");
                
                tinymce.activeEditor.contentDocument.body.style.backgroundColor = '#FFD700';
            }
          }, {
            text: '#0D425A',
            tooltip: '#0D425A',
            onclick: function() {
                tinymce.activeEditor.dom.remove('mybackground');
                ed.insertContent("<b id='mybackground' style='background-color:#0D425A'></b>");
                
                tinymce.activeEditor.contentDocument.body.style.backgroundColor = '#0D425A';
            }
          }, {
            text: '#528FCC',
            tooltip: '#528FCC',
            onclick: function() {
                tinymce.activeEditor.dom.remove('mybackground');
                ed.insertContent("<b id='mybackground' style='background-color:#528FCC'></b>");
                
                tinymce.activeEditor.contentDocument.body.style.backgroundColor = '#528FCC';
            }
          }, {
            text: '#4278AD',
            tooltip: '#4278AD',
            onclick: function() {
                tinymce.activeEditor.dom.remove('mybackground');
                ed.insertContent("<b id='mybackground' style='background-color:#4278AD'></b>");
                
                tinymce.activeEditor.contentDocument.body.style.backgroundColor = '#4278AD';
            }
          }, {
            text: '#E76C6D',
            tooltip: '#E76C6D',
            onclick: function() {
                tinymce.activeEditor.dom.remove('mybackground');
                ed.insertContent("<b id='mybackground' style='background-color:#E76C6D'></b>");
                
                tinymce.activeEditor.contentDocument.body.style.backgroundColor = '#E76C6D';
            }
          }, {
            text: '#EB9154',
            tooltip: '#EB9154',
            onclick: function() {
                tinymce.activeEditor.dom.remove('mybackground');
                ed.insertContent("<b id='mybackground' style='background-color:#EB9154'></b>");
                
                tinymce.activeEditor.contentDocument.body.style.backgroundColor = '#EB9154';
            }
          }, {
            text: '#FFAAD4',
            tooltip: '#FFAAD4',
            onclick: function() {
                tinymce.activeEditor.dom.remove('mybackground');
                ed.insertContent("<b id='mybackground' style='background-color:#FFAAD4'></b>");
                
                tinymce.activeEditor.contentDocument.body.style.backgroundColor = '#FFAAD4';
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