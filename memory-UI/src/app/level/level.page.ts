import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { GameService } from "../shared/game.service";

import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl
} from "@angular/forms";

@Component({
  selector: "app-level",
  templateUrl: "./level.page.html",
  styleUrls: ["./level.page.scss"]
})
export class LevelPage implements OnInit {
  gameForm: FormGroup;
  rowsNumber: number;
  playersNumber: number;

 
 


  constructor(
    private router: Router,
    public _gameService: GameService,
    private formBuilder: FormBuilder
  ) {
    this.gameForm = new FormGroup({
      selectDiff: new FormControl(4, [Validators.required]),
      selectPlayer: new FormControl(2, [Validators.required])
    });
  }

  ngOnInit() {
    this.gameForm.get("selectDiff").valueChanges.subscribe(selectedOption => {
      this.rowsNumber = selectedOption;
      console.log(this.rowsNumber);
      
    });

    this.gameForm.get("selectPlayer").valueChanges.subscribe(selectedOption => {
      this.playersNumber = selectedOption;
      console.log(this.playersNumber);
    });
  }

  onSubmit() {
    this.rowsNumber =  this.gameForm.get("selectDiff").value;
    this.playersNumber =  this.gameForm.get("selectPlayer").value;

    // first version
    // this._gameService.setGameProperties(this.rowsNumber, this.playersNumber);
    // this.router.navigate(["/key-list"]);

    //new version
    var gm =  this._gameService.createGame(this.rowsNumber, this.playersNumber).then(() => {
      console.log('uspjeeeh');
      this.router.navigate(['/key-list']);

    }).catch((err) => {
       console.log(err);
     // this.openSnackBar("Error!", "User code is incorrect!");
    });

  }
}
