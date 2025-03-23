class Course {

    constructor(id, title, description, instructorId, available) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.instructorId = instructorId; // instructor ID
        this.available = available ?? false;
        this.prerequisites = []; // array of course IDs
    }
}