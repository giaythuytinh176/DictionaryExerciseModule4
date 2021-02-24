import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {EnglishListComponent} from './backend/component/english-list/english-list.component';
import {EnglishCreateComponent} from './backend/component/english-create/english-create.component';
import {EnglishUpdateComponent} from './backend/component/english-update/english-update.component';
import {VietnameseUpdateComponent} from './backend/component/vietnamese-update/vietnamese-update.component';
import {VietnameseListComponent} from './backend/component/vietnamese-list/vietnamese-list.component';
import {VietnameseCreateComponent} from './backend/component/vietnamese-create/vietnamese-create.component';
import {LoginComponent} from "./backend/component/login/login.component";
import {IndexComponent} from "./frontend/index/index.component";
import {FirebaseComponent} from "./backend/component/firebase/firebase.component";

const routes: Routes = [
  {path: '', component: IndexComponent},
  {path: 'admin/vietnamese/list', component: VietnameseListComponent},
  {path: 'admin/vietnamese/add', component: VietnameseCreateComponent},
  {path: 'admin/vietnamese/update/:id', component: VietnameseUpdateComponent},
  {path: 'admin/english/list', component: EnglishListComponent},
  {path: 'admin/english/add', component: EnglishCreateComponent},
  {path: 'admin/english/update/:id', component: EnglishUpdateComponent},
  {path: 'admin/login', component: LoginComponent},
  {path: 'admin', component: EnglishListComponent},
  {path: 'admin/upload', component: FirebaseComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
