class Student extends User {
    constructor(name, username, enrolledCourses = [], finishedCourses = [], registeredCourses = [], gpa = 0) {
        super(name, username, 'student');
        this.enrolledCourses = enrolledCourses; // array of course IDs
        this.finishedCourses = finishedCourses; // array of course IDs
        this.registeredCourses = registeredCourses; // FIXED: assign to this
        this.gpa = gpa;
    }

    registerCourse(courseId) {
        if (!this.registeredCourses.includes(courseId)) {
            this.registeredCourses.push(courseId);
            return true;
        }
        return false; // already registered
    }

    toJSON() {
        return {
            ...super.toJSON(),
            enrolledCourses: this.enrolledCourses,
            finishedCourses: this.finishedCourses,
            registeredCourses: this.registeredCourses,
            gpa: this.gpa
        };
    }

    static fromJSON(json) {
        return new Student(
            json.id,
            json.name,
            json.email,
            json.enrolledCourses || [],
            json.finishedCourses || [],
            json.registeredCourses || [],
            json.gpa || 0
        );
    }
}
