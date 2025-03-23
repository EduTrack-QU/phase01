class Instructor extends User {
    constructor(name, username, teachingCourses) {
      super(name, username, 'instructor');
      this.teachingCourses = teachingCourses || []; // array of course IDs
      this.preferedCourses = preferedCourses || []; // array of course IDs
    }
  

    addCoursePreference(courseId) {
        // if (!this.preferedCourses.includes(courseId)) {
        //     this.preferedCourses.push(courseId);
        // }
    }
  
    toJSON() {
      return {
        ...super.toJSON(),
        teachingCourses: this.teachingCourses
      };
    }
  }
  