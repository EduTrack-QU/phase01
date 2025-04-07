export class User {
    constructor(name, username, role) {
      this.name = name;
      this.username = username;
      this.role = role; // 'student', 'instructor', or 'admin'
    }
  
    toJSON() {
      return {
        id: this.id,
        name: this.name,
        username: this.username,
        role: this.role
      };
    }
    static fromJSON(json) {
      this.name = json.name;
      this.username = json.username;
      this.role = json.role;
      return this;
    }
  }
  