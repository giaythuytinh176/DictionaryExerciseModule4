import {Component, Inject, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {EnglishService} from '../../service/english.service';
import {English} from '../../service/english';
import {Observable} from "rxjs";
import {Vietnamese} from "../../service/vietnamese";
import {VietnameseService} from "../../service/vietnamese.service";
import {AbstractControl, FormControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {DialogEnglishDelete} from "../english-list/english-list.component";

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
  showLoadingBar = false;
  vietnameses!: Observable<any>;
  // toppings = new FormControl();
  englishForm!: FormGroup;
  public englishFormAttempt: boolean;

  // tslint:disable-next-line:no-shadowed-variable
  constructor(private EnglishService: EnglishService,
              private router: Router,
              private toasrt: ToastrService,
              private vietnameseService: VietnameseService,
              private fb: FormBuilder,
              public dialog: MatDialog
  ) {
  }

  reset() {
    this.englishForm.reset();
    this.englishFormAttempt = false;
  }

  ngOnInit(): void {
    this.vietnameses = this.vietnameseService.getVietnamesesList();
    //console.log(this.vietnameses);
    this.englishForm = this.fb.group({
      name: ['', [Validators.required]],
      type: ['', [Validators.required]],
      vietnamese: ['', [Validators.required]],
      spelling: ['', [Validators.required]],
      description: ['', [Validators.required]],
    });
  }

  newEnglish(): void {
    this.submitted = false;
    this.english = new English();
  }

  error(): void {
    this.toasrt.warning('Có lỗi xảy ra.', 'Your must enter all fields!', {
      progressAnimation: 'decreasing',
      timeOut: 3000
    });
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  }

  save(): void {
    // console.log(this.submitted);
    // console.log(this.english);
    // console.log(111);
    this.english = this.englishForm.value;
    // console.log(this.englishForm);
    // this.english.vietnamese = this.toppings.value;
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
          if (this.error_msg) {
            this.toasrt.warning(this.error_msg, 'Error happing while adding!', {
              progressAnimation: 'decreasing',
              timeOut: 3000
            });
          } else {
            this.english = new English();
            this.toasrt.success('Added successfully', 'Thêm thành công', {
              progressAnimation: 'decreasing',
              timeOut: 3000
            });
            this.showLoadingBar = true;
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
    this.englishFormAttempt = true;
    this.submitted = true;
    this.save();
  }

  gotoList(): void {
    this.router.navigate(['admin/english/list']);
  }
}
