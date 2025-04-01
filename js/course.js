import { nanoid } from 'nanoid';
class Course {
    constructor(code,title, creditHour,description, instructorId, available) {
        this.code=code?? nanoid(6);
        this.title = title;
        this.creditHour = creditHour; // number of credit hours
        this.description = description;
        this.instructorId = instructorId; // instructor ID
        this.available = available ?? false;
        this.prerequisites = []; // array of course IDs
    }

    fromJSON(json) {
        this.code = json.code;
        this.title = json.title;
        this.creditHour = json.creditHour;
        this.description = json.description;
        this.instructorId = json.instructorId;
        this.available = json.available;
        this.prerequisites = json.prerequisites || [];
    }
    
}