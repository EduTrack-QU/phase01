import { User } from './user.js';

export class Admin extends User {
    constructor(name, username) {
      super(name, username, 'admin');
    }
  
    toJSON() {
      return super.toJSON();
    }
    static fromJSON(Json) {
      return new Admin(Json.name, Json.username);  
    }
  }
  