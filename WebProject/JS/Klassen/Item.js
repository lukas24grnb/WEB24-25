export default class Item {
    static idCounter = 0;

    constructor(name, quantity = 1, tag = null, image = null, description = '') {
        this.id = ++Item.idCounter;
        this.name = name;
        this.quantity = quantity;
        this.completed = false; // Standardmäßig nicht erledigt
        this.tag = tag; // Tag-Objekt oder null
        this.image = image; // z. B. URL oder Base64
        this.description = description;
    }

    toggleCompleted() {
        this.completed = !this.completed;
    }
}
