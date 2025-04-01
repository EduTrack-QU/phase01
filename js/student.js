import { User } from './user.js';

export class Student extends User {
    constructor(name, username, enrolledCourses, finishedCourses, registeredCourses, gpa) {
        super(name, username, 'student');
        this.enrolledCourses = enrolledCourses || [];
        this.finishedCourses = finishedCourses || [];
        this.registeredCourses = registeredCourses || [];
        this.gpa = gpa?? 0;
    }

    registerCourse(courseId) {
        courseId = courseId.toString();
        if (!this.isRegisteredFor(courseId) && !this.hasFinished(courseId)) {
            this.registeredCourses.push(courseId);
            return true;
        }
        return false;
    }
    
    isRegisteredFor(courseId) {
        return this.registeredCourses.map(id => id.toString()).includes(courseId.toString());
    }
    
    hasFinished(courseId) {
        return this.finishedCourses.map(id => id.toString()).includes(courseId.toString());
    }
    
    unregisterCourse(courseId) {
        courseId = courseId.toString();
        const index = this.registeredCourses.map(id => id.toString()).indexOf(courseId);
        if (index !== -1) {
            this.registeredCourses.splice(index, 1);
            return true;
        }
        return false;
    }
    
    registerCourses(courseIds) {
        let count = 0;
        for (const courseId of courseIds) {
            if (this.registerCourse(courseId)) {
                count++;
            }
        }
        return count;
    }
    
    getAvailableCourses(allCourses) {
        return allCourses.filter(course => {
            const courseId = course.id.toString();
            return course.available && 
                   !this.isRegisteredFor(courseId) && 
                   !this.hasFinished(courseId);
        });
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
