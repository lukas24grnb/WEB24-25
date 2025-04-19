export default class Tag {
    static idCounter = 0;

    constructor(name, color = "gray") {
        this.id = ++Tag.idCounter;
        this.name = name;
        this.color = color;
    }
}
