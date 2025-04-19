export default class User {
    static idCounter = 0;

    constructor(firstName, lastName) {
        this.id = ++User.idCounter;
        this.firstName = firstName;
        this.lastName = lastName;
    }

    getFullName() {
        return `${this.firstName} ${this.lastName}`;
    }
}
