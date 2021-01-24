import {Component, Inject, OnInit} from '@angular/core';
import {Vietnamese} from '../../service/vietnamese';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';
import {Observable} from 'rxjs';
import {VietnameseService} from '../../service/vietnamese.service';

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


  constructor(private vietnameseService: VietnameseService,
              private router: Router,
              public dialog: MatDialog,
              private toasrt: ToastrService,
  ) {
  }

  ngOnInit(): void {
    this.reloadData();
  }

  reloadData(): void {
    this.vietnameses = this.vietnameseService.getVietnamesesList();
    // console.log(this.employees);
  }

  deleteVietnamese(id: number): void {
    this.vietnameseService.deleteVietnamese(id)
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



  getVietnamesesByName(): void {
    console.log('here');
    this.vietnameses = this.vietnameseService.getVietnamesesByName(this.name);
  }

  openDialog(id: number, name: string, type: string, spelling?: string, description?: string): void {
    const dialogRef = this.dialog.open(DialogVietnameseDelete, {
      data: {id: id, name: name, type: type, spelling: spelling, description: description}
    });
    dialogRef.afterClosed().subscribe(result => {
      // console.log('The dialog was closed');
      // console.log(id);
      if (result) {
        console.log(result);
        this.deleteVietnamese(id);
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


