import {Component, OnInit} from '@angular/core';
import {VietnameseServiceService} from '../vietnamese-service.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {
  en!: string;
  vi!: string;
  // showResult = true;
 search!: any ;
  english!: any;

  constructor(private vietnameseServiceService: VietnameseServiceService
  ) {
    console.log(this.en);
    console.log(this.vi);

  }
  onInput(event): any{
  this.search = event.target.value;
  this.loadData();
  }

  ngOnInit(): void {
  }

  loadData(): any
  {
    this.vietnameseServiceService.afterTranslate(this.search).subscribe(
      data => {
        this.english = data;
      },
      error => {
        console.log(error);
      }
    );
  }

}


