import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { KeyListPage } from './key-list.page';
import { MaterialDesignModule } from '../shared/material-design.module';

const routes: Routes = [
  {
    path: '',
    component: KeyListPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MaterialDesignModule,
    RouterModule.forChild(routes)
  ],
  declarations: [KeyListPage]
})
export class KeyListPageModule {}
