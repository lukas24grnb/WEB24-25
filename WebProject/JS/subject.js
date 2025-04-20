// subject.js
export default class Subject {
    constructor() {
        this.observers = [];
    }

    subscribe(observerFn) {
        this.observers.push(observerFn);

    }

    unsubscribe(observerFn) {
        this.observers = this.observers.filter(fn => fn !== observerFn);
    }

    notify(data) {
        this.observers.forEach(fn => fn(data));
    }


}
