import { User } from './user.js';

export class Instructor extends User {
  constructor(name, username, teachingCourses, preferedCourses) {
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
      teachingCourses: this.teachingCourses,
      preferedCourses: this.preferedCourses
    };
  }

  fromJSON(json) {
    this.teachingCourses = json.teachingCourses || [];
    this.preferedCourses = json.preferedCourses || [];
    return this;
  }
  static fromJSON(json) {
    const instructor = new Instructor();
    return instructor.fromJSON(json);
}
}
