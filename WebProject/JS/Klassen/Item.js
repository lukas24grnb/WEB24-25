export default class Item {
    static idCounter = 0;

    constructor(name, quantity = 1, tag = null, image = null, description = '') {
        this.id = ++Item.idCounter;
        this.name = name;
        this.quantity = quantity;
        this.completed = false;
        this.tag = tag;
        this.image = image;
        this.description = description;
    }

    toggleCompleted() {
        this.completed = !this.completed;
    }
}
