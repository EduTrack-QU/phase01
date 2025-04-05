import { Student } from './student.js';
import { Admin } from './admin.js';
import { Instructor } from './instructor.js';

const navConfig = {
    student: [
        { icon: 'browse.svg', alt: 'browse courses icon', text: 'Browse Courses', url: 'browse_courses.html' },
        { icon: 'register.svg', alt: 'register courses icon', text: 'Register Courses', id: 'registrationBtn', action: true },
        { icon: 'view.svg', alt: 'view learning path icon', text: 'View Learning Path', url: 'learning_path.html' }
    ],
    admin: [
        { icon: 'create.svg', alt: 'create icon', text: 'Create Courses', url: 'create.html' },
        { icon: 'validate.svg', alt: 'validate icon', text: 'Validate Courses', url: 'validate.html' },
        { icon: 'assign.svg', alt: 'assign icon', text: 'Assign Instructors', url: 'assign.html' },
        { icon: 'calendar.svg', alt: 'Schedule icon', text: 'View Schedule', url: 'view_schedule.html' }
    ],
    instructor: [
        { icon: 'submit.svg', alt: 'submit grades icon', text: 'Submit Grades', url: 'grades_submission.html' },
        { icon: 'view.svg', alt: 'view icon', text: 'Choose Courses', url: 'choose_courses.html' }
    ]
};

const welcomeTemplates = {
    student: (name) => `Welcome, ${name}!`,
    instructor: (name) => `Welcome, Professor ${name}!`,
    admin: (name) => `Welcome, Administrator ${name}!`
};


let currentUser = null;
let courses = [];

window.addEventListener('DOMContentLoaded', () => {
    currentUser = loadCurrentUserFromStorage();

    const page = window.location.pathname;
    if (page.includes('login.html')) {
        initLoginPage();
    } else if (page.includes('dashboard.html')) {
        initDashboard();
    } else if (page.includes('registration.html')) {
        initRegistrationPage();
    }else if (page.includes('grades_submission.html')) {
        instructorGradesSubmission();
    }
    else if (page.includes('browse_courses.html')) {
        initBrowsePage();
    }
    else if (page.includes('view_schedule.html')){
        initViewSchedulePage();
    }
    else if (page.includes('assign.html')) {
        initAssignPage();
    }

});

function initDashboard() {
    currentUser = loadCurrentUserFromStorage();
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }

    const role = currentUser.role.toLowerCase();

    const welcomeMsg = document.getElementById('welcomeMsg');
    if (welcomeMsg && welcomeTemplates[role]) {
        welcomeMsg.innerText = welcomeTemplates[role](currentUser.name);
    }

    loadNavigation(role);
}

function loadNavigation(role) {
    const nav = document.getElementById('nav');
    if (!nav || !navConfig[role]) return;

    const items = navConfig[role];
    let navHTML = '';

    items.forEach(item => {
        let buttonContent;

        if (item.action) {
            buttonContent = `<button id="${item.id}">${item.text}</button>`;
        } else {
            buttonContent = `<button><a href="${item.url}">${item.text}</a></button>`;
        }

        navHTML += `
        <div class="nav-item">
            <img class="inline-icon" src="media/${item.icon}" alt="${item.alt}">
            ${buttonContent}
        </div>`;
    });

    nav.innerHTML = navHTML;

    const registrationBtn = document.getElementById('registrationBtn');
    if (registrationBtn) {
        registrationBtn.addEventListener('click', () => {
            window.location.href = 'registration.html';
        });
    }
}

function createUserInstance(userData) {
    switch (userData.role.toLowerCase()) {
        case 'student':
            return new Student(
                userData.name, 
                userData.username,
                userData.enrolledCourses,
                userData.finishedCourses,
                userData.registeredCourses,
                userData.gpa
            );
        case 'instructor':
            return new Instructor(userData.name, userData.username,userData.teachingCourses, userData.preferedCourses);
        case 'admin':
            return new Admin(userData.name, userData.username);  
        default:
            return null;
    }
}

