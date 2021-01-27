import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {Vietnamese} from '../../service/vietnamese';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef, } from '@angular/material/dialog';
import {MatPaginator} from '@angular/material/paginator';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';
import {Observable} from 'rxjs';
import {VietnameseService} from '../../service/vietnamese.service';
import {English} from '../../service/english';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {EnglishService} from '../../service/english.service';
import {TokenStorageService} from '../../service/token-storage.service';
import {MatTableDataSource} from '@angular/material/table';

export interface PeriodicElement {
  name: string;
  english: string;
  type: string;
  spelling: string;
  description: string;
}

@Component({
  selector: 'app-vietnamese-list',
  templateUrl: './vietnamese-list.component.html',
  styleUrls: ['./vietnamese-list.component.css']
})
export class VietnameseListComponent implements OnInit {



  vietnameses!: Observable<Vietnamese[]>;
  id!: number;
  name!: string;
  type!: string;
  spelling!: string;
  description!: string;
  // tslint:disable-next-line:variable-name
  error_msg = '';
  ELEMENT_DATA!: PeriodicElement;
  dataSource!: any;
  displayedColumns!: any;

  constructor(private vietnameseService: VietnameseService,
              private router: Router,
              public dialog: MatDialog,
              private toasrt: ToastrService,
              private tokenstorage: TokenStorageService
  ) {
  }

  @ViewChild(MatPaginator) paginator: MatPaginator;


  ngOnInit(): void {
    this.reloadData();

    this.ELEMENT_DATA  = this.dataSource;
    // @ts-ignore
    this.dataSource = new MatTableDataSource<PeriodicElement>(this.ELEMENT_DATA);

    this.displayedColumns = ['id', 'name', 'type', 'spelling', 'description'];
    this.dataSource.paginator = this.paginator;

    // @ts-ignore
  }


  reloadData(): void {
    this.vietnameseService.getVietnamesesList().subscribe(
      data => {
        this.dataSource = data;
      },
      error => {
        console.log(error);
      }
    );
    // this.vietnameses = this.vietnameseService.getVietnamesesList();
    // // console.log(this.employees);
  }

  deleteVietnamese(id: number, name: string): void {
    // @ts-ignore
    this.vietnameseService.deleteVietnamese(id)
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


  vietnameseDetails(id: number): void {
    this.router.navigate(['details', id]);
  }

  getVietnamesesByName(): void {
    console.log('here');
    this.vietnameses = this.vietnameseService.getVietnamesesByName(this.name);
  }

  openDialogCreate(): void {
    const dialogRef = this.dialog.open(DialogVietnameseCreate, {
      data: {}
    });
    dialogRef.afterClosed().subscribe(result => {
      // console.log('The dialog was closed');
      // console.log(id);
      if (result) {
        this.reloadData();
        console.log(result);
        // this.deleteEnglish(id, name);
      }
      // console.log(this);
      // this.animal = result;
    });
  }

  openDialog(id: number, name: string, type: string, spelling?: string, description?: string): void {
    const dialogRef = this.dialog.open(DialogVietnameseDelete, {
      data: {id, name, type, spelling, description}
    });
    dialogRef.afterClosed().subscribe(result => {
      // console.log('The dialog was closed');
      // console.log(id);
      if (result) {
        console.log(result);
        this.deleteVietnamese(id, name);
      }
      // console.log(this);
      // this.animal = result;
    });
  }
}

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'dialog-vietnamese-delete',
  templateUrl: 'dialog-vietnamese-delete.html',
})
// tslint:disable-next-line:component-class-suffix
export class DialogVietnameseDelete {
  constructor(
    public dialogRef: MatDialogRef<DialogVietnameseDelete>,
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
  selector: 'dialog-vietnamese-create',
  templateUrl: 'dialog-vietnamese-create.html',
})
// tslint:disable-next-line:component-class-suffix
export class DialogVietnameseCreate implements OnInit {
  vietnamese: Vietnamese = new Vietnamese();
  submitted = false;
  // tslint:disable-next-line:variable-name
  error_msg = '';
  showLoadingBar = false;
  englishs!: Observable<any>;
  // toppings = new FormControl();
  vietnameseForm!: FormGroup;
  public vietnameseFormAttempt: boolean;
  typeList = [
    'Danh từ',
    'Động từ',
    'Tính từ',
    'Trạng từ',
    'Giới từ',
  ];

  constructor(
    public dialogRef: MatDialogRef<DialogVietnameseCreate>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData2,
    // tslint:disable-next-line:no-shadowed-variable
    private VietnameseService: VietnameseService,
    private router: Router,
    private toasrt: ToastrService,
    private englishService: EnglishService,
    private fb: FormBuilder,
    private tokenstorage: TokenStorageService
  ) {
    // console.log(this.data);
  }

  reset() {
    this.vietnameseForm.reset();
    this.vietnameseFormAttempt = false;
  }

  ngOnInit(): void {
    this.englishs = this.englishService.getEnglishsList();
    // console.log(this.vietnameses);
    this.vietnameseForm = this.fb.group({
      name: ['', [Validators.required]],
      type: ['', [Validators.required]],
      english: ['', [Validators.required]],
      spelling: ['', [Validators.required]],
      description: ['', [Validators.required]],
    });
  }

  newVietnamese(): void {
    this.submitted = false;
    this.vietnamese = new Vietnamese();
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
    this.vietnamese = this.vietnameseForm.value;
    // console.log(this.englishForm);
    // this.english.vietnamese = this.toppings.value;
    this.VietnameseService
      .createVietnamese(this.vietnamese)
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
            this.vietnamese = new Vietnamese();
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
    this.vietnameseFormAttempt = true;
    this.submitted = true;
    this.save();
  }

  gotoList(): void {
    this.router.navigate(['admin/vietnamese/list']);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}

export interface DialogData2 {
  name: string;
  english: string;
  type: string;
  spelling: string;
  description: string;
}
