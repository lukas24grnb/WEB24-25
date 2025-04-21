// Controller.js
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
            if (["list-created", "list-deleted", "item-added", "item-toggled", "item-removed", "list-updated", "available-item-added", "tag-added", "tag-removed"].includes(event.type)) {
                if (["list-created", "list-deleted", "list-updated"].includes(event.type)) {
                    this.view.renderListen(this.model.lists);
                    if (!this.activeList || event.type === 'list-deleted') {
                        this.view.detailViewContainer.innerHTML = '';
                    }
                }

                if (this.activeList && this.model.lists.some(l => l.id === this.activeList.id)) {
                    this.activeList = this.model.lists.find(l => l.id === this.activeList.id);
                    this.view.renderDetailView(this.activeList);
                    this.setupAddItemButton();
                    this.setupItemEvents(this.activeList);
                    this.setupListStatusButton(this.activeList);
                    this.setupEditListTitleButton(this.activeList);
                }

                if (event.type === 'available-item-added') {
                    this.view.renderAvailableItems(this.model.getAvailableItems());
                }

                if (["tag-added", "tag-removed"].includes(event.type)) {
                    this.view.renderTags(this.model.getTags());
                    this.view.renderTagCheckboxes(this.model.getAllTags());
                    this.view.renderTagOptions(this.model.getTags());
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

            const li = e.target.closest('li[data-list-id]');
            if (li) {
                const listId = parseInt(li.dataset.listId, 10);
                if (isNaN(listId)) {
                    console.warn("Liste nicht gefunden für ID: NaN");
                    return;
                }

                const list = this.model.lists.find(l => l.id === listId);
                if (!list) {
                    console.warn("Liste nicht gefunden für ID:", listId);
                    return;
                }

                this.activeList = list;
                this.view.renderDetailView(this.activeList);
                this.setupAddItemButton();
                this.setupItemEvents(this.activeList);
                this.setupListStatusButton(this.activeList);
                this.setupEditListTitleButton(this.activeList);
            }
        });


        this.view.closeSidebarButton.addEventListener('click', () => {
            this.view.toggleRightSidebar(false);
            this.view.newArticleForm.classList.add('d-none');
            this.view.availableItemsList.classList.remove('d-none');
            this.view.itemQuantityInput.parentElement.classList.remove('d-none');
            this.view.sidebarTitle.textContent = 'Artikel hinzufügen';
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
            const description = this.view.newArticleDescription.value.trim();

            if (name) {
                const itemData = { name, tag, description };
                this.model.addAvailableItem(itemData);

                this.view.newArticleInput.value = '';
                this.view.newArticleTag.value = '';
                this.view.newArticleDescription.value = '';

                this.view.newArticleForm.classList.add('d-none');
                this.view.availableItemsList.classList.remove('d-none');
                this.view.itemQuantityInput.parentElement.classList.remove('d-none');
                this.view.sidebarTitle.textContent = 'Artikel hinzufügen';
            } else {
                alert('Bitte gib einen Artikelnamen ein.');
            }
        });

        this.view.tagFilterCheckboxesContainer.addEventListener('change', () => {
            const selectedTags = [...this.view.tagFilterCheckboxesContainer.querySelectorAll('input[type="checkbox"]:checked')]
                .map(cb => cb.value);
            const filtered = this.model.getAvailableItemsByTags(selectedTags);
            this.view.renderAvailableItems(filtered);
        });

        this.view.addTagButton.addEventListener('click', () => {
            const tagName = this.view.newTagInput.value.trim();
            if (tagName) {
                const success = this.model.addTag(tagName);
                if (success) {
                    this.view.newTagInput.value = '';
                } else {
                    alert('Tag existiert bereits.');
                }
            }
        });

        this.view.tagList.addEventListener('click', (e) => {
            const btn = e.target.closest('button');
            if (btn?.dataset.tag) {
                const tag = btn.dataset.tag;
                const used = this.model.isTagInUse(tag);
                if (used) {
                    alert('Dieser Tag wird verwendet und kann nicht gelöscht werden.');
                    return;
                }
                this.model.removeTag(tag);
            }
        });
    }

    setupAddItemButton() {
        if (!this.activeList || this.activeList.completed) return;

        const oldButton = this.view.addItemButton;
        const newButton = oldButton.cloneNode(true); // kopiere Knoten ohne Events
        oldButton.replaceWith(newButton); // ersetzt alten Button (löscht alte Events)
        this.view.addItemButton = newButton;

        newButton.addEventListener('click', () => {
            const tags = this.model.getAllTags();
            this.view.renderTagCheckboxes(tags);
            this.view.renderAvailableItems(this.model.getAvailableItems());
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

        const closeable = list.items.length === 0 || list.items.every(item => item.completed);
        btn.disabled = !closeable;
        btn.textContent = list.completed ? 'Liste aktivieren' : 'Liste abschließen';

        btn.onclick = () => {
            if (list.completed) {
                this.model.reopenList(list.id);
            } else if (closeable) {
                this.model.completeList(list.id);
            } else {
                alert('Alle Items müssen erledigt sein.');
            }
        };
    }

    setupEditListTitleButton(list) {
        const editBtn = document.getElementById('edit-list-title-btn');
        const titleContainer = document.getElementById('list-title-edit-container');

        if (!editBtn || !titleContainer) return;

        editBtn.addEventListener('click', () => {
            titleContainer.innerHTML = `
            <input type="text" id="edit-title-input" class="form-control form-control-sm me-2" value="${list.title}">
            <button class="btn btn-sm btn-success" id="save-title-btn">
                <i class="bi bi-check-lg"></i>
            </button>
        `;

            document.getElementById('save-title-btn').addEventListener('click', () => {
                const input = document.getElementById('edit-title-input');
                const newTitle = input.value.trim();

                if (newTitle && newTitle !== list.title) {
                    this.model.updateListTitle(list.id, newTitle);
                } else {
                    this.view.renderDetailView(list);
                    this.setupAddItemButton();
                    this.setupItemEvents(list);
                    this.setupListStatusButton(list);
                    this.setupEditListTitleButton(list);
                }
            });
        });
    }
}