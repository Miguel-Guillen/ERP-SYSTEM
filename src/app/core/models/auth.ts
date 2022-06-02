export class Auth {
    
    email: string;
    password: string;

    constructor(){
        this.email = '';
        this.password = '';
    }
}

export class UserAuth {
    id: string;
    rol: number;
    token: string;

    constructor(){
        this.id = '';
        this.rol = 0;
        this.token = '';
    }
}