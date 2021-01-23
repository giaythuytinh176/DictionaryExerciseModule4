import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {EnglishListComponent} from './backend/component/english-list/english-list.component';
import {EnglishCreateComponent} from './backend/component/english-create/english-create.component';
import {EnglishUpdateComponent} from './backend/component/english-update/english-update.component';

const routes: Routes = [
  { path: 'english/list', component: EnglishListComponent },
  { path: 'english/add', component: EnglishCreateComponent },
  { path: 'english/update/:id', component: EnglishUpdateComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
