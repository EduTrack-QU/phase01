class Admin extends User {
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

    valideteCourse(courseObject) {
      // validate course object
      // check if the course ID is unique
      // check if the instructor ID exists in instructors.json
      // check if the prerequisites are valid
      // check if the course is available
    }
    assignInstructor(courseId, instructorId) {
      // check if the instructor ID exists in instructors.json
      // check if the course ID exists in courses.json
      // assign the instructor to the course
    }
  
    toJSON() {
      return super.toJSON();
    }
  }
  