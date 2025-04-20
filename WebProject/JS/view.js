// view.js
export default class View {
    constructor() {
        this.listenContainer = document.getElementById('listen-liste');
        this.addListButton = document.getElementById('neue-liste-btn');
        this.detailViewContainer = document.getElementById('detail-view');
        this.rightSidebar = document.getElementById('rechte-sidebar');

        this.availableItemsList = document.getElementById('available-items-list');
        this.itemQuantityInput = document.getElementById('item-quantity');
        this.addSelectedItemButton = document.getElementById('add-selected-item');
        this.closeSidebarButton = document.getElementById('close-sidebar');

        this.newArticleButton = document.getElementById('new-article-btn');
        this.newArticleInput = document.getElementById('new-article-input');
        this.saveNewArticleButton = document.getElementById('save-new-article-btn');
        this.newArticleForm = document.getElementById('new-article-form');
        this.sidebarTitle = document.getElementById('sidebar-title');

        this.newArticleTag = document.getElementById('new-article-tag');
        this.newArticleImage = document.getElementById('new-article-image');
        this.newArticleDescription = document.getElementById('new-article-description');
    }

    renderListen(lists) {
        this.listenContainer.innerHTML = '';
        lists.forEach(list => {
            const li = document.createElement('li');
            li.className = 'list-group-item d-flex justify-content-between align-items-center';

            if (list.completed) {
                li.classList.add('list-completed');
            }


            li.dataset.listId = list.id;

            const span = document.createElement('span');
            span.textContent = list.title;
            li.appendChild(span);

            const delBtn = document.createElement('button');
            delBtn.className = 'btn btn-sm btn-outline-danger';
            delBtn.innerHTML = '<i class="bi bi-trash"></i>';
            delBtn.dataset.listId = list.id;
            li.appendChild(delBtn);

            this.listenContainer.appendChild(li);
        });
    }

    renderDetailView(list) {
        this.detailViewContainer.innerHTML = `
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h2>${list.title}</h2>
        <button class="btn btn-outline-secondary" id="toggle-list-status">...</button>
      </div>
      <button class="btn btn-outline-success mb-3" id="artikel-hinzufuegen-btn" ${list.completed ? 'disabled' : ''}>
        <i class="bi bi-plus-circle"></i> Artikel hinzufügen
      </button>
      <ul class="list-group" id="list-item-ul">
        ${list.items.map(item => `
          <li class="list-group-item d-flex justify-content-between align-items-center ${item.completed ? 'bg-light' : ''}">
            <div class="form-check">
              <input class="form-check-input item-checkbox" type="checkbox" data-item-id="${item.id}" ${item.completed ? 'checked' : ''}>
              <label class="form-check-label ${item.completed ? 'text-decoration-line-through' : ''}">
                ${item.quantity}× ${item.name}${item.description ? ', ' + item.description : ''}
              </label>
            </div>
            <button class="btn btn-sm btn-danger item-delete-btn" data-item-id="${item.id}">
              <i class="bi bi-trash"></i>
            </button>
          </li>
        `).join('')}
      </ul>
    `;

        this.addItemButton = document.getElementById('artikel-hinzufuegen-btn');
    }

    renderAvailableItems(items) {
        this.availableItemsList.innerHTML = '';
        items.forEach(item => {
            const li = document.createElement('li');
            li.className = 'list-group-item d-flex justify-content-between align-items-center';
            li.dataset.itemId = item.id;
            li.innerHTML = `<span>${item.name}</span>`;
            this.availableItemsList.appendChild(li);
        });
    }

    toggleRightSidebar(show = true) {
        this.rightSidebar.classList.toggle('d-none', !show);
    }
}