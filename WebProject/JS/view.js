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

        this.tagFilterCheckboxesContainer = document.getElementById('tag-filter-checkboxes');

        this.tagList = document.getElementById('tag-list'); // <ul> mit Tags
        this.addTagButton = document.getElementById('add-tag-btn'); // + Button
        this.newTagInput = document.getElementById('new-tag-input'); // Eingabefeld
    }

    renderListen(lists) {
        this.listenContainer.innerHTML = '';
        lists.forEach((list, index) => {
            const li = document.createElement('li');
            li.className = 'list-group-item d-flex justify-content-between align-items-center';
            if (list.completed) li.classList.add('list-completed');
            li.dataset.listId = list.id;

            const span = document.createElement('span');
            span.textContent = list.title;
            li.appendChild(span);

            const delBtn = document.createElement('button');
            delBtn.className = 'btn btn-sm btn-outline-danger';
            delBtn.innerHTML = '<i class="bi bi-trash"></i>';
            delBtn.dataset.listId = list.id;
            li.appendChild(delBtn);


            if (index === lists.length - 1) {
                li.classList.add('list-slide-in');
            }

            this.listenContainer.appendChild(li);
        });
    }


    renderDetailView(list) {
        this.detailViewContainer.innerHTML = `
      <div class="d-flex justify-content-between align-items-center mb-3">
        <div id="list-title-edit-container" class="d-flex align-items-center gap-2">
          <h2 id="list-title" class="mb-0">${list.title}</h2>
          <button class="btn btn-sm btn-outline-secondary" id="edit-list-title-btn">
            <i class="bi bi-pencil-square"></i>
          </button>
        </div>
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

    renderTagCheckboxes(tags) {
        this.tagFilterCheckboxesContainer.innerHTML = '';
        tags.forEach(tag => {
            const wrapper = document.createElement('div');
            wrapper.className = 'form-check';

            const input = document.createElement('input');
            input.className = 'form-check-input me-2';
            input.type = 'checkbox';
            input.value = tag;
            input.id = `filter-${tag}`;

            const label = document.createElement('label');
            label.className = 'form-check-label';
            label.setAttribute('for', `filter-${tag}`);
            label.textContent = tag;

            wrapper.appendChild(input);
            wrapper.appendChild(label);

            this.tagFilterCheckboxesContainer.appendChild(wrapper);
        });
    }

    renderTagOptions(tags) {
        if (!this.newArticleTag) return;
        this.newArticleTag.innerHTML = '<option value="">Kategorie wählen...</option>';
        tags.forEach(tag => {
            const opt = document.createElement('option');
            opt.value = tag;
            opt.textContent = tag;
            this.newArticleTag.appendChild(opt);
        });
    }

    renderTags(tags) {
        if (!this.tagList) return;
        this.tagList.innerHTML = '';
        tags.forEach(tag => {
            const li = document.createElement('li');
            li.className = 'list-group-item d-flex justify-content-between align-items-center';
            li.textContent = tag;

            const btn = document.createElement('button');
            btn.className = 'btn btn-sm btn-outline-danger';
            btn.innerHTML = '<i class="bi bi-trash"></i>';
            btn.dataset.tag = tag;

            li.appendChild(btn);
            this.tagList.appendChild(li);
        });
    }

    toggleRightSidebar(show = true) {
        const sidebar = this.rightSidebar;

        if (show) {
            sidebar.classList.add('active');
        } else {
            sidebar.classList.remove('active');
        }
    }
}
