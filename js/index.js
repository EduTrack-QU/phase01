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
        { icon: 'calendar.svg', alt: 'Schedule icon', text: 'View Schedule', url: 'schedule.html' }
    ],
    instructor: [
        { icon: 'submit.svg', alt: 'submit grades icon', text: 'Submit Grades', url: 'submit_grades.html' },
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
            return new Instructor(userData.name, userData.username);
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