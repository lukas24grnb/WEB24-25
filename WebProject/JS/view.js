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
    }

    renderListen(lists) {
        this.listenContainer.innerHTML = '';
        lists.forEach(list => {
            const li = document.createElement('li');
            li.className = 'list-group-item d-flex justify-content-between align-items-center';
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
      <div class="d-flex justify-content-between align-items-center">
        <h2>${list.title}</h2>
        <button class="btn btn-outline-success" id="artikel-hinzufuegen-btn">
          <i class="bi bi-plus-circle"></i> Artikel hinzufügen
        </button>
      </div>
      <ul class="list-group mt-3">
        ${list.items.map(item => `<li class="list-group-item">${item.quantity} ${item.name}</li>`).join('')}
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
