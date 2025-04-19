// main.js
import Model from './model.js';
import View from './view.js';
import Controller from './controller.js';

const appModel = new Model();
const appView = new View();
const appController = new Controller(appModel, appView);
