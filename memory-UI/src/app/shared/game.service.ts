import { Injectable } from "@angular/core";
import { GameStart } from "../models/gameStart";
import { GameJoin } from "../models/gameJoin";
import { Observable, of } from "rxjs";

import * as Stomp from "stompjs";
import * as SockJS from "sockjs-client";
import { User } from "../models/user";
import { Game } from "../models/game";
import { Storage } from "@ionic/storage";
import { Card } from '../models/card';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: "root"
})
export class GameService {
  public static username: string;
  public static gameStarter: GameStart = new GameStart();
  public static isStarter: boolean = false;
  public static gameJoin: GameJoin = new GameJoin();
  public static game: Game = new Game();
  public static currentCode: string;
  public static gameCode: string;
  public static isCurrentPlayer: boolean = false;

  public static currentCardValue: number;
  public static cardList: Card[] = [];

  public static isSending: boolean = false;


  public numberList: number[];
  public list: Observable<number[]>;
  private serverUrl = "http://localhost:8080/ws";
  public static serverIPAddress = 'localhost:8080';
  private stompClient;
  private stompNewGameSubscription;
  private stompUserSubscription;
  private stompUser2Subscription;
  private stompRoomSubscription;
  private stompRoom2Subscription;

  private iconMap = {
    "1": "basket", "2": "contract", "3": "expand", "4": "flashlight", "5": "happy", "6": "jet", "7": "planet", "8": "rose",
    "9": "pulse", "10": "rocket", "11": "heart", "12": "flash", "13": "add-circle", "14": "add-circle-outline", "15": "cafe", "16": "basketball",
    "17": "car", "18": "bus", "19": "hand", "20": "clock", "21": "heart-half", "22": "moon", "23": "paw", "24": "sad",
    "25": "school", "26": "star", "27": "logo-instagram", "28": "logo-youtube", "29": "logo-android", "30": "logo-apple", "31": "logo-facebook", "32": "logo-freebsd-devil",
  }

  constructor(public storage: Storage, private snackBar: MatSnackBar) {
    this.initializeWebSocket();
  }
  initializeWebSocket() {
    if (GameService.serverIPAddress !== null) {
      this.serverUrl = `http://${GameService.serverIPAddress}/ws`;
    }
  }
  setUsername(username: string) {
    GameService.username = username;
  }

  getGame() {
    return GameService.game;
  }

  createGame(
    rowsNumber: number,
    playerNumber: number
  ): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.initializeWebSocket();
      GameService.gameStarter.username = GameService.username;
      GameService.gameStarter.rowsNumber = rowsNumber;
      GameService.gameStarter.playerNumber = playerNumber;
      GameService.isStarter = true;
      let ws = new SockJS(this.serverUrl);
      if (GameService.serverIPAddress !== null) {
        this.serverUrl = `http://${GameService.serverIPAddress}/ws`;
        console.log("Adressa servera: ", this.serverUrl);
        console.log("IP servera: ", GameService.serverIPAddress);
      }


