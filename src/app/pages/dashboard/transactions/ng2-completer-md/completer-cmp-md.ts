import { Component, Input, Output, EventEmitter, OnInit, ViewChild, forwardRef } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR,FormControl } from "@angular/forms";
import { CtrCompleter} from "ng2-completer";
import { MAX_CHARS, MIN_SEARCH_LENGTH, PAUSE, TEXT_SEARCHING, TEXT_NO_RESULTS } from "./globals";
import { CompleterService, CompleterItem } from 'ng2-completer';

import "rxjs/add/operator/catch";

const noop = () => { };

const COMPLETER_CONTROL_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => CompleterCmpMd),
    multi: true
};


@Component({
    selector: "ng2-completer-md",
    templateUrl: "./completer-cmp-md.html",
    styleUrls: ["./completer-cmp-md.css"],
    providers: [COMPLETER_CONTROL_VALUE_ACCESSOR]
})
export class CompleterCmpMd implements OnInit, ControlValueAccessor {
    /*@Input() public dataService;
    @Input() public inputName = "";
    @Input() public pause = PAUSE;
    @Input() public minSearchLength = MIN_SEARCH_LENGTH;
    @Input() public maxChars = MAX_CHARS;
    @Input() public overrideSuggested = false;
    @Input() public fillHighlighted = true;
    @Input() public clearSelected = false;
    @Input() public placeholder = "";
    @Input() public matchClass: string;
    @Input() public textSearching = TEXT_SEARCHING;
    @Input() public textNoResults = TEXT_NO_RESULTS;
    @Input() public fieldTabindex: number;
    @Input() public autoMatch = false;
    @Input() public disableInput = false;
    @Output() public selected = new EventEmitter<CompleterItem>();
    @Output() public highlighted = new EventEmitter<CompleterItem>();
    @Output() public blur = new EventEmitter<void>();

    public displaySearching = true;
    public searchStr = "";
    */


    @Input() public dataService;
    @Input() public inputName = "";
    @Input() public inputId: string = "";
    @Input() public pause = PAUSE;
    @Input() public minSearchLength = MIN_SEARCH_LENGTH;
    @Input() public maxChars = MAX_CHARS;
    @Input() public overrideSuggested = false;
    @Input() public clearSelected = false;
    @Input() public clearUnselected = false;
    @Input() public fillHighlighted = true;
    @Input() public placeholder = "";
    @Input() public matchClass: string;
    @Input() public fieldTabindex: number;
    @Input() public autoMatch = false;
    @Input() public disableInput = false;
    @Input() public inputClass: string;
    @Input() public autofocus = false;
    @Input() public openOnFocus = false;
    @Input() public openOnClick = false;
    @Input() public selectOnClick = false;
    @Input() public selectOnFocus = false;
    @Input() public initialValue: any;
    @Input() public autoHighlight = false;

    @Output() public selected = new EventEmitter<CompleterItem>();
    @Output() public highlighted = new EventEmitter<CompleterItem>();
    @Output("blur") public blurEvent = new EventEmitter<void>();
    @Output() public click = new EventEmitter<void>();
    @Output("focus") public focusEvent = new EventEmitter<void>();
    @Output() public opened = new EventEmitter<boolean>();
    @Output() public keyup: EventEmitter<any> = new EventEmitter();
    @Output() public keydown: EventEmitter<any> = new EventEmitter();
    @Output() public blur = new EventEmitter<void>();
    @Output() public onFieldChange = new EventEmitter<any>();
    public control = new FormControl("");
    public displaySearching = true;
    public displayNoResults = true;
    public textNoResults = TEXT_NO_RESULTS;
    public textSearching = TEXT_SEARCHING;

    private focus: boolean = false;
    private open: boolean = false;
    private searchStr = "";

    @ViewChild(CtrCompleter) private completer: CtrCompleter;

    private _onTouchedCallback: () => void = noop;
    private _onChangeCallback: (_: any) => void = noop;

    constructor() { }

    get value(): any { return this.searchStr; };

    set value(v: any) {
        if (v !== this.searchStr) {
            this.searchStr = v;
            console.log("is it being fired .....", v)
            this._onChangeCallback(v);
        }
    }

    public onTouched() {
        this._onTouchedCallback();
    }

    public writeValue(value: any) {
        this.searchStr = value;
    }

    public registerOnChange(fn: any) {
        this._onChangeCallback = fn;
    }

    public registerOnTouched(fn: any) {
        this._onTouchedCallback = fn;
    }

    public ngOnInit() {
        this.completer.selected.subscribe((item: CompleterItem) => {
            this.selected.emit(item);
            if (item) {
                this._onChangeCallback(item.title);
            }
        });
        this.completer.highlighted.subscribe((item: CompleterItem) => {
            this.highlighted.emit(item);
        });

        if (this.textSearching === "false") {
            this.displaySearching = false;
        }
    }

    onChange(event, value){
        this.onFieldChange.emit({value:value});       
    }

    public onBlur() {
        this.blur.emit();
        this.onTouched();
    }
}