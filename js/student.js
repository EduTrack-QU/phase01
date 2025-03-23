class Student extends User {
    constructor(id, name, email, enrolledCourses, finishedCourses,registeredCourses, gpa) {
        super(id, name, email, 'student');
        this.enrolledCourses = enrolledCourses; // array of course IDs
        this.finishedCourses = finishedCourses; // array of course IDs
        this.gpa = gpa || 0; // GPA
        registeredCourses = registeredCourses || []; // array of course IDs
    }



    toJSON() {
        return {
            ...super.toJSON(),
            enrolledCourses: this.enrolledCourses
        };
    }
}