function loadCurrentUserFromStorage() {
    const userJSON = localStorage.getItem('currentUser');
    if (!userJSON) return null;

    const userData = JSON.parse(userJSON);
    return createUserInstance(userData);
}

function saveCurrentUserToStorage(user) {
    if (!user) return;
    localStorage.setItem('currentUser', JSON.stringify(user));
    
    // The following will break the code
    // fs.readFile('json/users.json', 'utf8', (err, data) => {
    //     if (err) {
    //         console.error('Error reading users file:', err);
    //         return;
    //     }
    //     const users = JSON.parse(data);
    //     const userIndex = users.findIndex(u => u.username === user.username);
    //     if (userIndex !== -1) {
    //         users[userIndex] = user;
    //     } else {
    //         users.push(user);
    //     }
    //     fs.writeFile('json/users.json', JSON.stringify(users, null, 2), err => {
    //         if (err) {
    //             console.error('Error writing users file:', err);
    //         }
    //     });
    // });
}

function initLoginPage() {
    const loginForm = document.querySelector('form');
    if (!loginForm) return;

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.querySelector('input[name="username"]').value;
        const password = document.querySelector('input[name="password"]').value;

        try {
            const response = await fetch('../json/users.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const users = await response.json();
            const userData = users.find(u =>
                u.username === username && u.password === password
            );

            if (userData) {
                currentUser = createUserInstance(userData);
                saveCurrentUserToStorage(currentUser);
                window.location.href = 'dashboard.html';
            } else {
                alert('Invalid username or password');
            }
        } catch (error) {
            console.error('Login error:', error);
            alert('An error occurred during login. Please try again later.');
        }
    });
}

async function initRegistrationPage() {
    currentUser = loadCurrentUserFromStorage();

    if (!currentUser || currentUser.role.toLowerCase() !== 'student') {
        window.location.href = 'login.html';
        return;
    }
    
    const coursesContainer = document.getElementById('courses-container');
    const response = await fetch('../json/courses.json');
    const coursesData = await response.json();
    const student = Student.fromJSON(currentUser);

    const availableCourses = student.getAvailableCourses(coursesData);

    coursesContainer.innerHTML = '';
    
    if (availableCourses.length === 0) {
        coursesContainer.innerHTML = '<p class="no-courses">No courses available for registration.</p>';
        return;
    }
 
    availableCourses.forEach(course => {
        const courseName = `${course.code}: ${course.title}`;
        const schedule = `${course.time.days.join('/')} ${course.time.time}`;
        
        const courseDiv = document.createElement('div');
        courseDiv.classList.add('course-card');
        courseDiv.setAttribute('data-course-id', course.id);
        courseDiv.innerHTML = `
            <h3>${courseName}</h3>
            <p><strong>Instructor:</strong> ${course.instructorId || 'TBA'}</p>
            <p><strong>Schedule:</strong> ${schedule}</p>
            <p><strong>Credits:</strong> ${course.creditHour}</p>
            <div class="course-action-buttons">
                <button class="register-btn" data-course-id="${course.id}">Register</button>
                <button class="remove-btn btn-disabled" data-course-id="${course.id}">Remove</button>
            </div>
        `;
        
        coursesContainer.appendChild(courseDiv);
    });

    const registerButtons = document.querySelectorAll('.register-btn');
    registerButtons.forEach(button => {
        button.addEventListener('click', function() {
            const courseId = this.getAttribute('data-course-id');
            const courseCard = document.querySelector(`.course-card[data-course-id="${courseId}"]`);
            
            if (this.textContent === 'Register') {
                this.textContent = 'Registered';
                this.classList.add('registered');
                
                const removeBtn = courseCard.querySelector('.remove-btn');
                removeBtn.classList.remove('btn-disabled');
            } else {
                this.textContent = 'Register';
                this.classList.remove('registered');
                
                const removeBtn = courseCard.querySelector('.remove-btn');
                removeBtn.classList.add('btn-disabled');
            }
        });
    });
    
    const removeButtons = document.querySelectorAll('.remove-btn');
    removeButtons.forEach(button => {
        button.addEventListener('click', function() {
            if (this.classList.contains('btn-disabled')) return;
            
            const courseId = this.getAttribute('data-course-id');
            const courseCard = document.querySelector(`.course-card[data-course-id="${courseId}"]`);
            
            const registerBtn = courseCard.querySelector('.register-btn');
            registerBtn.textContent = 'Register';
            registerBtn.classList.remove('registered');
            
            this.classList.add('btn-disabled');
        });
    });
    
    const confirmButton = document.getElementById('confirm-registration');
    confirmButton.addEventListener('click', function() {
        const registeredButtons = document.querySelectorAll('.register-btn.registered');
        const newRegisteredCourses = Array.from(registeredButtons).map(button => 
            button.getAttribute('data-course-id')
        );
        
        const registeredCount = student.registerCourses(newRegisteredCourses);
        
        if (registeredCount > 0) {
            saveCurrentUserToStorage(student);
            
            alert(`Successfully registered for ${registeredCount} course(s).`);
            window.location.href = 'dashboard.html';
        } else {
            alert('No courses selected for registration.');
        }
    });
}


