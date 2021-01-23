import {Observable} from 'rxjs';
import {Component, Inject, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {ToastrService} from 'ngx-toastr';
import {English} from '../../service/english';
import {EnglishService} from '../../service/english.service';

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

  constructor(private englishService: EnglishService,
              private router: Router,
              public dialog: MatDialog,
              private toasrt: ToastrService,
  ) {
  }

  ngOnInit(): void {
    this.reloadData();
  }

  reloadData(): void {
    this.englishs = this.englishService.getEnglishsList();
    // console.log(this.employees);
  }

  deleteEnglish(id: number): void {
    this.englishService.deleteEnglish(id)
      .subscribe(
        data => {
          console.log(data);
          if ((data.status || []).indexOf('Token is Invalid') !== -1) {
            this.toasrt.warning(data.status, 'Error happing while deleting!');
          } else {
            this.reloadData();
            this.toasrt.success('Deleted successfully', 'Xoá thành công');
          }
        },
        error => {
          console.log(error);
          this.toasrt.warning('Có lỗi xảy ra, không thể xoá được file.', 'Error happing while deleting!');
        });
  }

  englishDetails(id: number): void {
    this.router.navigate(['details', id]);
  }

  getEnglishsByName(): void {
    console.log('here');
    this.englishs = this.englishService.getEnglishsByName(this.name);
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
        this.deleteEnglish(id);
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
