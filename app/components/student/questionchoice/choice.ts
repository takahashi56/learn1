import {Component, OnInit, Input, Output, EventEmitter} from 'angular2/core';
import {Session} from '../../../services/session';
import {ROUTER_DIRECTIVES, Router} from 'angular2/router';
import {CanActivate} from 'angular2/router';
import {StudentService} from '../../../services/student';

@Component({
    selector: 'choice',
    template: `
        <div class="radio-box m-t-20">
            <label class="cr-styled" for="answer1">
                <input type="radio" name="answer" id="answer1" value="1" (click)="chooseAnswer(1)">
                <i class="fa"></i>
                <strong class="m-l-10">{{answerA}}</strong>
            </label>
        </div>
        <div class="radio-box m-t-20">
            <label class="cr-styled" for="answer2">
                <input type="radio" name="answer" id="answer2" value="2"  (click)="chooseAnswer(2)">
                <i class="fa"></i>
                <strong class="m-l-10">{{answerB}}</strong>
            </label>
        </div>
        <div class="radio-box m-t-20">
            <label class="cr-styled" for="answer3">
                <input type="radio" name="answer" id="answer3" value="3" (click)="chooseAnswer(3)">
                <i class="fa"></i>
                <strong class="m-l-10">{{answerC}}</strong>
            </label>
        </div>
    `,
    providers: [Session, StudentService],
    directives: [ROUTER_DIRECTIVES],
})

export class Choice{

    @Input() answerA: string;
    @Input() answerB: string;
    @Input() answerC: string;

    @Output() selectAnswer=new EventEmitter();

    constructor(){

    }

    chooseAnswer(n: number){
        this.selectAnswer.emit(n);
    }
}