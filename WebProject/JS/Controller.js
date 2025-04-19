// controller.js
import Model from './model.js';
import View from './view.js';
import User from './Klassen/User.js'; // Falls du einen Testuser benötigst

export default class Controller {
    constructor(model, view) {
        this.model = model;
        this.view = view;

        // Beispiel: Registriere ein Observer, um die View zu aktualisieren, wenn das Model sich ändert
        this.model.subscribe((event) => {
            if (event.type === 'list-created') {
                this.view.renderListen(this.model.lists);
            }
        });

        // Event Listener für den Button, um eine neue Liste zu erstellen
        this.view.addListButton.addEventListener('click', () => {
            const title = prompt("Bitte gib den Titel der neuen Liste ein:");
            if (title !== "") {
                const dummyUser = new User('Max', 'Mustermann');
                this.model.createList(title, dummyUser);
            } else {
                alert("Es wurde kein Titel eingegeben!");
            }
        });
    }
}
