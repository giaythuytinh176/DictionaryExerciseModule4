import {Observable} from 'rxjs';
import {Component, Inject, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {ToastrService} from 'ngx-toastr';
import {English} from '../../service/english';
import {EnglishService} from '../../service/english.service';
import {EnglishCreateComponent} from "../english-create/english-create.component";
import {VietnameseService} from "../../service/vietnamese.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {TokenStorageService} from "../../service/token-storage.service";

@Component({
  selector: 'app-english-list',
  templateUrl: './english-list.component.html',
  styleUrls: ['./english-list.component.css']
})
export class EnglishListComponent implements OnInit {
  englishs!: Observable<English[]>;
  id!: number;
  name!: string;
  type!: string;
  spelling!: string;
  description!: string;
  error_msg = '';

  constructor(private englishService: EnglishService,
              private router: Router,
              public dialog: MatDialog,
              private toasrt: ToastrService,
              private tokenstorage: TokenStorageService
  ) {
  }

  ngOnInit(): void {
    this.reloadData();
  }

  reloadData(): void {
    this.englishs = this.englishService.getEnglishsList();
    // console.log(this.employees);
  }

  deleteEnglish(id: number, name: string): void {
    this.englishService.deleteEnglish(id)
      .subscribe(
        data => {
          if (data.status !== undefined && data.status !== 'undefined') {
            if (data.status.includes('Authorization Token not found')) {
              this.error_msg = 'Authorization Token not found';
            } else if (data.status.includes('Token is Invalid')) {
              this.error_msg = 'Token is Invalid';
            } else if (data.status.includes('oken is Expire')) {
              this.error_msg = 'Token is Expired';
            }
          }
          if (this.error_msg) {
            this.tokenstorage.signOut();
            this.toasrt.warning(this.error_msg, 'Error happing while adding!', {
              progressAnimation: 'decreasing',
              timeOut: 3000
            });
          } else {
            this.reloadData();
            this.toasrt.success('Deleted successfully', 'Xoá thành công ' + name, {
              progressAnimation: 'decreasing',
              timeOut: 3000
            });
          }
        },
        error => {
          console.log(error);
          this.toasrt.warning('Có lỗi xảy ra, không thể xoá được file.', 'Error happing while deleting!', {
            progressAnimation: 'decreasing',
            timeOut: 3000
          });
        });
  }

  englishDetails(id: number): void {
    this.router.navigate(['details', id]);
  }

  getEnglishsByName(): void {
    console.log('here');
    this.englishs = this.englishService.getEnglishsByName(this.name);
  }

  openDialogCreate(): void {
    const dialogRef = this.dialog.open(DialogEnglishCreate, {
      data: {}
    });
    dialogRef.afterClosed().subscribe(result => {
      // console.log('The dialog was closed');
      // console.log(id);
      if (result) {
        this.reloadData();
        console.log(result);
        //this.deleteEnglish(id, name);
      }
      // console.log(this);
      // this.animal = result;
    });
  }

  openDialog(id: number, name: string, type: string, spelling?: string, description?: string): void {
    const dialogRef = this.dialog.open(DialogEnglishDelete, {
      data: {id: id, name: name, type: type, spelling: spelling, description: description}
    });
    dialogRef.afterClosed().subscribe(result => {
      // console.log('The dialog was closed');
      // console.log(id);
      if (result) {
        console.log(result);
        this.deleteEnglish(id, name);
      }
      // console.log(this);
      // this.animal = result;
    });
  }
}

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'dialog-english-delete',
  templateUrl: 'dialog-english-delete.html',
})
// tslint:disable-next-line:component-class-suffix
export class DialogEnglishDelete {

  constructor(
    public dialogRef: MatDialogRef<DialogEnglishDelete>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    // console.log(this.data);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}

export interface DialogData {
  id: number;
  name: string;
  type: string;
  spelling: string;
  description: string;
}

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'dialog-english-create',
  templateUrl: 'dialog-english-create.html',
})
// tslint:disable-next-line:component-class-suffix
export class DialogEnglishCreate implements OnInit {
  english: English = new English();
  submitted = false;
  // tslint:disable-next-line:variable-name
  error_msg = '';
  showLoadingBar = false;
  vietnameses!: Observable<any>;
  // toppings = new FormControl();
  englishForm!: FormGroup;
  public englishFormAttempt: boolean;
  typeList = [
    'Danh từ',
    'Động từ',
    'Tính từ',
    'Trạng từ',
    'Giới từ',
  ];

  constructor(
    public dialogRef: MatDialogRef<DialogEnglishCreate>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData2,
    private EnglishService: EnglishService,
    private router: Router,
    private toasrt: ToastrService,
    private vietnameseService: VietnameseService,
    private fb: FormBuilder,
    private tokenstorage: TokenStorageService
  ) {
    // console.log(this.data);
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
            } else if (data.status.includes('oken is Expire')) {
              this.error_msg = 'Token is Expired';
            }
          }
          // console.log(this.error_msg);
          if (this.error_msg) {
            this.tokenstorage.signOut();
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

  onNoClick(): void {
    this.dialogRef.close();
  }
}

export interface DialogData2 {
  name: string;
  vietnamese: string;
  type: string;
  spelling: string;
  description: string;
}