async function initBrowsePage() {
    currentUser = loadCurrentUserFromStorage();

    if (!currentUser || currentUser.role.toLowerCase() !== 'student') {
        window.location.href = 'login.html';
        return;
    }
    
    const coursesContainer = document.getElementById('courses-container');
    const response = await fetch('../json/courses.json');
    const coursesData = await response.json();
    const student = Student.fromJSON(currentUser);

    const availableCourses = student.getAvailableCourses(coursesData);

    coursesContainer.innerHTML = '';
    
    if (availableCourses.length === 0) {
        coursesContainer.innerHTML = '<p class="no-courses">No courses available for registration.</p>';
        return;
    }
 
    availableCourses.forEach(course => {
        const courseName = `${course.code}: ${course.title}`;
        const schedule = `${course.time.days.join('/')} ${course.time.time}`;
        
        const courseDiv = document.createElement('div');
        courseDiv.classList.add('course-card');
        courseDiv.setAttribute('data-course-id', course.id);
        courseDiv.innerHTML = `
            <h3>${courseName}</h3>
            <p><strong>Instructor:</strong> ${course.instructorId || 'TBA'}</p>
            <p><strong>Schedule:</strong> ${schedule}</p>
            <p><strong>Credits:</strong> ${course.creditHour}</p>
        `;
        
        coursesContainer.appendChild(courseDiv);
    });
}
//use vase for instructor grades submission
async function initViewSchedulePage() {
    currentUser = loadCurrentUserFromStorage();
    const scheduleTable = document.getElementById('schedule-table');

    if (!currentUser || currentUser.role.toLowerCase() !== 'admin') {
        scheduleTable.innerHTML = '<tr><td>You do not have permission to view this page.</td></tr>';
        return;
    }

    const courseRes = await fetch('json/courses.json');
    const userRes = await fetch('json/users.json');
    const allCourses = await courseRes.json();
    const users = await userRes.json();

    const instructors = users.filter(u => u.role === 'instructor');
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'];

    // Build table header
    const thead = document.createElement('thead');
    const headRow = document.createElement('tr');
    const firstTh = document.createElement('th');
    firstTh.textContent = 'Instructors';
    headRow.appendChild(firstTh);

    days.forEach(day => {
        const th = document.createElement('th');
        th.textContent = day;
        headRow.appendChild(th);
    });

    thead.appendChild(headRow);
    scheduleTable.appendChild(thead);

    // Build table body
    const tbody = document.createElement('tbody');

    instructors.forEach((instructor, index) => {
        const row = document.createElement('tr');

        const nameCell = document.createElement('td');
        nameCell.textContent = instructor.name || `Instructor#${index + 1}`;
        row.appendChild(nameCell);

        days.forEach(day => {
            const cell = document.createElement('td');
            const coursesToday = allCourses.filter(course =>
                course.instructorId === instructor.username &&
                course.time?.days?.includes(day)
            );

            cell.innerHTML = coursesToday.length > 0
                ? coursesToday.map(c => `${c.code}<br><small>${c.time.time}</small>`).join('<br>')
                : '-';
            row.appendChild(cell);
        });

        tbody.appendChild(row);
    });

    scheduleTable.appendChild(tbody);
}

