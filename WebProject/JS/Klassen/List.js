export default class List {
    static idCounter = 0;

    constructor(title, creator) {
        this.id = ++List.idCounter;
        this.title = title;
        this.creator = creator;
        this.items = [];
        this.sharedWith = [];
    }

    addItem(item) {
        this.items.push(item);
    }

    removeItem(itemId) {
        this.items = this.items.filter(item => item.id !== itemId);
    }

    getOpenItemsCount() {
        return this.items.filter(item => !item.completed).length;
    }
}
