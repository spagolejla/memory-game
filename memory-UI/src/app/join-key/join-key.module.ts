import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';


import { IonicModule } from '@ionic/angular';

import { JoinKeyPage } from './join-key.page';
import { MaterialDesignModule } from '../shared/material-design.module';

const routes: Routes = [
  {
    path: '',
    component: JoinKeyPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    MaterialDesignModule,
    RouterModule.forChild(routes)
  ],
  declarations: [JoinKeyPage]
})
export class JoinKeyPageModule {}
