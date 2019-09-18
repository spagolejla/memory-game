import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { GameService } from "../shared/game.service";
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: "app-start",
  templateUrl: "./start.page.html",
  styleUrls: ["./start.page.scss"]
})
export class StartPage implements OnInit {
 

 
  constructor(private router: Router,    private snackBar: MatSnackBar,  private formBuilder: FormBuilder) {
    
  }

  ngOnInit() {}

  startGame() {
    this.router.navigate(["/level"]);
  }

  joinGame() {
    this.router.navigate(["/join-key"]);
  }

  

 

}
