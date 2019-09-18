import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatStepperModule } from "@angular/material/stepper";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatTableModule } from "@angular/material/table";
import { MatCardModule } from "@angular/material/card";
import { MatListModule } from "@angular/material/list";
import { MatExpansionModule } from "@angular/material/expansion";
@NgModule({
  declarations: [],
  imports: [CommonModule,
    MatGridListModule,
    MatIconModule,
    MatButtonModule,
    MatStepperModule,
    MatSnackBarModule,
    MatTableModule,
    MatCardModule,
    MatListModule,
    MatExpansionModule
  ],
  exports: [
    MatGridListModule,
    MatIconModule,
    MatButtonModule,
    MatStepperModule,
    MatSnackBarModule,
    MatTableModule,
    MatCardModule,
    MatListModule,
    MatExpansionModule
  ]
})
export class MaterialDesignModule {}