      this.stompClient = Stomp.over(ws);
      this.stompClient.connect({}, () => {

        // listen to new game
        if (this.stompNewGameSubscription) {
          this.stompNewGameSubscription.unsubscribe();
        }
        this.stompNewGameSubscription = this.stompClient.subscribe(
          "/topic/newGame",
          payload => {
            var game = JSON.parse(payload.body);

            for (let i = 0; i < game.users.length; i++) {
              let usr = new User(
                game.users[i].username,
                game.users[i].userCode,
                game.users[i].points
              );
              GameService.gameStarter.users.push(usr);
            }

            this.storage.ready().then(() => {
              this.storage.set("startUser", JSON.stringify(GameService.gameStarter)).then(value => {
                console.log("startUser postavljeno", value);
                resolve(true);
              });
            });

          },
          error => {
            console.log("Subscribe: error: " + error);
            reject();
          },
          () => {
            console.log("Subscribe, On complete");
            resolve(true);
          }
        );

        // create new game
        this.stompClient.send(
          "/app/memory/createGame",
          {},
          JSON.stringify({
            username: GameService.gameStarter.username,
            numberOfPlayers: playerNumber,
            rows: rowsNumber
          })
        );
      });
    });
  }


  getCards(): Card[] {
    return GameService.cardList;
  }
  isGameOver() {
    let isOver = true;
    for (let i = 0; i < GameService.cardList.length; i++) {
      if (GameService.cardList[i].hidden === true) {
        isOver = false;
      }
    }



    return isOver;
  }

  getWinner() {
    let winner = GameService.game.users[0].username;
    for (let i = 0; i < GameService.game.users.length - 1; i++) {
      if (GameService.game.users[i + 1].points > GameService.game.users[i].points) {
        winner = GameService.game.users[i + 1].username;
      }
    }

    return winner;
  }
  getGameCode(userCode: string): Promise<boolean> {
    return new Promise((resolve, reject) => {

      //starter start game
      GameService.isCurrentPlayer = true;

      GameService.currentCode = userCode;
      if (GameService.serverIPAddress !== null) {
        this.serverUrl = `http://${GameService.serverIPAddress}/ws`;
      }
      let ws = new SockJS(this.serverUrl);
      this.stompClient = Stomp.over(ws);
      this.stompClient.connect({}, () => {
        if (this.stompUserSubscription) {
          this.stompUserSubscription.unsubscribe();
        }
        this.stompUserSubscription = this.stompClient.subscribe(
          "/topic/user" + userCode,
          payload => {
            var data = JSON.parse(payload.body);
            GameService.gameCode = data.gameCode;
            console.log(data);
            if (!data || data.gameCode === null) {
              reject();
            } else {
              if (this.stompRoomSubscription) {
                this.stompRoomSubscription.unsubscribe();
              }
              this.stompRoomSubscription = this.stompClient.subscribe(
                "/topic/room" + data.gameCode,
                payload => {

                  console.log("Subscribe na room za startera");
                  this.handleGame(payload);
                  GameService.isSending = false;
                  resolve(true);
                },
                error => {
                  console.log("Subscribe: error: " + error);
                  GameService.isSending = false;
                  reject();
                },
                () => {
                  console.log("Subscribe, On complete");
                }
              );

              this.stompClient.send(
                "/app/memory/startGame",
                {},
                JSON.stringify({ gameCode: data.gameCode })
              );
            }
          },
          error => {
            console.log("Subscribe: error: " + error);
          },
          () => {
            console.log("Subscribe, On complete");
          }
        );

        this.stompClient.send(
          "/app/memory/findRoom",
          {},
          JSON.stringify({
            userCode: userCode,
            username: GameService.gameStarter.username
          })
        );
      });
    });
  }

  joinPlayer(userCode: string, username: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      GameService.gameJoin.username = username;
      GameService.gameJoin.key = userCode;
      GameService.currentCode = userCode;

      this.storage.ready().then(() => {
        this.storage.set("joinUser", JSON.stringify(GameService.gameJoin));
      });

      console.log("Join player:", GameService.gameJoin);
      if (GameService.serverIPAddress !== null) {
        this.serverUrl = `http://${GameService.serverIPAddress}/ws`;
      }
      let ws = new SockJS(this.serverUrl);
      this.stompClient = Stomp.over(ws);
      this.stompClient.connect({}, () => {
        if (this.stompUser2Subscription) {
          this.stompUser2Subscription.unsubscribe();
        }
        this.stompUser2Subscription = this.stompClient.subscribe(
          "/topic/user" + userCode,
          payload => {
            var data = JSON.parse(payload.body);
            GameService.gameCode = data.gameCode;
            console.log(data);
            if (!data || data.gameCode === null) {
              reject();
            } else {
              if (this.stompRoom2Subscription) {
                this.stompRoom2Subscription.unsubscribe();
              }
              this.stompRoom2Subscription = this.stompClient.subscribe(
                "/topic/room" + data.gameCode,
                payload => {
                  "Subscribe na room za startera"
                  this.handleGame(payload);
                  GameService.isSending = false;
                  resolve(true);
                },
                error => {
                  console.log("Subscribe: error: " + error);
                  GameService.isSending = false;
                  reject();
                },
                () => {
                  console.log("Subscribe, On complete");
                }
              );

              console.log("Subscribe na user");

              this.stompClient.send(
                "/app/memory/startGame",
                {},
                JSON.stringify({ gameCode: data.gameCode })
              );
            }
          },
          error => {
            console.log("Subscribe: error: " + error);
          },
          () => {
            console.log("Subscribe, On complete");
          }
        );
        this.stompClient.send(
          "/app/memory/findRoom",
          {},
          JSON.stringify({ userCode: userCode, username: username })
        );
      });
    });
  }



  //userCode, position
  getValueOfCard(index: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
      //this.generateGrid();
      if (GameService.serverIPAddress !== null) {
        this.serverUrl = `http://${GameService.serverIPAddress}/ws`;
      }
      let ws = new SockJS(this.serverUrl);
      this.stompClient = Stomp.over(ws);
      this.stompClient.connect({}, () => {
      this.stompClient.send("/app/memory/sendMove",
          {},
          JSON.stringify({ userCode: GameService.currentCode, position: index })
      );


      });
    });
  }

  generateGrid() {
    let num = GameService.game.rows * GameService.game.rows;
    for (let i = 0; i < num; i++) {
      const card = new Card();
      card.index = i;
      card.number = 1;
      card.icon = 'hourglass';
      card.hidden = true;

      GameService.cardList.push(card);
    }
  }
  handleGame(payload) {
    this.storage.ready().then(() => {
      this.storage.set('joinUser', JSON.stringify(GameService.gameJoin)).then((value) => {
        console.log('game postavljeno', value);
        var game = JSON.parse(payload.body);
        if (game.rows) {
          var game = JSON.parse(payload.body);
          GameService.game.rows = game.rows;
          GameService.game.users = game.users;
          console.log("Ovdje ", GameService.game.users);
          this.storage.set("game", JSON.stringify(GameService.game)).then(value => {
            console.log("game postavljeno", value);
          });
        } else if (game.cardValue) {

          console.log('card u subscibe', game);

          GameService.game.users.forEach(user => {
            if (user.username === game.currentPlayer.username) {
              console.log("Sad dobije poen " + game.currentPlayer.points + " " + game.currentPlayer.username)
              user.points = game.currentPlayer.points;
            }
          });

          for (let i = 0; i < game.cards.length; i++) {
            if (game.cards[i].value != null) {
              GameService.cardList[i].hidden = false;
              GameService.cardList[i].icon = this.iconMap['' + game.cards[i].value];
            }
            else {
              GameService.cardList[i].hidden = true;
            }
          }
          if (this.isGameOver()) {

            this.openSnackBar2(`Winner is: ${this.getWinner()}!`, "Congrats!")
          }
          GameService.currentCardValue = JSON.parse(game.cardValue);
          if (GameService.currentCode === game.nextPlayer.userCode) {
            GameService.isCurrentPlayer = true;
            this.openSnackBar("You are current player!", "Done");

          }
          else {
            GameService.isCurrentPlayer = false;
          }
        }

      });
    });
  }

  getCurrentValue(index: number): Promise<number> {
    return new Promise((resolve, reject) => {

      var f = this.getValueOfCard(index).then(() => {
        console.log('card na kraju funkc', GameService.currentCardValue)
        resolve(GameService.currentCardValue);
      }).catch((err) => {
        console.log(err);
        reject();
      });




    });
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
