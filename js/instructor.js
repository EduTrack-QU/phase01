class Instructor extends User {
    constructor(id, name, email, teachingCourses) {
      super(id, name, email, 'instructor');
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
  