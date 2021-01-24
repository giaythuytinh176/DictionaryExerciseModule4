import {Component, OnInit} from '@angular/core';
import {Vietnamese} from '../../service/vietnamese';
import {VietnameseService} from '../../service/vietnamese.service';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';

@Component({
  selector: 'app-vietnamese-create',
  templateUrl: './vietnamese-create.component.html',
  styleUrls: ['./vietnamese-create.component.css']
})
export class VietnameseCreateComponent implements OnInit {
  vietnamese: Vietnamese = new Vietnamese();
  submitted = false;
  // tslint:disable-next-line:variable-name
  error_msg = '';
  showLoadingBar = false;

  constructor(private vietnameseService: VietnameseService,
              private router: Router,
              private toasrt: ToastrService
  ) {
  }

  // tslint:disable-next-line:typedef
  ngOnInit() {
  }

  newVietnamese(): void {
    this.submitted = false;
    this.vietnamese = new Vietnamese();
  }

  save(): void {
    // console.log(this.submitted);
    console.log(this.vietnamese);
    this.vietnameseService
      .createVietnamese(this.vietnamese)
      .subscribe((data: any) => {
          if (data.status !== undefined && data.status !== 'undefined') {
            if (data.status.includes('Authorization Token not found')) {
              this.error_msg = 'Authorization Token not found';
            } else if (data.status.includes('Token is Invalid')) {
              this.error_msg = 'Token is Invalid';
            }
          }
          // console.log(this.error_msg);
          if (this.error_msg) {
            this.toasrt.warning(this.error_msg, 'Error happing while adding!', {progressAnimation: 'decreasing', timeOut: 3000});
          } else {
            this.vietnamese = new Vietnamese();
            this.toasrt.success('Added successfully', 'Thêm thành công', {progressAnimation: 'decreasing', timeOut: 3000});
            this.showLoadingBar = true;
            setTimeout(() => {
              // this.router.navigate(['employees']);
              this.gotoList();
            }, 1000);
          }
        },
        (error: any) => console.log(error));
  }

  onSubmit(): void {
    // console.log(this);
    this.submitted = true;
    this.save();
  }

  gotoList(): void {
    this.router.navigate(['admin/vietnamese/list']);
  }
}
