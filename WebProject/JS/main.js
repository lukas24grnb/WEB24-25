import Model from './model.js';
import View from './view.js';
import Controller from './controller.js';

const model = new Model();
const view = new View();

fetch('data.json')
    .then(res => res.json())
    .then(data => {
        console.log("JSON geladen:", data);

        model.loadInitialData(data);

        // Tags direkt ins Dropdown übernehmen
        view.renderTagOptions(model.getTags());

        const controller = new Controller(model, view);

        // Wenn Listen existieren, erste automatisch anzeigen
        if (model.lists.length > 0) {
            controller.activeList = model.lists[0];
            view.renderListen(model.lists);
            view.renderDetailView(controller.activeList);
            controller.setupAddItemButton();
            controller.setupItemEvents(controller.activeList);
            controller.setupListStatusButton(controller.activeList);
            controller.setupEditListTitleButton(controller.activeList);
        }
    })
    .catch(err => {
        console.error("Fehler beim Laden der JSON-Daten:", err);
    });
