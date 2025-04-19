// model.js
import Subject from './subject.js';
import List from './Klassen/List.js';
import Item from './Klassen/Item.js';
import User from './Klassen/User.js';
import Tag from './Klassen/Tag.js';



export default class Model extends Subject {
    constructor() {
        super();
        // Hier speichern wir alle Einkaufslisten
        this.lists = [];
    }

    // Eine neue Liste erstellen und alle Observer informieren
    createList(title, creator) {
        const newList = new List(title, creator);
        this.lists.push(newList);
        this.notify({ type: 'list-created', list: newList });
        return newList;
    }

    // Eine Liste anhand ihrer ID löschen
    deleteList(listId) {
        const index = this.lists.findIndex(list => list.id === listId);
        if (index !== -1) {
            const removedList = this.lists.splice(index, 1)[0];
            this.notify({ type: 'list-deleted', list: removedList });
            return removedList;
        }
        return null;
    }

    // Einen neuen Artikel zu einer bestimmten Liste hinzufügen
    addItemToList(listId, itemData) {
        // Suche die Liste
        const list = this.lists.find(list => list.id === listId);
        if (list) {
            // Erstelle einen neuen Item mit den übergebenen Daten
            const newItem = new Item(
                itemData.name,
                itemData.quantity,
                itemData.tag,
                itemData.image,       // optional: URL oder Base64-Daten
                itemData.description  // optional: Beschreibung des Artikels
            );
            list.addItem(newItem);
            this.notify({ type: 'item-added', listId, item: newItem });
            return newItem;
        }
        return null;
    }

    // Den Status eines Artikels (abgeschlossen / nicht abgeschlossen) toggeln
    toggleItemCompleted(listId, itemId) {
        const list = this.lists.find(list => list.id === listId);
        if (list) {
            const item = list.items.find(item => item.id === itemId);
            if (item) {
                item.toggleCompleted();
                this.notify({ type: 'item-toggled', listId, item });
                return item;
            }
        }
        return null;
    }

    // Hier können weitere Methoden folgen, z.B. Listen teilen, Items löschen, etc.
}
