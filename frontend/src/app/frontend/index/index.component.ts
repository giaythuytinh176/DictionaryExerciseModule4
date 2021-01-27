import {Component, OnInit} from '@angular/core';
import {EnglishService} from "../service/english.service";
import {Observable, Subject} from "rxjs";
import {concatMap, debounceTime, distinctUntilChanged, switchMap, throttleTime} from "rxjs/operators";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {
  en = '';
  vi = '';
  // showResult = true;
  enableEn = false;
  enableVi = false;
  data!: any;
  vnlist!: any;
  textareaValue = '';

  search$ = new Subject<string>();
  searchResult$: Observable<any>;

  constructor(
    private englishServiceTranlsate: EnglishService,
    private http: HttpClient
  ) {
  }

  ngOnInit(): any {
    this.search$.pipe(
      throttleTime(300),
      distinctUntilChanged(),
      //concatMap(value => {
      switchMap(value => {
        return this.http.post(environment.apiUrl + '/translate', {word: value}) || [];
      })
    ).subscribe(
      (next) => {
        this.vnlist = JSON.stringify(next) || [] ;
        this.enableEn = true;
        console.log(next);
      });
  }

  getValueEnglish(word: any) {
    this.textareaValue = word.target.value;
    console.log(this.textareaValue);
    console.log(this.en);
    // this.englishServiceTranlsate.tranlsateEnglish(this.textareaValue).subscribe((res) => {
    //   this.data = res;
    //   this.enableEn = true;
    //   console.log(this.data);
    // }, (error) => {
    //   console.log(error);
    // });

    this.vnlist = this.englishServiceTranlsate.tranlsateEnglish(this.textareaValue);
    this.enableEn = true;
    console.log(this.vnlist);

    //console.log(this.textareaValue);
    // console.log(this.data);

  }


  getValueVietnamese($event: Event) {

  }
}
