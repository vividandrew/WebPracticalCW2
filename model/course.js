export default class course
{
    name;
    description;
    date;
    maxSize;
    cost;
    location;
    //TODO: Add location variable and update all controllers and frameworks to allow for this
    constructor(name, description, date, maxSize, cost, location){
        this.name = name;
        this.description = description;
        this.date = date;
        this.maxSize = maxSize;
        this.cost = cost;
        this.location = location
    }
}