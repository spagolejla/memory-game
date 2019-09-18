import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GameService } from '../shared/game.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Clipboard } from '@ionic-native/clipboard/ngx';
import { Platform, ToastController } from '@ionic/angular';
import { Variable } from '@angular/compiler/src/render3/r3_ast';


@Component({
  selector: 'app-key-list',
  templateUrl: './key-list.page.html',
  styleUrls: ['./key-list.page.scss'],
})
export class KeyListPage {

  
  code1: string = null;
  code2: string[] = [null, null, null, null];
  showKeys: boolean = false;

  constructor(
    private platform: Platform,
    private router: Router,
    public _gameService: GameService,
    private snackBar: MatSnackBar,
    private clipboard: Clipboard,
    private toastController: ToastController
  ) {

  }

  public copyToClipboard(code: string) {
    if (this.platform.is("cordova")) {
      this.clipboard.copy(code).then((resolve: string) => {
        this.toastController.create({
          message: 'Copied to clipboard',
          duration: 3000
        }).then((toast) => {
          toast.present();
        });
      });
    } else {
      (<any>window).navigator.clipboard.writeText(code).then(() => {
        this.toastController.create({
          message: 'Copied to clipboard',
          duration: 3000
        }).then((toast) => {
          toast.present();
        });
      });
    }
  }

  ngAfterViewInit() {
    var number = GameService.gameStarter.playerNumber;
    console.log('Game starter u keylist:', GameService.gameStarter);
    setTimeout(() => {
      this.code1 = GameService.gameStarter.users[0].code;
      for (let index = 1; index < number; index++) {
        this.code2.push(GameService.gameStarter.users[index].code);
      }
      this.showKeys = true;
    }, 2000);
  }

  nextPage() {
    console.log(GameService.gameStarter);
    if (GameService.gameStarter.username !== '') {
      var err = this._gameService.getGameCode(GameService.gameStarter.users[0].code).then(() => {
        this.router.navigate(['/game']);
      }).catch((err) => {
        console.log(err);
        this.openSnackBar("Error!", "User code is incorrect!");
      });
    } else {
      this.router.navigate(['/enter-code']);
    }
  }
  openSnackBar(message: string, description: string): void {
    this.snackBar.open(message, description, {
      duration: 10000
    });
  }
}
