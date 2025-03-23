export class Student extends User {
    constructor(name, username, enrolledCourses, finishedCourses, registeredCourses, gpa) {
        super(name, username, 'student');
        this.enrolledCourses = enrolledCourses || [];
        this.finishedCourses = finishedCourses || [];
        this.registeredCourses = registeredCourses || [];
        this.gpa = gpa?? 0;
    }

    registerCourse(courseId) {
        if (!this.registeredCourses.includes(courseId) || !this.finishedCourses.includes(courseId)) {
            this.registeredCourses.push(courseId);
            return true;
        }
        return false;
        
    }
    toString() {
        return `Student: ${this.name}, Username: ${this.username}, Enrolled Courses: ${this.enrolledCourses.join(', ')}, Finished Courses: ${this.finishedCourses.join(', ')}, Registered Courses: ${this.registeredCourses.join(', ')}, GPA: ${this.gpa}`;
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
            json.name,
            json.username,
            json.enrolledCourses || [],
            json.finishedCourses || [],
            json.registeredCourses || [],
            json.gpa || 0
        );
    }
}
