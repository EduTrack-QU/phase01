class Course {

    constructor(code,title, creditHour,description, instructorId, available) {
        this.code=code;
        this.title = title;
        this.creditHour = creditHour; // number of credit hours
        this.description = description;
        this.instructorId = instructorId; // instructor ID
        this.available = available ?? false;
        this.prerequisites = []; // array of course IDs
    }
    
}