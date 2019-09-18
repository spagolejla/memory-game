export class User {
    username: string;
    code: string;
    points: number;

    constructor(username: string, code: string, points: number){
        this.username = username;
        this.code = code;
        this.points = points;
    }
}