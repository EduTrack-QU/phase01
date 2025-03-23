class User {
    constructor(id, name, email, role) {
      this.id = id;
      this.name = name;
      this.email = email;
      this.role = role; // 'student', 'instructor', or 'admin'
    }
  
    toJSON() {
      return {
        id: this.id,
        name: this.name,
        email: this.email,
        role: this.role
      };
    }
  }
  