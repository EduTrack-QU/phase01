import { User } from './user.js';

export class Student extends User {
    constructor(name, username, enrolledCourses, finishedCourses, gpa,grades) {
        super(name, username, 'student');
        this.enrolledCourses = enrolledCourses || [];
        this.finishedCourses = finishedCourses || [];
        this.gpa = gpa?? 0;
        this.enrolledCoursesGrades = grades?? {};

    }


    registerCourse(courseId) {
        courseId = courseId.toString();
        if (!this.isRegisteredFor(courseId) && !this.hasFinished(courseId)) {
            this.enrolledCourses.push(courseId);
            return true;
        }
        return false;
    }
    
    isRegisteredFor(courseId) {
        return this.enrolledCourses.map(id => id.toString()).includes(courseId.toString());
    }
    
    hasFinished(courseId) {
        return this.finishedCourses.map(id => id.toString()).includes(courseId.toString());
    }
    
    unregisterCourse(courseId) {
        courseId = courseId.toString();
        const index = this.enrolledCourses.map(id => id.toString()).indexOf(courseId);
        if (index !== -1) {
            this.enrolledCourses.splice(index, 1);
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


    setGrades(courseId, grade) {
        courseId = courseId.toString();
        if (this.isRegisteredFor(courseId)) {
            this.enrolledCoursesGrades[courseId] = grade;
            return true;
        }
        return false;
    }
    
    toString() {
        return `Student: ${this.name}, Username: ${this.username}, Enrolled Courses: ${this.enrolledCourses.join(', ')}, Finished Courses: ${this.finishedCourses.join(', ')}, GPA: ${this.gpa}`;
    }

    toJSON() {
        return {
            ...super.toJSON(),
            enrolledCourses: this.enrolledCourses,
            finishedCourses: this.finishedCourses,
            gpa: this.gpa
        };
    }




    static fromJSON(json) {
        return new Student(
            json.name,
            json.username,
            json.enrolledCourses || [],
            json.finishedCourses || [],

            json.gpa || 0
        );
    }
}
