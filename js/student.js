import { User } from './user.js';
export class Student extends User {
    constructor(name, username, enrolledCourses, finishedCourses, gpa,grades,prevGrades) {
        super(name, username, 'student');
        this.enrolledCourses = enrolledCourses || [];
        this.finishedCourses = finishedCourses || [];
        this.gpa = gpa?? 0;
        this.enrolledCoursesGrades = grades?? {};
        this.finishedCoursesGrades = prevGrades?? {};
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
    getGrades(courseId) {
        courseId = courseId.toString();
        if(this.enrolledCoursesGrades[courseId] !== undefined) {
            return this.enrolledCoursesGrades[courseId];
        }else if(this.finishedCoursesGrades[courseId] !== undefined) {
            return this.finishedCoursesGrades[courseId];}
        return "-";    
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

    fromJSON(json) {
        this.name = json.name;
        this.username = json.username;
        this.enrolledCourses = json.enrolledCourses || [];
        this.finishedCourses = json.finishedCourses || [];
        this.gpa = json.gpa || 0;
        this.enrolledCoursesGrades = json.enrolledCoursesGrades || {};
        this.finishedCoursesGrades = json.finishedCoursesGrades || {};
        return this;
    }
    static fromJSON(json) {
        const course = new Student();
        return course.fromJSON(json);
    }
}
