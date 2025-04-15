export default class course
{
    name;
    description;
    date;
    maxSize;
    //TODO: Add location variable and update all controllers and frameworks to allow for this
    constructor(name, description, date, maxSize){
        this.name = name;
        this.description = description;
        this.date = date;
        this.maxSize = maxSize;
    }
}