import Subject from './subject.js';
import List from './Klassen/List.js';
import Item from './Klassen/Item.js';
import User from './Klassen/User.js';

export default class Model extends Subject {
    constructor() {
        super();
        this.lists = [];
        this.availableItems = [
            new Item('Milch'),
            new Item('Brot'),
            new Item('Äpfel'),
            new Item('Karotten'),
        ];
    }

    createList(title, creator) {
        const newList = new List(title, creator);
        newList.completed = false;
        this.lists.push(newList);
        this.notify({ type: 'list-created', list: newList });
        return newList;
    }

    deleteList(listId) {
        const index = this.lists.findIndex(list => list.id === listId);
        if (index !== -1) {
            const removed = this.lists.splice(index, 1)[0];
            this.notify({ type: 'list-deleted', list: removed });
        }
    }

    getAvailableItems() {
        return this.availableItems;
    }

    addExistingItemToList(listId, itemId, quantity = 1) {
        const list = this.lists.find(l => l.id === listId);
        const itemTemplate = this.availableItems.find(i => i.id === itemId);
        if (list && itemTemplate && !list.completed) {
            const newItem = new Item(
                itemTemplate.name,
                quantity,
                itemTemplate.tag,
                itemTemplate.image,
                itemTemplate.description
            );
            list.addItem(newItem);
            this.notify({ type: 'item-added', listId, item: newItem });
        }
    }

    addAvailableItem({ name, tag = null, image = null, description = '' }) {
        const newItem = new Item(name, 1, tag, image, description);
        this.availableItems.push(newItem);
        this.notify({ type: 'available-item-added', item: newItem });
    }

    toggleItemCompleted(listId, itemId) {
        const list = this.lists.find(l => l.id === listId);
        const item = list?.items.find(i => i.id === itemId);
        if (item) {
            item.toggleCompleted();
            this.notify({ type: 'item-toggled', listId, item });
        }
    }

    removeItemFromList(listId, itemId) {
        const list = this.lists.find(l => l.id === listId);
        if (list) {
            list.removeItem(itemId);
            this.notify({ type: 'item-removed', listId, itemId });
        }
    }

    completeList(listId) {
        const list = this.lists.find(l => l.id === listId);
        if (list) {
            list.completed = true;
            this.notify({ type: 'list-updated', listId });
        }
    }

    reopenList(listId) {
        const list = this.lists.find(l => l.id === listId);
        if (list) {
            list.completed = false;
            this.notify({ type: 'list-updated', listId });
        }
    }
}
