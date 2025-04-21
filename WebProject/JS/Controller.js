
import Model from './model.js';
import View from './view.js';
import User from './Klassen/User.js';

export default class Controller {
    constructor(model, view) {
        this.model = model;
        this.view = view;
        this.activeList = null;
        this.selectedItemId = null;

        this.model.subscribe(event => this.handleModelEvent(event));

        this.view.addListButton.addEventListener('click', () => {
            const title = prompt('Listenname:');
            if (title?.trim()) {
                const user = new User('Max', 'Mustermann');
                this.model.createList(title.trim(), user);
            }
        });

        this.view.listenContainer.addEventListener('click', (e) => this.handleListClick(e));

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
                this.model.addAvailableItem({ name, tag, description });

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
                if (this.model.addTag(tagName)) {
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
                if (this.model.isTagInUse(tag)) {
                    alert('Dieser Tag wird verwendet und kann nicht gelöscht werden.');
                } else {
                    this.model.removeTag(tag);
                }
            }
        });
    }

    handleModelEvent(event) {
        const relevant = ["list-created", "list-deleted", "item-added", "item-toggled", "item-removed", "list-updated", "available-item-added", "tag-added", "tag-removed"];
        if (!relevant.includes(event.type)) return;

        if (["list-created", "list-deleted", "list-updated"].includes(event.type)) {
            this.view.renderListen(this.model.lists);
            if (!this.activeList || event.type === 'list-deleted') {
                this.view.detailViewContainer.innerHTML = '';
                return;
            }
        }

        const found = this.model.lists.find(l => l.id === this.activeList?.id);
        if (found) {
            this.activeList = found;
            this.renderActiveList();
        }

        if (event.type === 'available-item-added') {
            this.view.renderAvailableItems(this.model.getAvailableItems());
        }

        if (["tag-added", "tag-removed"].includes(event.type)) {
            const tags = this.model.getAllTags();
            this.view.renderTags(tags);
            this.view.renderTagCheckboxes(tags);
            this.view.renderTagOptions(tags);
        }
    }

    handleListClick(e) {
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
            const list = this.model.lists.find(l => l.id === listId);
            if (list) {
                this.activeList = list;
                this.renderActiveList();
            }
        }
    }

    renderActiveList() {
        this.view.renderDetailView(this.activeList);
        this.setupAddItemButton();
        this.setupItemEvents(this.activeList);
        this.setupListStatusButton(this.activeList);
        this.setupEditListTitleButton(this.activeList);
    }

    setupAddItemButton() {
        this.view.addItemButton?.addEventListener('click', () => {
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
                    this.renderActiveList();
                }
            });
        });
    }
}