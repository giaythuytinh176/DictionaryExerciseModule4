import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Douling Dương';
  isReady = false;

  constructor(){
    setTimeout(() => {
      this.isReady = true;
    }, 2000);
  }
}