async function instructorGradesSubmission() {
    currentUser = loadCurrentUserFromStorage();

    if (!currentUser || currentUser.role.toLowerCase() !== 'instructor') {
        window.location.href = 'login.html';
        return;
    }

    const courses_list = document.querySelector('.course-list');
    const instructor = Instructor.fromJSON(currentUser);
    const coursesData = instructor.teachingCourses;    

    let gradedcourses= localStorage.graded ? JSON.parse(localStorage.getItem('graded')) : []; 
    // let courses = [];
    let students = localStorage.students ? JSON.parse(localStorage.getItem('students')) : [];
    
    const cHTML = coursesData.map(c => convertToHtml(c)).join('');
    courses_list.innerHTML = cHTML;
    
    
   window.handleDetails= async function (cid){
        if(gradedcourses.includes(cid)){
            alert("This course hvae been already graded");
            return;
        }
        const studentDiv = document.getElementById(`students-${cid}`);
        studentDiv.classList.remove('hidden');
        let studentsEnrolled = [];
        const response = await fetch('../json/users.json');
        const users = await response.json();
        for (let user of users) {
            if (user.role === 'student' ) {
                if(user.enrolledCourses.includes(cid)){
                    studentsEnrolled.push(user);}
            }
        }   
        const course_ = coursesData.find(c => c.course_code === cid);
        if (!course_ || !studentsEnrolled) {
            studentDiv.innerHTML = "<p>No students enrolled.</p>";
            return;
        }
        students=studentsEnrolled;
        const stuHTML = studentsEnrolled.map(s => converStutToHtml(s)).join('');
        studentDiv.innerHTML = `
        <h4>Grading Form</h4>
        <form onsubmit="submitGrades(event, '${cid}')">
            <ul id="ulist">
                ${stuHTML}
            </ul>
            <button type="submit" class="submit-btn">Submit</button>
            <button type="button" class="back-btn" onclick="document.getElementById('students-${cid}').classList.add('hidden')">Back</button>
        </form>`;
    }
    window.submitGrades = async function (event, cid) {
        event.preventDefault();
        const form = event.target;
        const studentGrades = Array.from(form.querySelectorAll('select')).map(select => {
            return { studentName: select.name, grade: select.value };
        });
        alert(`Grades submitted for course ${cid}: ${JSON.stringify(studentGrades)}`);
        for (let i = 0; i < students.length; i++) {
            const student = createUserInstance(students[i]);
            const grade = studentGrades[i].grade;
            student.setGrades(cid, grade);
        }


        // Save the grades to local storage or send them to the server
        gradedcourses.push(cid);
        localStorage.setItem('graded', JSON.stringify(gradedcourses));
        alert(`Grades for course ${cid} have been submitted.`);
    };  


   

}

function converStutToHtml(s){
    return `
    <li id="lig">
        ${s.name}
        <select name="grade-${s.name}" id="selectgrade">
            <option value="A">A</option>
            <option value="A+">A+</option>
            <option value="B">B</option>
            <option value="B+">B+</option>
            <option value="C">C</option>
            <option value="C+">C+</option>
            <option value="D">D</option>
            <option value="D+">D+</option>
            <option value="F">F</option>
        </select>
    </li>
`;
}


