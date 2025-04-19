import Model from './model.js';
import View from './view.js';
import User from './Klassen/User.js';

export default class Controller {
    constructor(model, view) {
        this.model = model;
        this.view = view;
        this.activeList = null;
        this.selectedItemId = null;

        this.model.subscribe(event => {
            if (event.type === 'list-created' || event.type === 'list-deleted') {
                this.view.renderListen(this.model.lists);
                this.view.detailViewContainer.innerHTML = '';
            }
            if (event.type === 'item-added') {
                if (this.activeList && event.listId === this.activeList.id) {
                    this.view.renderDetailView(this.activeList);
                    this.setupAddItemButton();
                }
            }
        });

        this.view.addListButton.addEventListener('click', () => {
            const title = prompt('Listenname:');
            if (title?.trim()) {
                const user = new User('Max', 'Mustermann');
                this.model.createList(title.trim(), user);
            }
        });

        this.view.listenContainer.addEventListener('click', e => {
            const li = e.target.closest('li');
            if (li) {
                const listId = parseInt(li.dataset.listId, 10);
                this.activeList = this.model.lists.find(l => l.id === listId);
                this.view.renderDetailView(this.activeList);
                this.setupAddItemButton();
            }
        });

        this.view.closeSidebarButton.addEventListener('click', () => {
            this.view.toggleRightSidebar(false);
        });

        this.view.availableItemsList.addEventListener('click', e => {
            const li = e.target.closest('li');
            if (li) {
                this.selectedItemId = parseInt(li.dataset.itemId, 10);
                [...this.view.availableItemsList.children].forEach(el =>
                    el.classList.remove('active')
                );
                li.classList.add('active');
            }
        });

        this.view.addSelectedItemButton.addEventListener('click', () => {
            if (this.activeList && this.selectedItemId) {
                const qty = parseInt(this.view.itemQuantityInput.value, 10) || 1;
                this.model.addExistingItemToList(this.activeList.id, this.selectedItemId, qty);
                this.view.toggleRightSidebar(false);
                this.selectedItemId = null;
            }
        });


        this.view.listenContainer.addEventListener('click', e => {
            const delBtn = e.target.closest('button.btn-outline-danger');
            if (delBtn && delBtn.dataset.listId) {
                const id = parseInt(delBtn.dataset.listId, 10);
                if (confirm('Liste wirklich löschen?')) {
                    this.model.deleteList(id);
                }
                return; // verhindert gleichzeitiges Öffnen der Detailview
            }

            const li = e.target.closest('li');
            if (li && li.dataset.listId) {
                const listId = parseInt(li.dataset.listId, 10);
                this.activeList = this.model.lists.find(l => l.id === listId);
                this.view.renderDetailView(this.activeList);
                this.setupAddItemButton();
            }
        });

    }

    setupAddItemButton() {
        this.view.addItemButton.addEventListener('click', () => {
            const availableItems = this.model.getAvailableItems();
            this.view.renderAvailableItems(availableItems);
            this.view.toggleRightSidebar(true);
        });
    }
}
