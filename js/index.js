import { Student } from './student.js';
import { Admin } from './admin.js';
import { Instructor } from './instructor.js';
import { Course } from './course.js';
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
let users = [];

window.addEventListener('DOMContentLoaded', async () => {
    currentUser = loadCurrentUserFromStorage();
    
    const coursesData = await loadCourses();    
    coursesData.forEach((course) => {
        courses.push(Course.fromJSON(course));
    });
    const usersData = await loadUsers();
    usersData.forEach((user) => {
        users.push(createUserInstance(user));});
    console.log(courses)
    console.log(users)

    const page = window.location.pathname;
    if (page.includes('login.html')) {
        initLoginPage();
    } else if (page.includes('dashboard.html')) {
        initDashboard();
    } else if (page.includes('registration.html')) {
        initRegistrationPage();
    } else if (page.includes('grades_submission.html')) {
        instructorGradesSubmission();
    }
    else if (page.includes('browse_courses.html')) {
        initBrowsePage();
    }
    else if (page.includes('view_schedule.html')) {
        initViewSchedulePage();
    }
    else if (page.includes('choose_courses.html')) {
        initChooseCoursesPage();
    }
    else if (page.includes('assign.html')) {
        initAssignPage();
    }
    else if (page.includes('validate.html')) {
        initValidationPage();
    }
    else if (page.includes('create.html')) {
        initCreatePage();
    }
    else if (page.includes('learning_path.html')) {
        viewLearningPath();
    }

});

