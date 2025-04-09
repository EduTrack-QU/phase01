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


    registerCourse(courseId, allCourses) {
        courseId = courseId.toString();
        if (this.isRegisteredFor(courseId) || this.hasFinished(courseId)) {
            return false;
        }
        
        const course = allCourses.find(c => c.id.toString() === courseId);
        if (!course) return false;
        
        const alreadyTakingCode = this.isRegisteredForCourseCode(course.code, allCourses);
        const alreadyFinishedCode = this.hasFinishedCourseCode(course.code, allCourses);
        
        if (alreadyTakingCode || alreadyFinishedCode) {
            return false;
        }
        
        this.enrolledCourses.push(parseInt(courseId));
        return true;
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
    
    registerCourses(courseIds, allCourses) {
        let count = 0;
        for (const courseId of courseIds) {
            if (this.registerCourse(courseId, allCourses)) {
                count++;
            }
        }
        return count;
    }
    
    getAvailableCourses(allCourses) {
        const registeredCodes = new Set();
        const finishedCodes = new Set();
        
        this.enrolledCourses.forEach(enrolledId => {
            const course = allCourses.find(c => c.id.toString() === enrolledId.toString());
            if (course) registeredCodes.add(course.code);
        });
        
        this.finishedCourses.forEach(finishedId => {
            const course = allCourses.find(c => c.id.toString() === finishedId.toString());
            if (course) finishedCodes.add(course.code);
        });
        
        console.log("Registered course codes:", Array.from(registeredCodes));
        console.log("Finished course codes:", Array.from(finishedCodes));
        
        return allCourses.filter(course => {
            const isAvailable = course.available;
            const notRegistered = !registeredCodes.has(course.code);
            const notFinished = !finishedCodes.has(course.code);
            
            console.log(`Course ${course.code} - Available: ${isAvailable}, Not Registered: ${notRegistered}, Not Finished: ${notFinished}`);
            
            return isAvailable && notRegistered && notFinished;
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
            gpa: this.gpa,
            enrolledCoursesGrades: this.enrolledCoursesGrades,
            finishedCoursesGrades: this.finishedCoursesGrades
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
        const student = new Student();
        return student.fromJSON(json);
    }

    isRegisteredForCourseCode(courseCode, allCourses) {
        return this.enrolledCourses.some(enrolledId => {
            const course = allCourses.find(c => c.id.toString() === enrolledId.toString());
            return course && course.code === courseCode;
        });
    }

    hasFinishedCourseCode(courseCode, allCourses) {
        return this.finishedCourses.some(finishedId => {
            const course = allCourses.find(c => c.id.toString() === finishedId.toString());
            return course && course.code === courseCode;
        });
    }
}
