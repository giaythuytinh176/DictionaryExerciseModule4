import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {VietnameseUpdateComponent} from './backend/component/vietnamese-update/vietnamese-update.component';
import {VietnameseListComponent} from './backend/component/vietnamese-list/vietnamese-list.component';
import {VietnameseCreateComponent} from './backend/component/vietnamese-create/vietnamese-create.component';

const routes: Routes = [
  { path: 'vietnamese/list', component: VietnameseListComponent },
  { path: 'vietnamese/add', component: VietnameseCreateComponent },
  { path: 'vietnamese/update/:id', component: VietnameseUpdateComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