function initDashboard() {
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
            return Student.fromJSON(userData);
        case 'instructor':
            return Instructor.fromJSON(userData);
        case 'admin':
            return Admin.fromJSON(userData);
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

async function loadUsers() {
    const users = localStorage.getItem('users');
    if (users) {
        return JSON.parse(users);
    }
    else {
        const response = await fetch('../json/users.json');
        if (!response.ok) {
            throw new Error('Failed to fetch users data');
        }
        const users = await response.json();
        saveUsers(users);
        return users;
    }
}

function saveUsers(users) {
    const usersString = JSON.stringify(users, null, 2); // Pretty print with 2 spaces
    localStorage.setItem("users", usersString);

}

async function loadCourses() {
    const courses = localStorage.getItem('courses');
    if (courses) {
        return JSON.parse(courses);
    }
    else {
        const response = await fetch('../json/courses.json');
        if (!response.ok) {
            throw new Error('Failed to fetch course data');
        }
        const courses = await response.json();
        saveCourses(courses);
        return courses;
    }
}

function saveCourses(courses) {
    const coursesString = JSON.stringify(courses, null, 2); // Pretty print with 2 spaces
    localStorage.setItem("courses", coursesString);
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
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
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
    if (!currentUser || currentUser.role.toLowerCase() !== 'student') {
        window.location.href = 'login.html';
        return;
    }

    const coursesContainer = document.getElementById('courses-container');
    const student = users.find(u => u.username === currentUser.username);
    
    const availableCourses = student.getAvailableCourses(courses);
    const registeredCourseIds = student.enrolledCourses || [];
    
    const registeredCourses = courses.filter(course => 
        registeredCourseIds.includes(course.id) && 
        !availableCourses.some(ac => ac.id === course.id)
    );
    
    const allCoursesToShow = [...availableCourses, ...registeredCourses];

    coursesContainer.innerHTML = '';

    if (allCoursesToShow.length === 0) {
        coursesContainer.innerHTML = '<p class="no-courses">No courses available for registration.</p>';
        return;
    }

    function updateButtonStates(courseCard, isRegistered) {
        const registerBtn = courseCard.querySelector('.register-btn');
        const removeBtn = courseCard.querySelector('.remove-btn');
        
        registerBtn.textContent = isRegistered ? 'Registered' : 'Register';
        registerBtn.classList.toggle('registered', isRegistered);
        registerBtn.disabled = isRegistered;
        
        removeBtn.classList.toggle('btn-disabled', !isRegistered);
    }

    allCoursesToShow.forEach(course => {
        const courseName = `${course.code}: ${course.title}`;
        const schedule = `${course.time.days.join('/')} ${course.time.time}`;
        const isRegistered = registeredCourseIds.includes(course.id);

        const courseDiv = document.createElement('div');
        courseDiv.classList.add('course-card');
        courseDiv.setAttribute('data-course-id', course.id);
        courseDiv.innerHTML = `
            <h3>${courseName}</h3>
            <p><strong>Instructor:</strong> ${course.instructorId || 'TBA'}</p>
            <p><strong>Schedule:</strong> ${schedule}</p>
            <p><strong>Credits:</strong> ${course.creditHour}</p>
            <div class="course-action-buttons">
                <button class="register-btn ${isRegistered ? 'registered' : ''}" data-course-id="${course.id}" ${isRegistered ? 'disabled' : ''}>${isRegistered ? 'Registered' : 'Register'}</button>
                <button class="remove-btn ${isRegistered ? '' : 'btn-disabled'}" data-course-id="${course.id}">Remove</button>
            </div>
        `;

        coursesContainer.appendChild(courseDiv);
    });

    document.querySelectorAll('.register-btn').forEach(button => {
        button.addEventListener('click', function() {
            if (this.classList.contains('registered')) return;
            
            const courseId = this.getAttribute('data-course-id');
            const courseCard = document.querySelector(`.course-card[data-course-id="${courseId}"]`);
            updateButtonStates(courseCard, true);
        });
    });

    document.querySelectorAll('.remove-btn').forEach(button => {
        button.addEventListener('click', function() {
            if (this.classList.contains('btn-disabled')) return;

            const courseId = this.getAttribute('data-course-id');
            const courseCard = document.querySelector(`.course-card[data-course-id="${courseId}"]`);
            updateButtonStates(courseCard, false);
        });
    });

    const confirmButton = document.getElementById('confirm-registration');
    confirmButton.addEventListener('click', function() {
        const registeredButtons = document.querySelectorAll('.register-btn.registered');
        const newRegisteredCourses = Array.from(registeredButtons).map(button =>
            parseInt(button.getAttribute('data-course-id'))
        );
        
        const originalEnrolledCourses = [...student.enrolledCourses];
        
        const coursesToUnregister = originalEnrolledCourses.filter(
            courseId => !newRegisteredCourses.includes(courseId)
        );
        
        coursesToUnregister.forEach(courseId => {
            student.unregisterCourse(courseId);
        });
        
        const registeredCount = student.registerCourses(newRegisteredCourses);
        
        const totalChanges = registeredCount + coursesToUnregister.length;

        if (totalChanges > 0) {
            users = users.map(s => {
                if (s.username === currentUser.username) {
                   s = student;
                }
                return s;
            });
            saveUsers(users);

            let message = '';
            if (registeredCount > 0 && coursesToUnregister.length > 0) {
                message = `Successfully registered for ${registeredCount} course(s) and unregistered from ${coursesToUnregister.length} course(s).`;
            } else if (registeredCount > 0) {
                message = `Successfully registered for ${registeredCount} course(s).`;
            } else {
                message = `Successfully unregistered from ${coursesToUnregister.length} course(s).`;
            }
            
            alert(message);
            window.location.href = 'dashboard.html';
        } else {
            alert('No changes made to your course registrations.');
        }
    });
}
async function initChooseCoursesPage() {

    if (!currentUser || currentUser.role.toLowerCase() !== 'instructor') {
        window.location.href = 'login.html';
        return;
    }

    const coursesContainer = document.getElementById('courses-container');
    const response = await fetch('../json/courses.json');
    const courses = await response.json();

    const selectedCourses = new Set();

    coursesContainer.innerHTML = '';

    courses.forEach(course => {
        if (!course.available) return;

        const div = document.createElement('div');
        div.classList.add('course-card');
        div.setAttribute('data-id', course.id);
        div.innerHTML = `
            <h3>${course.code}: ${course.title}</h3>
            <p><strong>Schedule:</strong> ${course.time.days.join('/')} ${course.time.time}</p>
            <p><strong>Credits:</strong> ${course.creditHour}</p>
        `;

        div.addEventListener('click', () => {
            const cid = course.id;
            if (selectedCourses.has(cid)) {
                selectedCourses.delete(cid);
                div.classList.remove('selected');
            } else {
                selectedCourses.add(cid);
                div.classList.add('selected');
            }
        });

        coursesContainer.appendChild(div);
    });

    const submitButton = document.getElementById('submit-preferences');
    submitButton.addEventListener('click', () => {
        if (selectedCourses.size === 0) {
            alert("Please select at least one course.");
            return;
        }

        const instructor = Instructor.fromJSON(currentUser);
        const courseIds = Array.from(selectedCourses);

        // Save preferences to current user (session)
        instructor.preferedCourses = courseIds;
        saveCurrentUserToStorage(instructor);


        let allInstructors = JSON.parse(localStorage.getItem('instructors') || '[]');
        const index = allInstructors.findIndex(i => i.username === instructor.username);

        if (index !== -1) {
            allInstructors[index] = {
                ...instructor,
                role: 'instructor'
            };
        } else {
            allInstructors.push({
                ...instructor,
                role: 'instructor'
            });
        }

        localStorage.setItem('instructors', JSON.stringify(allInstructors));

        alert("Your preferred courses have been saved!");
    });
}

async function initBrowsePage() {
    if (!currentUser || currentUser.role.toLowerCase() !== 'student') {
        window.location.href = 'login.html';
        return;
    }

    const coursesContainer = document.getElementById('courses-container');
    const student = users.find(u => u.username === currentUser.username);

    const availableCourses = courses.filter(course => course.available && !student.hasFinished(course.id));

    const searchFilterHTML = `
        <div class="search-filter-container">
            <input type="text" id="course-search" placeholder="Search courses...">
            <div class="filter-options">
                <select id="credit-filter">
                    <option value="">All Credits</option>
                    <option value="1">1 Credit</option>
                    <option value="2">2 Credits</option>
                    <option value="3">3 Credits</option>
                    <option value="4">4 Credits</option>
                </select>
                <select id="day-filter">
                    <option value="">All Days</option>
                    <option value="Monday">Monday</option>
                    <option value="Tuesday">Tuesday</option>
                    <option value="Wednesday">Wednesday</option>
                    <option value="Thursday">Thursday</option>
                    <option value="Sunday">Sunday</option>
                </select>
            </div>
        </div>
    `;
    
    coursesContainer.insertAdjacentHTML('beforebegin', searchFilterHTML);
    
    function renderFilteredCourses() {
        const searchTerm = document.getElementById('course-search').value.toLowerCase();
        const creditFilter = document.getElementById('credit-filter').value;
        const dayFilter = document.getElementById('day-filter').value;
        
        const filteredCourses = availableCourses.filter(course => {
            const courseText = `${course.code} ${course.title}`.toLowerCase();
            const matchesSearch = !searchTerm || courseText.includes(searchTerm);
            
            const matchesCredit = !creditFilter || course.creditHour == creditFilter;
            
            const matchesDay = dayFilter === '' || 
                (course.time && course.time.days && course.time.days.includes(dayFilter));
            
            return matchesSearch && matchesCredit && matchesDay;
        });
        
        coursesContainer.innerHTML = '';
        
        if (filteredCourses.length === 0) {
            coursesContainer.innerHTML = '<p class="no-courses">No courses match your search criteria.</p>';
            return;
        }
        filteredCourses.forEach(course => {
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
    document.getElementById('course-search').addEventListener('input', renderFilteredCourses);
    document.getElementById('credit-filter').addEventListener('change', renderFilteredCourses);
    document.getElementById('day-filter').addEventListener('change', renderFilteredCourses);
    renderFilteredCourses();
}
//use vase for instructor grades submission
async function initViewSchedulePage() {
    const scheduleTable = document.getElementById('schedule-table');

    if (!currentUser || currentUser.role.toLowerCase() !== 'admin') {
        scheduleTable.innerHTML = '<tr><td>You do not have permission to view this page.</td></tr>';
        return;
    }

    let allCourses = [];
    const localCourses = localStorage.getItem('courses');
    if (localCourses) {
        allCourses = JSON.parse(localCourses);
    } else {
        const courseRes = await fetch('json/courses.json');
        allCourses = await courseRes.json();
    }

    let users = [];
    const localUsers = localStorage.getItem('instructors');
    if (localUsers) {
        users = JSON.parse(localUsers);
    } else {
        const userRes = await fetch('json/users.json');
        users = await userRes.json();
    }

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

    if (!currentUser || currentUser.role.toLowerCase() !== 'instructor') {
        window.location.href = 'login.html';
        return;
    }

    const courses_list = document.querySelector('.course-list');

    const instructor = users.find(u => u.username === currentUser.username);   
    const coursesData = instructor.teachingCourses.map(courseId => {let co =courses.find(c => c.id === courseId);
        return co;
    });

    if(!coursesData || coursesData.length === 0) {  
        courses_list.innerHTML = '<p class="no-courses">No courses available for grading.</p>'; 
        return; }

    
    let gradedcourses = localStorage.graded ? JSON.parse(localStorage.getItem('graded')) : [];
    let students = [];

    const cHTML = coursesData.map(c => convertToHtml(c)).join('');
    courses_list.innerHTML = cHTML;


    window.handleDetails = async function (cid) {

        if (gradedcourses.includes(cid)) {
            alert("This course hvae been already graded");
            return;
        }
        const studentDiv = document.getElementById(`students-${cid}`);
        studentDiv.classList.remove('hidden');


        const course_ = coursesData.find(c => c.id == cid);
        let studentsEnrolled = users.filter(user => user.role =='student' && user.enrolledCourses.includes(course_.id));

        if (!course_ || studentsEnrolled.length === 0) {
            studentDiv.innerHTML = "<p>No students enrolled.</p>";
            return;
        }
        students = studentsEnrolled;

        const stuHTML = studentsEnrolled.map(s => converStutToHtml(s.name)).join('');
        studentDiv.innerHTML = `
        <h4 id="grading-title">Grading ${course_.code}</h4>
        <form onsubmit="submitGrades(event, '${cid}')">
            <ul id="ulist">
                ${stuHTML}
            </ul>

            <div class="button-row">
                <button type="submit" class="submit-btn">Submit</button>
                <button type="button" class="back-btn" onclick="document.getElementById('students-${cid}').classList.add('hidden')">Back</button>
            </div>
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
            let student = students[i];
            let grade = studentGrades[i].grade;
            student.setGrades(cid, grade);
        }


        // Save the grades to local storage or send them to the server
        gradedcourses.push(cid);
        localStorage.setItem('graded', JSON.stringify(gradedcourses));
        alert(`Grades for course ${cid} have been submitted.`);
        users = users.map(s => {
            students.forEach(stu => {
                if (s.username === stu.username && s.password === stu.password) {   
                    s = stu;
                }
            });          
            return s;
        });
        saveUsers(users);   
    };
}

function converStutToHtml(s) {
    return `
    <li id="lig">
        ${s}
        <select name="grade-${s}" id="selectgrade">
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
            <button class="course-btn" onclick="handleDetails('${course.id}')">
                ${course.code}${" - "} ${course.title}
                <span class="details-btn">View students list</span>
            </button>
            <div id="students-${course.id}"></div>
        </div>
    `;
}

async function viewLearningPath() {

    if (!currentUser || currentUser.role.toLowerCase() !== 'student') {
        window.location.href = 'login.html';
        return;
    }
  
    const learningPathList = document.getElementById('courses-list');
    const student = users.find(u => u.username === currentUser.username);
    const selectButton = document.getElementById('courseSelect');

    selectButton.addEventListener('click', function (e) {
        let seletctedOption = e.target.value;
        let selectCoursesCode = [];
        let selectedCourses = [];
        if (seletctedOption === "") {
            learningPathList.innerHTML = '<p>Please select a category to view courses.</p>';
            return;
        }
        if (seletctedOption === "current") {
            selectCoursesCode = student.enrolledCourses;
        }
        else if (seletctedOption === "previous") {
            selectCoursesCode = student.finishedCourses;
        }
        if (selectCoursesCode.length === 0) {
            learningPathList.innerHTML = '<p class="no-courses">No courses available in your learning path.</p>';
            return;
        }

        selectedCourses = courses.filter(c => selectCoursesCode.includes(c.id));

        const HTML_ = selectedCourses.map(c => `<li>${c.code} - ${c.title}  <span class="grade"> Grade: ${student.getGrades(c.id)}</span></li>`).join('');
        const currentGpaHtml = `<p class="gpa">Current GPA: ${student.gpa}</p>`;    
        learningPathList.innerHTML = `<ul class="course-list" >${HTML_ + currentGpaHtml}</ul>`;
        // learningPathList.classList.remove('hidden');    
    })
}


async function initAssignPage() {

    if (!currentUser || currentUser.role.toLowerCase() !== 'admin') {
        window.location.href = 'login.html';
        return;
    }

    try {
        const courses = await loadCourses();
        let users = [];
        const localInstructors = localStorage.getItem('instructors');
        if (localInstructors) {
            users = JSON.parse(localInstructors);
        } else {
            users=await loadUsers(); 
        }

        const instructors = users.filter(user => user.role === "instructor");

        const coursePreferences = {};

        courses.forEach(course => {
            if (course.available === true) {
                coursePreferences[course.id] = {
                    course: course,
                    interestedInstructors: []
                };
            }
        });

        instructors.forEach(instructor => {
            if (instructor.preferedCourses && Array.isArray(instructor.preferedCourses)) {
                instructor.preferedCourses.forEach(courseId => {
                    if (coursePreferences[courseId]) {
                        coursePreferences[courseId].interestedInstructors.push({
                            name: instructor.name,
                            username: instructor.username
                        });
                    }
                });
            }
        });

        const tableBody = document.getElementById('courses-table-body');
        tableBody.innerHTML = '';

        Object.values(coursePreferences).forEach(coursePref => {
            const course = coursePref.course;
            const row = document.createElement('tr');

            const nameCell = document.createElement('td');
            const schedule = `${course.time.days.join('/')} ${course.time.time}`;
            nameCell.innerHTML = `<strong>${course.code}: ${course.title}</strong><br><small>${schedule}</small>`;
            row.appendChild(nameCell);

            const interestedCell = document.createElement('td');
            if (coursePref.interestedInstructors.length > 0) {
                interestedCell.textContent = coursePref.interestedInstructors
                    .map(inst => inst.name)
                    .join(', ');
            } else {
                interestedCell.textContent = 'No preferences';
            }
            row.appendChild(interestedCell);

            const assignedCell = document.createElement('td');
            const selectElement = document.createElement('select');
            selectElement.className = 'instructor-select';
            selectElement.dataset.courseId = course.id;

            const emptyOption = document.createElement('option');
            emptyOption.value = '';
            emptyOption.textContent = 'Select instructor';
            selectElement.appendChild(emptyOption);

            instructors.forEach(instructor => {
                const option = document.createElement('option');
                option.value = instructor.username;
                option.textContent = instructor.name;

                const isInterested = coursePref.interestedInstructors.some(
                    inst => inst.username === instructor.username
                );

                if (isInterested) {
                    option.className = 'interested-instructor';
                }

                if (
                    instructor.teachingCourses &&
                    Array.isArray(instructor.teachingCourses) &&
                    instructor.teachingCourses.includes(course.id)
                ) {
                    option.selected = true;
                }

                selectElement.appendChild(option);
            });

            assignedCell.appendChild(selectElement);
            row.appendChild(assignedCell);

            tableBody.appendChild(row);
        });

        const assignButton = document.getElementById('assign-button');
        if (assignButton) {
            assignButton.addEventListener('click', () => {
                const selections = document.querySelectorAll('.instructor-select');
                const assignments = {};

                selections.forEach(select => {
                    const courseId = parseInt(select.dataset.courseId);
                    const instructorUsername = select.value;

                    if (instructorUsername) {
                        if (!assignments[instructorUsername]) {
                            assignments[instructorUsername] = [];
                        }
                        assignments[instructorUsername].push(courseId);
                    }
                });

                let allInstructors = JSON.parse(localStorage.getItem('instructors') || '[]');

                instructors.forEach(instructorData => {
                    const username = instructorData.username;
                    if (assignments[username]) {
                        const instructorIndex = allInstructors.findIndex(i => i.username === username);

                        if (instructorIndex !== -1) {
                            allInstructors[instructorIndex] = {
                                ...instructorData,
                                teachingCourses: assignments[username]
                            };
                        } else {
                            allInstructors.push({
                                ...instructorData,
                                teachingCourses: assignments[username]
                            });
                        }
                    }
                });

                localStorage.setItem('instructors', JSON.stringify(allInstructors));

                const updatedCourses = courses.map(course => {
                    if (course.available) {
                        const select = document.querySelector(`.instructor-select[data-course-id="${course.id}"]`);
                        if (select && select.value) {
                            return {
                                ...course,
                                instructorId: select.value
                            };
                        }
                    }
                    return course;
                });

                saveCourses(updatedCourses);
                assignButton.classList.add('assigned');
                alert('Instructors have been successfully assigned to courses!');
            });
        }
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('courses-table-body').innerHTML =
            '<tr><td colspan="3">Failed to load data. Please try again later.</td></tr>';
    }
}
async function initCreatePage() {

    if (!currentUser || currentUser.role.toLowerCase() !== 'admin') {
        window.location.href = 'login.html';
        return;
    }
    let courses = [];    
    courses=await loadCourses();
    // Display the courses
    displayCreatedCourses(courses);

    // Set up form submission
    const form = document.getElementById('create-course-form');
    if (form) {
        form.addEventListener('submit', handleCourseFormSubmit);
    }
}

function displayCreatedCourses(courses) {
    const tableBody = document.getElementById('created-courses-body');
    if (!tableBody) return;

    tableBody.innerHTML = '';
    
    // Use Course class to get formatted course data for display
    const displayCourses = Course.getCoursesForDisplay(courses);

    displayCourses.forEach(course => {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${course.code}</td>
            <td>${course.title}</td>
            <td>${course.daysTime}</td>
            <td class="${course.statusClass}">${course.status}</td>
            <td>
                <button class="action-btn edit-btn" data-id="${course.id}">Edit</button>
                <button class="action-btn delete-btn" data-id="${course.id}">Delete</button>
            </td>
        `;

        tableBody.appendChild(row);
    });

    // Add event listeners to action buttons
    addCourseActionButtonListeners();
}

function addCourseActionButtonListeners() {
    // Edit button listeners
    const editButtons = document.querySelectorAll('.edit-btn');
    editButtons.forEach(button => {
        button.addEventListener('click', function () {
            const courseId = this.getAttribute('data-id');
            editCourse(courseId);
        });
    });

    // Delete button listeners
    const deleteButtons = document.querySelectorAll('.delete-btn');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function () {
            const courseId = this.getAttribute('data-id');
            deleteCourse(courseId);
        });
    });
}

