import { User } from './user.js';

export class Admin extends User {
    constructor(name, username) {
      super(name, username, 'admin');
    }
  
    createUser(userObject) {
      // push to users.json
    }
  
    deleteUser(userId) {
      // remove from users.json
    }
  
    createCourse(courseObject) {
      // push to courses.json
    }
  
    deleteCourse(courseId) {
      // remove from courses.json
    }
  
    toJSON() {
      return super.toJSON();
    }
  }
  