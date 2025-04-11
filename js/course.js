import { nanoid } from '../node_modules/nanoid/nanoid.js';

export class Course {
    constructor(code, title, creditHour, description, instructorId, available) {
        this.id = Math.floor(Math.random() * 1000000); // Generate 8-digit number
        this.code = code || nanoid(6); // Changed from nullish coalescing to logical OR for better compatibility
        this.title = title || "";
        this.creditHour = creditHour || 0; // Default to 0 if not provided
        this.description = description || "";
        this.instructorId = instructorId || ""; // instructor ID
        this.available = available !== undefined ? available : false; // More explicit check for boolean
        this.prerequisites = []; // array of course IDs
        this.time = {
            days: [],
            time: ""
        };
        this.status = "pending"; // pending, validated, cancelled
    }

   
    
    static deleteCourse(courseId, courses) {
        if (!confirm('Are you sure you want to delete this course?')) {
            return null;
        }
        
        // Filter out the course to delete
        return courses.filter(c => c.id != courseId);
    }
    
    static createOrUpdateCourse(formData, courses, courseId = null) {
        const { code, title, creditHour, description, prerequisites, days, time } = formData;
        
        // Validate form data
        if (!code || !title || !creditHour || !description || !time || days.length === 0) {
            alert('Please fill in all required fields');
            return null;
        }
        
        if (courseId) {
            // Update existing course
            const index = courses.findIndex(c => c.id == courseId);
            if (index !== -1) {
                courses[index] = {
                    ...courses[index],
                    code,
                    title,
                    creditHour,
                    description,
                    prerequisites,
                    time: {
                        days,
                        time
                    }
                };
                return courses;
            }
        } else {
            // Create new course
            const newCourse = new Course(
                code,
                title,
                creditHour,
                description,
                '', // instructorId (empty for now)
                false // available (false until validated)
            );
            
            newCourse.prerequisites = prerequisites;
            newCourse.time = {
                days,
                time
            };
            
            // Add to courses array
            courses.push(newCourse.toJSON());
            return courses;
        }
        
        return null;
    }
    
    static getCoursesForDisplay(courses) {
        if (!courses || !Array.isArray(courses)) {
            return []; // Return empty array if courses is not valid
        }
        
        return courses.map(course => {
            // Handle potential undefined values more safely
            const days = course.time && course.time.days ? course.time.days.join('/') : '-';
            const time = course.time && course.time.time ? course.time.time : '-';
            const daysTime = `${days}<br>${time}`;
            
            // Make sure status is a string before using it in class names
            const status = (course.status || 'pending').toString();
            const statusClass = `status-${status}`;
            
            return {
                id: course.id || '',
                code: course.code || '',
                title: course.title || '',
                daysTime,
                statusClass,
                status: Course.capitalizeFirstLetter(status)
            };
        });
    }
    
    static capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    fromJSON(json) {
        this.id = json.id || nanoid(8);
        this.code = json.code;
        this.title = json.title;
        this.creditHour = json.creditHour;
        this.description = json.description;
        this.instructorId = json.instructorId || "";
        this.available = json.available;
        this.prerequisites = json.prerequisites || [];
        this.time = json.time || { days: [], time: "" };
        this.status = json.status || "pending";
        return this;
    }
    
    toJSON() {
        return {
            id: this.id,
            code: this.code,
            title: this.title,
            creditHour: this.creditHour,
            description: this.description,
            instructorId: this.instructorId,
            available: this.available,
            prerequisites: this.prerequisites,
            time: this.time,
            status: this.status
        };
    }
    
    static fromJSON(json) {
        const course = new Course();
        return course.fromJSON(json);
    }
}