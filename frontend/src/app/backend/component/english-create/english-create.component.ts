import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {EnglishService} from '../../service/english.service';
import {English} from '../../service/english';
import {Observable} from "rxjs";
import {Vietnamese} from "../../service/vietnamese";
import {VietnameseService} from "../../service/vietnamese.service";

@Component({
  selector: 'app-english-create',
  templateUrl: './english-create.component.html',
  styleUrls: ['./english-create.component.css']
})
export class EnglishCreateComponent implements OnInit {

  english: English = new English();
  submitted = false;
  // tslint:disable-next-line:variable-name
  error_msg = '';
  showLoadingDelete = false;
  vietnameses!: Observable<Vietnamese[]>;

  // tslint:disable-next-line:no-shadowed-variable
  constructor(private EnglishService: EnglishService,
              private router: Router,
              private toasrt: ToastrService,
              private vietnameseService: VietnameseService,
  ) {
  }

  ngOnInit(): void {
    this.vietnameses = this.vietnameseService.getVietnamesesList();
    // console.log(this.vietnameses);
  }

  newEnglish(): void {
    this.submitted = false;
    this.english = new English();
  }

  error(): void {
    this.toasrt.warning('Có lỗi xảy ra.', 'Your must enter all fields!');
    setTimeout( () => {
      window.location.reload();
    }, 1000);
  }

  save(): void {
    // console.log(this.submitted);
    // console.log(this.english);
    this.EnglishService
      .createEnglish(this.english)
      .subscribe((data: any) => {
          if (data.status !== undefined && data.status !== 'undefined') {
            if (data.status.includes('Authorization Token not found')) {
              this.error_msg = 'Authorization Token not found';
            } else if (data.status.includes('Token is Invalid')) {
              this.error_msg = 'Token is Invalid';
            }
          }

          // console.log(this.error_msg);
          else if (this.error_msg) {
            this.toasrt.warning(this.error_msg, 'Error happing while adding!');
          } else {
            this.english = new English();
            this.toasrt.success('Added successfully', 'Thêm thành công');
            this.showLoadingDelete = true;
            setTimeout(() => {
              // this.router.navigate(['english']);
              this.gotoList();
            }, 2000);
          }
        },
        (error: any) => this.error());
  }

  onSubmit(): void {
    // console.log(this);
    this.submitted = true;
    this.save();
  }

  gotoList(): void {
    this.router.navigate(['admin/english/list']);
  }
}
