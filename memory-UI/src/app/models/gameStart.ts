import { User } from './user';

export class GameStart {
    username: string;
    rowsNumber: number;
    playerNumber: number;
    private _users: User[] = [];
    public get users(): User[] {
        return this._users;
    }
    public set users(value: User[]) {
        this._users = value;
    }
}