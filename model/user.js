export default class User
{
    username;
    password;
    fullname;
    role;
    constructor(username, password, fullname, role){
        this.username = username;
        this.password = password;
        this.fullname = fullname;
        this.role = role;
    }    
}