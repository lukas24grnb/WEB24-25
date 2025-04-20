// controller.js
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
            if (["list-created", "list-deleted", "item-added", "item-toggled", "item-removed", "list-updated"].includes(event.type)) {
                if (event.type === 'list-created' || event.type === 'list-deleted') {
                    this.view.renderListen(this.model.lists);
                    this.view.detailViewContainer.innerHTML = '';
                }

                if (event.type === 'list-updated') {
                    this.view.renderListen(this.model.lists);
                }

                if (this.activeList && event.listId === this.activeList.id) {
                    this.view.renderDetailView(this.activeList);
                    this.setupAddItemButton();
                    this.setupItemEvents(this.activeList);
                    this.setupListStatusButton(this.activeList);
                }
            }
            if (event.type === 'available-item-added') {
                const items = this.model.getAvailableItems();
                this.view.renderAvailableItems(items);
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
            const delBtn = e.target.closest('button.btn-outline-danger');
            if (delBtn && delBtn.dataset.listId) {
                const id = parseInt(delBtn.dataset.listId, 10);
                const list = this.model.lists.find(l => l.id === id);

                if (list.items.length > 0 && !list.completed) {
                    alert('Nur abgeschlossene Listen dürfen gelöscht werden.');
                    return;
                }


                if (confirm('Liste wirklich löschen?')) {
                    this.model.deleteList(id);
                }
                return;
            }


            const li = e.target.closest('li');
            if (li && li.dataset.listId) {
                const listId = parseInt(li.dataset.listId, 10);
                this.activeList = this.model.lists.find(l => l.id === listId);
                this.view.renderDetailView(this.activeList);
                this.setupAddItemButton();
                this.setupItemEvents(this.activeList);
                this.setupListStatusButton(this.activeList);
            }
        });

        this.view.closeSidebarButton.addEventListener('click', () => {
            this.view.toggleRightSidebar(false);
        });

        this.view.availableItemsList.addEventListener('click', e => {
            const li = e.target.closest('li');
            if (li) {
                this.selectedItemId = parseInt(li.dataset.itemId, 10);
                [...this.view.availableItemsList.children].forEach(el => el.classList.remove('active'));
                li.classList.add('active');
            }
        });

        this.view.addSelectedItemButton.addEventListener('click', () => {
            if (this.activeList && this.selectedItemId && !this.activeList.completed) {
                const qty = parseInt(this.view.itemQuantityInput.value, 10) || 1;
                this.model.addExistingItemToList(this.activeList.id, this.selectedItemId, qty);
                this.view.toggleRightSidebar(false);
                this.selectedItemId = null;
            }
        });

        this.view.newArticleButton.addEventListener('click', () => {
            this.view.availableItemsList.classList.add('d-none');
            this.view.itemQuantityInput.parentElement.classList.add('d-none');
            this.view.newArticleForm.classList.remove('d-none');
            this.view.sidebarTitle.textContent = 'Neuen Artikel erstellen';
        });

        this.view.saveNewArticleButton.addEventListener('click', () => {
            const name = this.view.newArticleInput.value.trim();
            const tag = this.view.newArticleTag.value || null;
            const image = this.view.newArticleImage.value.trim() || null;
            const description = this.view.newArticleDescription.value.trim();

            if (name) {
                const itemData = { name, tag, image, description };
                this.model.addAvailableItem(itemData);

                this.view.newArticleInput.value = '';
                this.view.newArticleTag.value = '';
                this.view.newArticleImage.value = '';
                this.view.newArticleDescription.value = '';

                this.view.newArticleForm.classList.add('d-none');
                this.view.availableItemsList.classList.remove('d-none');
                this.view.itemQuantityInput.parentElement.classList.remove('d-none');
                this.view.sidebarTitle.textContent = 'Artikel hinzufügen';
            } else {
                alert('Bitte gib einen Artikelnamen ein.');
            }
        });
    }

    setupAddItemButton() {
        if (!this.activeList || this.activeList.completed) return;
        this.view.addItemButton?.addEventListener('click', () => {
            const availableItems = this.model.getAvailableItems();
            this.view.renderAvailableItems(availableItems);
            this.view.toggleRightSidebar(true);
        });
    }

    setupItemEvents(list) {
        const ul = document.getElementById('list-item-ul');

        ul.onclick = (e) => {
            const checkbox = e.target.closest('.item-checkbox');
            const deleteBtn = e.target.closest('.item-delete-btn');

            if (checkbox) {
                const itemId = parseInt(checkbox.dataset.itemId, 10);
                this.model.toggleItemCompleted(list.id, itemId);
            }

            if (deleteBtn) {
                const itemId = parseInt(deleteBtn.dataset.itemId, 10);
                if (confirm('Item wirklich löschen?')) {
                    this.model.removeItemFromList(list.id, itemId);
                }
            }
        };
    }

    setupListStatusButton(list) {
        const btn = document.getElementById('toggle-list-status');
        if (!btn) return;

        const kannAbgeschlossenWerden = list.items.length === 0 || list.items.every(item => item.completed);

        btn.disabled = !kannAbgeschlossenWerden;

        btn.textContent = list.completed ? 'Liste aktivieren' : 'Liste abschließen';

        btn.onclick = () => {
            if (list.completed) {
                this.model.reopenList(list.id);
            } else if (kannAbgeschlossenWerden) {
                this.model.completeList(list.id);
            } else {
                alert('Alle Items müssen erledigt sein.');
            }
        };
    }
}
