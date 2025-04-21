
import Subject from './subject.js';
import List from './Klassen/List.js';
import Item from './Klassen/Item.js';
import User from './Klassen/User.js';

export default class Model extends Subject {
    constructor() {
        super();
        this.lists = [];
        this.availableItems = [];
        this.tags = [];
    }

    // --- LISTEN ---
    createList(title, creator) {
        const newList = new List(title, creator);
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

    updateListTitle(listId, newTitle) {
        const list = this.lists.find(l => l.id === listId);
        if (list && newTitle.trim()) {
            list.title = newTitle.trim();
            this.notify({ type: 'list-updated', listId: list.id });
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

    // --- ITEMS ---
    getAvailableItems() {
        return this.availableItems;
    }

    getAvailableItemsByTag(tag) {
        return this.availableItems.filter(item => item.tag === tag);
    }

    getAvailableItemsByTags(tags) {
        if (!tags.length) return this.availableItems;
        return this.availableItems.filter(item => tags.includes(item.tag));
    }

    addAvailableItem({ name, tag = null, image = null, description = '' }) {
        const newItem = new Item(name, 1, tag, image, description);
        this.availableItems.push(newItem);
        this.notify({ type: 'available-item-added', item: newItem });
    }

    addExistingItemToList(listId, itemId, quantity = 1) {
        const list = this.lists.find(l => l.id === listId);
        const template = this.availableItems.find(i => i.id === itemId);
        if (list && template && !list.completed) {
            const newItem = new Item(
                template.name,
                quantity,
                template.tag,
                template.image,
                template.description
            );
            list.addItem(newItem);
            this.notify({ type: 'item-added', listId, item: newItem });
        }
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

    // --- TAGS ---
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
            return true;
        }
        return false;
    }

    removeTag(tagName) {
        const isUsed = this.availableItems.some(item => item.tag === tagName);
        if (isUsed) return false;

        this.tags = this.tags.filter(t => t !== tagName);
        this.notify({ type: 'tag-removed', tag: tagName });
        return true;
    }

    isTagInUse(tag) {
        return this.availableItems.some(item => item.tag === tag);
    }

    // --- INITIALDATEN LADEN ---
    loadInitialData(data) {
        console.log("Geladene Listen:", this.lists);
        this.tags = data.tags || [];

        this.availableItems = (data.availableItems || []).map(i => new Item(
            i.name,
            i.quantity,
            i.tag,
            i.image,
            i.description
        ));

        this.lists = (data.lists || []).map(listData => {
            const user = new User(listData.creator.firstName, listData.creator.lastName);
            const list = new List(listData.title, user);
            list.id = parseInt(listData.id, 10); // <-- sicherstellen, dass es eine Zahl ist!
            list.completed = listData.completed;

            list.items = (listData.items || []).map(item => new Item(
                item.name,
                item.quantity,
                item.tag,
                item.image,
                item.description
            ));

            return list;
        });

        this.notify({ type: 'list-created' });
    }

}
