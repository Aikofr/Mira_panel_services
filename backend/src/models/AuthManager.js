const AbstractManager = require("./AbstractManager");

class AuthManager extends AbstractManager {
  constructor() {
    super({ table: "users" });
  }

  insert(user) {
    return this.database.query(
      `INSERT INTO ${this.table} (email, password) values (?, ?)`,
      [user.email, user.password]
    );
  }
}

module.exports = AuthManager;
