
export default class UserModel {
    constructor(id, name, email, contact) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.contact = contact;
    }

    // Method to get all users
    static getAll() {
        return users;
    }

    // Method to add a new user
    static add(userObj) {
        const newUser = new UserModel(
            users.length + 1, // Generate an ID based on array length
            userObj.name,
            userObj.email,
            userObj.contact
        );
        users.push(newUser);
    }
}

// In-memory array to store users
const users = [
    new UserModel(1, 'John Doe', 'john@example.com', '1234567890'),
    new UserModel(2, 'Jane Smith', 'jane@example.com', '0987654321')
];
