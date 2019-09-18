import { Component, OnInit } from '@angular/core';
import { GameService } from '../shared/game.service';
import { Card } from '../models/card';
import { Game } from '../models/game';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ValueAccessor } from '@ionic/angular/dist/directives/control-value-accessors/value-accessor';

@Component({
  selector: 'app-game',
  templateUrl: './game.page.html',
  styleUrls: ['./game.page.scss'],
})
export class GamePage implements OnInit {
  show: boolean = false;
  rows: number;
  hidden: boolean = false;
  numberList: number[] = [];
  open1: boolean = false;
  open2: boolean = false;


  private iconMap = {
    "1": "basket", "2": "contract", "3": "expand", "4": "flashlight", "5": "happy", "6": "jet", "7": "planet", "8": "rose",
    "9": "pulse", "10": "rocket", "11": "heart", "12": "flash", "13": "add-circle", "14": "add-circle-outline", "15": "cafe", "16": "basketball",
    "17": "car", "18": "bus", "19": "hand", "20": "clock", "21": "heart-half", "22": "moon", "23": "paw", "24": "sad",
    "25": "school", "26": "star", "27": "logo-instagram", "28": "logo-youtube", "29": "logo-android", "30": "logo-apple", "31": "logo-facebook", "32": "logo-freebsd-devil",
  }

  game: Game;
  
  constructor(public _gameService: GameService,
    private router: Router,
    private storage: Storage,
    private snackBar: MatSnackBar
  ) {

  }

  ngOnInit() {

  }
  ngAfterViewInit() {
    this.storage.ready().then(() => {
      this.checkGameAsync().then((val) => {
        let valJson = JSON.parse(val);
        this.game = valJson;
        this.rows = valJson.rows;
        this.show = true;
        this._gameService.generateGrid();
      });
    });
  }

  public checkGameAsync(): Promise<string> {
    return this.storage.get('game').then((val) => {
      if (val) {
        return val;
      } else {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            this.checkGameAsync().then((val) => {
              resolve(val);
            }).catch(() => {
              reject();
            });
          }, 1000);
        })
      }
    });
  }

  flipCard(card: Card) {
    if (!card.hidden) {
      return;
    } else if (!GameService.isCurrentPlayer) {
      this.openSnackBar("Error!", "Not your turn!");
      return;
    }

    if (GameService.isSending) {
      return;
    } else {
      GameService.isSending = true;
    }

    var allConnected = true;
    var users = GameService.game.users;
    users.forEach(user => {  
      if(user.username==null) {
        allConnected=false;
        this.openSnackBar("Error!", "Wait for other players!");
        return;
      }
    });

    if(allConnected) {
    let val = this._gameService.getCurrentValue(card.index).then((num) => {
      card.icon = this.iconMap['' + num];

    }).catch((err) => {
      console.log(err);

    });;

  }

    //card.hidden = false;

    // ...
  }

  openSnackBar(message: string, description: string): void {
    this.snackBar.open(message, description, {
      duration: 2000
    });
  }

  openSnackBar2(message: string, description: string): void {
    this.snackBar.open(message, description, {
      duration: 20000
    });
  }


}
