import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {
  en!: string;
  vi!: string;
  // showResult = true;
  enableEn = false;
  enableVi = false;

  constructor() {
    if (this.en) {
      this.enableEn = true;
    }
    if (this.vi) {
      this.enableVi = true;
    }
    console.log(this.en);
    console.log(this.vi);

  }

  ngOnInit(): void {

    // console.log(this.dictionaryForm);
  }

}
