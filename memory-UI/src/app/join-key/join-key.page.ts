import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { GameService } from '../shared/game.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-join-key',
  templateUrl: './join-key.page.html',
  styleUrls: ['./join-key.page.scss'],
})
export class JoinKeyPage implements OnInit {
  private joinKeyForm: FormGroup;

  constructor(
    private router: Router,
    public _gameService: GameService,
    private snackBar: MatSnackBar
  ) { 
    this.joinKeyForm = new FormGroup({
      code: new FormControl()
   });
  }

  ngOnInit() {
  }

  joinGame(){
    if(this.joinKeyForm.invalid)
    {
      return;
    }
    var e = false;
    var err = this._gameService.joinPlayer(this.joinKeyForm.get("code").value,GameService.username).then((val) => {
      e = val;
      this.openSnackBar("Success!", "Join game!");
      this.router.navigate(['/game']);

    }).catch((err) => { console.log(err);
      this.openSnackBar("Error!", "User code is incorrect!");
    });
    
    if(e === false){
      this.openSnackBar("Error!", "User code is incorrect!");
    }
    
  }
  
  openSnackBar(message: string, description: string): void {
    this.snackBar.open(message, description, {
      duration: 5000
    });
  }
}