function convertToHtml(course) {
    return `
        <div class="course-item">
            <button class="course-btn" onclick="handleDetails('${course.course_code}')">
                ${course.course_code}${" "} ${course.course_name}
                <span class="details-btn">View students list</span>
            </button>
            <div id="students-${course.course_code}"></div>
        </div>
    `;
}


async function initAssignPage() {
    currentUser = loadCurrentUserFromStorage();

    if (!currentUser || currentUser.role.toLowerCase() !== 'admin') {
        window.location.href = 'login.html';
        return;
    }
    try {
        const coursesResponse = await fetch('../json/courses.json');
        const usersResponse = await fetch('../json/users.json');
        
        if (!coursesResponse.ok || !usersResponse.ok) {
            throw new Error('Failed to fetch data');
        }
        
        const courses = await coursesResponse.json();
        const users = await usersResponse.json();
        
        // Filter instructors from users
        const instructors = users.filter(user => user.role === "instructor");
        
        // Process data to get course preferences
        const coursePreferences = {};
        
        // Initialize coursePreferences with only available courses
        courses.forEach(course => {
            if (course.available === true) {
                coursePreferences[course.id] = {
                    course: course,
                    interestedInstructors: []
                };
            }
        });
        
        // Add instructor preferences to courses based on prefereredCourses array
        instructors.forEach(instructor => {
            if (instructor.prefereredCourses && Array.isArray(instructor.prefereredCourses)) {
                instructor.prefereredCourses.forEach(courseId => {
                    if (coursePreferences[courseId]) {
                        coursePreferences[courseId].interestedInstructors.push({
                            name: instructor.name,
                            username: instructor.username
                        });
                    }
                });
            }
        });
        
        // Populate the table
        const tableBody = document.getElementById('courses-table-body');
        
        Object.values(coursePreferences).forEach(coursePref => {
            const course = coursePref.course;
            const row = document.createElement('tr');
            
            // Course name cell with schedule information
            const nameCell = document.createElement('td');
            const schedule = `${course.time.days.join('/')} ${course.time.time}`;
            nameCell.innerHTML = `<strong>${course.code}: ${course.title}</strong><br><small>${schedule}</small>`;
            row.appendChild(nameCell);
            
            // Interested instructors cell
            const interestedCell = document.createElement('td');
            if (coursePref.interestedInstructors.length > 0) {
                interestedCell.textContent = coursePref.interestedInstructors
                    .map(inst => inst.name)
                    .join(', ');
            } else {
                interestedCell.textContent = 'No preferences';
            }
            row.appendChild(interestedCell);
            
            // Assigned instructor dropdown cell
            const assignedCell = document.createElement('td');
            const selectElement = document.createElement('select');
            selectElement.className = 'instructor-select';
            selectElement.dataset.courseId = course.id;
            
            // Add empty option
            const emptyOption = document.createElement('option');
            emptyOption.value = '';
            emptyOption.textContent = 'Select instructor';
            selectElement.appendChild(emptyOption);
            
            // Add all instructors as options
            instructors.forEach(instructor => {
                const option = document.createElement('option');
                option.value = instructor.username;
                option.textContent = instructor.name;
                
                // If this instructor is interested, highlight them
                const isInterested = coursePref.interestedInstructors.some(
                    inst => inst.username === instructor.username
                );
                
                if (isInterested) {
                    option.className = 'interested-instructor';
                }
                
                // If this course is already in the instructor's teachingCourses, select it
                if (instructor.teachingCourses && 
                    Array.isArray(instructor.teachingCourses) && 
                    instructor.teachingCourses.includes(course.id)) {
                    option.selected = true;
                }
                
                selectElement.appendChild(option);
            });
            
            assignedCell.appendChild(selectElement);
            row.appendChild(assignedCell);
            
            tableBody.appendChild(row);
        });
        
        //button to save
        
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('courses-table-body').innerHTML = 
            '<tr><td colspan="3">Failed to load data. Please try again later.</td></tr>';
    }
}