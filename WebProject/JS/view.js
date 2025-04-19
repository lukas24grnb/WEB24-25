// view.js
export default class View {
    constructor() {
        // Beispiel: Hier holen wir uns das DOM-Element, wo die Listen angezeigt werden
        this.listenContainer = document.getElementById('listen-liste');
        // Beispiel: Ein Button, um eine neue Liste hinzuzufügen
        this.addListButton = document.getElementById('neue-liste-btn');
    }

    // Rendert alle Listen in der Sidebar
    renderListen(lists) {
        this.listenContainer.innerHTML = '';
        lists.forEach(list => {
            const listItem = document.createElement('li');
            listItem.className = 'list-group-item';
            listItem.textContent = list.title; // Titel der Liste
            this.listenContainer.appendChild(listItem);
        });
    }
}