function editCourse(courseId) {
    // Get courses from localStorage
    const courses = JSON.parse(localStorage.getItem('courses') || '[]');
    
    const course =courses.find(c => c.id == courseId);
    
    if (!course) return;

    // Fill the form with course data
    document.getElementById('course-code').value = course.code || '';
    document.getElementById('course-title').value = course.title || '';
    document.getElementById('course-ch').value = course.creditHour || '';
    document.getElementById('course-description').value = course.description || '';
    document.getElementById('prerequisites').value = course.prerequisites ? course.prerequisites.join(', ') : '';
    document.getElementById('course-time').value = course.time?.time || '';

    // Check the appropriate day checkboxes
    const days = course.time?.days || [];
    document.querySelectorAll('.day-checkbox input[type="checkbox"]').forEach(checkbox => {
        checkbox.checked = days.includes(checkbox.value);
    });

    // Change the form submit button to update
    const submitButton = document.querySelector('.button.create');
    submitButton.textContent = 'Update Course';
    submitButton.setAttribute('data-id', courseId);
    submitButton.classList.add('update');
}

function deleteCourse(courseId) {
    // Get courses from localStorage
    let courses = JSON.parse(localStorage.getItem('courses') || '[]');
    
    // Use Course class method to delete the course
    const updatedCourses = Course.deleteCourse(courseId, courses);
    
    if (!updatedCourses) return;
    
    // Save back to localStorage
    localStorage.setItem('courses', JSON.stringify(updatedCourses));

    // Refresh the display
    displayCreatedCourses(updatedCourses);
}

