export default class User
{
    id;
    username;
    password;
    fullname;
    role;
    constructor(id, username, password, fullname, role){
        this.id = id;
        this.username = username;
        this.password = password;
        this.fullname = fullname;
        this.role = role;
    }    
}