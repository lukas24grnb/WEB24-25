import Subject from './subject.js';
import List from './Klassen/List.js';
import Item from './Klassen/Item.js';
import User from './Klassen/User.js';

export default class Model extends Subject {
    constructor() {
        super();
        this.lists = [];
        this.availableItems = [
            new Item('Milch', 1, 'Getränke'),
            new Item('Brot', 1, 'Backwaren'),
            new Item('Äpfel', 1, 'Obst'),
            new Item('Karotten', 1, 'Gemüse')
        ];

        this.tags = ['Obst', 'Gemüse', 'Getränke', 'Backwaren'];

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

    getAvailableItemsByTag(tag) {
        return this.availableItems.filter(item => item.tag === tag);
    }

    getAvailableItemsByTags(selectedTags) {
        if (!selectedTags.length) return this.availableItems;
        return this.availableItems.filter(item =>
            selectedTags.includes(item.tag)
        );
    }

    getAllTags() {
        return [...this.tags];
    }


    getTags() {
        return this.tags;
    }

    addTag(tagName) {
        if (!this.tags.includes(tagName)) {
            this.tags.push(tagName);
            this.notify({ type: 'tag-added', tag: tagName });
        }
    }

    deleteTag(tagName) {
        const isUsed = this.availableItems.some(item => item.tag === tagName);
        if (isUsed) {
            alert('Tag kann nicht gelöscht werden – wird noch verwendet.');
            return false;
        }

        this.tags = this.tags.filter(t => t !== tagName);
        this.notify({ type: 'tag-deleted', tag: tagName });
        return true;
    }

    updateListTitle(listId, newTitle) {
        const list = this.lists.find(l => l.id === listId);
        if (list && newTitle.trim()) {
            list.title = newTitle.trim();
            this.notify({ type: 'list-updated', list });
        }
    }



}