function handleCourseFormSubmit(event) {
    event.preventDefault();

    // Get form values
    const code = document.getElementById('course-code').value;
    const title = document.getElementById('course-title').value;
    const creditHour = parseInt(document.getElementById('course-ch').value);
    const description = document.getElementById('course-description').value;
    const prerequisitesStr = document.getElementById('prerequisites').value;
    const timeStr = document.getElementById('course-time').value;

    // Get selected days
    const selectedDays = [];
    document.querySelectorAll('.day-checkbox input[type="checkbox"]:checked').forEach(checkbox => {
        selectedDays.push(checkbox.value);
    });

    // Parse prerequisites
    const prerequisites = prerequisitesStr
        ? prerequisitesStr.split(',').map(p => p.trim()).filter(p => p)
        : [];

    // Check if this is an update or a new course
    const submitButton = document.querySelector('.button.create');
    const isUpdate = submitButton.classList.contains('update');
    const courseId = isUpdate ? submitButton.getAttribute('data-id') : null;

    // Get existing courses
    let courses = JSON.parse(localStorage.getItem('courses') || '[]');
    
    // Prepare form data for Course class method
    const formData = {
        code,
        title,
        creditHour,
        description,
        prerequisites,
        days: selectedDays,
        time: timeStr
    };
    
    // Use Course class method to create or update the course
    const updatedCourses = Course.createOrUpdateCourse(formData, courses, isUpdate ? courseId : null);
    
    if (!updatedCourses) return;
    
    saveCourses(updatedCourses);
    // Reset form
    document.getElementById('create-course-form').reset();
    
    // Reset form button if it was an update
    if (isUpdate) {
        submitButton.textContent = 'Create Course';
        submitButton.removeAttribute('data-id');
        submitButton.classList.remove('update');
    }

    // Refresh the display
    displayCreatedCourses(updatedCourses);

    // Show success message
    alert(isUpdate ? 'Course updated successfully!' : 'Course created successfully!');
}
async function initValidationPage() {
    currentUser = loadCurrentUserFromStorage();

    if (!currentUser || currentUser.role.toLowerCase() !== 'admin') {
        window.location.href = 'login.html';
        return;
    }
  
    const tableBody = document.getElementById('validation-courses-body');
    tableBody.innerHTML = '';
  
    // Load courses from localStorage or fallback to JSON
    let courses = [];
    const localCourses = localStorage.getItem('courses');
  
    if (localCourses) {
      courses = JSON.parse(localCourses);
    } else {
      const response = await fetch('../json/courses.json');
      courses = await response.json();
    }
  
    // Load students to count registrations
    const students = JSON.parse(localStorage.getItem('students') || '[]');
  
    const getEnrollmentCount = (courseId) => {
      return students.reduce((count, student) => {
        if (student.enrolledCourses && student.enrolledCourses.includes(courseId)) {
          return count + 1;
        }
        return count;
      }, 0);
    };
  
    // Filter relevant courses (pending or in progress)
    const filteredCourses = courses.filter(
      (course) => course.status === 'pending' || course.status === 'in progress'
    );
  
    if (filteredCourses.length === 0) {
      tableBody.innerHTML = '<tr><td colspan="7">No courses to validate at the moment.</td></tr>';
      return;
    }
  
    // Build table rows
    filteredCourses.forEach((course, index) => {
      const enrolledCount = getEnrollmentCount(course.id);
      const schedule = course.time?.days?.join('/') || '';
      const courseTime = course.time?.time || '';
      const statusClass = {
        pending: 'status-pending',
        'in progress': 'status-in-progress', // Changed to match CSS class
        cancelled: 'status-cancelled'
      }[course.status] || 'status-pending';
  
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${course.code}</td>
        <td>${course.title}</td>
        <td>${course.instructorId || 'TBA'}</td>
        <td>${schedule}<br><small>${courseTime}</small></td>
        <td>${enrolledCount}</td>
        <td><span class="status-badge ${statusClass}">${capitalize(course.status)}</span></td>
        <td>
          <div class="action-buttons">
            <button class="validate-btn" ${course.status !== 'pending' ? 'disabled' : ''} data-id="${course.id}">Validate</button>
            <button class="cancel-btn" ${course.status !== 'pending' ? 'disabled' : ''} data-id="${course.id}">Cancel</button>
          </div>
        </td>
      `;
  
      tableBody.appendChild(row);
    });
  
    
  
    function capitalize(text) {
      return text.charAt(0).toUpperCase() + text.slice(1);
    }
  }

