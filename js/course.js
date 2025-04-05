import { nanoid } from '../node_modules/nanoid/nanoid.js';

export class Course {
    constructor(code, title, creditHour, description, instructorId, available) {
        this.id = nanoid(8);
        this.code = code
        this.title = title;
        this.creditHour = creditHour; // number of credit hours
        this.description = description;
        this.instructorId = instructorId || ""; // instructor ID
        this.available = available ?? false;
        this.prerequisites = []; // array of course IDs
        this.time = {
            days: [],
            time: ""
        };
        this.status = "pending"; // pending, validated, cancelled
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