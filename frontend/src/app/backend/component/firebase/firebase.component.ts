import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {finalize} from "rxjs/operators";
import {AngularFireStorage, AngularFireUploadTask} from "@angular/fire/storage";
import {AngularFirestore} from "@angular/fire/firestore";

@Component({
  selector: 'app-firebase',
  templateUrl: './firebase.component.html',
  styleUrls: ['./firebase.component.scss']
})
export class FirebaseComponent implements OnInit {
  title = "cloudsSorage";
  selectedFile: File = null;
  fb;
  downloadURL: Observable<string>;
  uploadPercent: Observable<number>;
  // Main task
  task: AngularFireUploadTask;
  // Progress monitoring
  percentage: Observable<number>;
  snapshot: Observable<any>;
  // State for dropzone CSS toggling
  isHovering: boolean;

  constructor(private storage: AngularFireStorage, private db: AngularFirestore) {
  }

  ngOnInit() {
  }

  toggleHover(event: boolean) {
    this.isHovering = event;
  }

  // Determines if the upload task is active
  isActive(snapshot) {
    return snapshot.state === 'running' && snapshot.bytesTransferred < snapshot.totalBytes
  }

  onFileSelected($event: any) {
    var n = Date.now();
    const file = $event.target.files[0];
    const filePath = `RoomsImages/${n}`;
    const fileRef = this.storage.ref(filePath);
    // Totally optional metadata
    const customMetadata = {app: 'My AngularFire-powered PWA!'};
    this.task = this.storage.upload(filePath, file, {customMetadata});
    console.log(this.task);

    // observe percentage changes
    this.uploadPercent = this.task.percentageChanges();
    this.percentage = this.task.percentageChanges();
    this.snapshot = this.task.snapshotChanges()

    // get notified when the download URL is available
    this.task
      .snapshotChanges()
      .pipe(
        finalize(() => {
          this.downloadURL = fileRef.getDownloadURL();
          this.downloadURL.subscribe(url => {
            if (url) {
              this.fb = url;
            }
            console.log(this.fb);
            // console.log(1111);
          });
        })
      )
      .subscribe(url => {
        if (url) {
          console.log(url);
        }
      });
  }
}
