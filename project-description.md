# CMPS 350 Web Development Course Project Phase 1

## QU Student Management Application

### Weight of the project (phase 1):
- 10% of the course grade.

### Important Dates
- The project phase 1 submission is due by 12 AM Friday 22 March 2024.  
- Demos are during the same week.

## 1. Description of the project

The CSE department of Qatar University has tasked you with building a web application for the management of its students and courses. The following is a simplified description of the application needed:

### There are three types of users:
- **Students**: They have a name, ID, list of completed courses along with their grades.
- **Instructors**: They have a name and expertise areas.
- **Department Administrators**: They are responsible for creating courses and classes.

### The application has the following functionalities (i.e. use-cases):

#### Use Case 1: Login
- Allows users to log in using their username and password.
- Login should be verified using the users data in a JSON file (`users.json`).
- No registration functionality; accounts must be manually added to `users.json`.
- Once logged in, users will be redirected to the main page.

#### Use Case 2: Search and display available courses
- Students can search for available courses by name (e.g. JavaScript, OOP) or category (e.g. Databases, Programming).
- The main page displays all offered courses by default.
- Filtering should display only relevant courses.
- Courses should be stored in `courses.json`.

#### Use Case 3: Register in a course
- A student must be logged in to register for courses.
- The student can register only if they have passed all prerequisite courses and the course is open for registration.
- If the instructor has available spots, the student can register.
- The application should notify the student if registration is not possible.
- Registration is only finalized once approved by the administrator.

#### Use Case 4: View their learning path
- Students should be able to view:
  - Completed courses (with grades)
  - Ongoing courses
  - Pending courses (open registration, not started yet)

#### Use Case 5: Creating/validating courses and classes
- Administrators should see all courses that are in progress or open for registration.
- Display courses based on status and category.
- If multiple classes exist for a course, they should be displayed.
- Administrators can:
  - Validate courses/classes that have enough registrations.
  - Cancel courses/classes with insufficient registrations.
  - Create new courses/classes.

#### Use Case 6: Grades submission
- Instructors should be able to:
  - View their current classes.
  - Submit students’ final grades.
 
#### Use Case 7: Course-instructor assignments
- Classes are assigned to instructors as follows. The administrator should publish the list of courses to be open. The instructors should able to express their interests in courses. Once the deadline of submitting interests / preferences, the administrator should be able to select the instructors for the courses / classes to be open for registration.

#### Use Case 8: Courses schedule
- This functionality allows the administrator to display the schedule of the week for all the
courses / classes that are in progress.

---

## 2. Deliverables and Important Notes
- Seek clarifications during the initial progress meeting with the instructor.
- Define a project plan (task distribution, deadlines).
- Weekly discussions with the instructor for feedback.
- Follow programming styles and use covered techniques/libraries.

### Project Report Requirements
- **App Web UI and Navigation**:
  - Design intuitive navigation.
  - UI wireframes (e.g. via [Figma](https://www.figma.com)).
- **Implementation**:
  - UI and navigation using HTML, CSS, and JavaScript.
  - Responsive design (mobile & PC layouts).
- **Web API & Data Access**:
  - Read/write operations using JSON files.
- **Documentation**:
  - Application entities, repositories, and Web API class diagrams.
  - Testing results (screenshots).
  - Contribution of each team member.
- **Version Control**:
  - Push implementation and documentation to GitHub progressively.

---

## 3. Grading Rubric

### Criteria and Points Distribution
| Criteria | Points |
|----------|--------|
| Design and implement the app Web UI and navigation | 50 |
| Design and implement Web API & data repositories (JSON files) | 30 |
| Application modeling (UML diagrams) | 5 |
| Testing documentation (screenshots) | 5 |
| Teamwork and contributions | 5 |
| Project report | 5 |
| **Total** | 100 |

### Penalties
- **Plagiarism, outsourcing, or free-riding**: -100 points.
- **Late submission**: -5 points.

### Grading Criteria
- **100-85**: Fully functional app, all quality criteria met, excellent design.
- **85-80**: Functional app, most quality criteria met, good design.
- **80-75**: 80% of functionalities work, partially respects quality criteria, report misses some info.

### Code Quality Requirements
- Meaningful variable/function names.
- Responsive design.
- Clean, concise, non-redundant code.
- Proper indentation and formatting.
- Necessary comments.

Poor coding practices, naming, and redundant/unclean submission will result in point deductions.

---

**Important Remark**:
- Grades are non-negotiable.
- Only about 15% of students are expected to score 100-85.
- Hard work and well-demonstrated application merit are required to achieve top scores.
