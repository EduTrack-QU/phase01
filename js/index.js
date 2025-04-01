import { Student } from './student.js';

const navConfig = {
    student: [
        { icon: 'browse.svg', alt: 'browse courses icon', text: 'Browse Courses', url: 'browse_courses.html' },
        { icon: 'register.svg', alt: 'register courses icon', text: 'Register Courses', id: 'registrationBtn', action: true },
        { icon: 'view.svg', alt: 'view learning path icon', text: 'View Learning Path', url: 'learning_path.html' }
    ],
    instructor: [
        { icon: 'create.svg', alt: 'create icon', text: 'Create Courses', url: 'create.html' },
        { icon: 'validate.svg', alt: 'validate icon', text: 'Validate Courses', url: 'validate.html' },
        { icon: 'assign.svg', alt: 'assign icon', text: 'Assign Instructors', url: 'assign.html' },
        { icon: 'calendar.svg', alt: 'Schedule icon', text: 'View Schedule', url: 'schedule.html' }
    ],
    admin: [
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
            return Student.fromJSON(userData);
        case 'instructor':
            return Instructor.fromJSON(userData);
        case 'admin':
            return Admin.fromJSON(userData);
        default:
            return User.fromJSON(userData);
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
    const loginForm = document.getElementById('login-form');
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
            
            const user = users.find(u => 
                u.username === username && u.password === password
            );

            if (user) {
                // Store user info in localStorage
                localStorage.setItem('currentUser', JSON.stringify(user));
                
                // Redirect based on user role
                switch(user.role.toLowerCase()) {
                    case 'student':
                        window.location.href = 'dashboard.html';
                        break;
                    case 'instructor':
                        window.location.href = 'instructor_dashboard.html';
                        break;
                    case 'admin':
                        window.location.href = 'admin_dashboard.html';
                        break;
                    default:
                        window.location.href = 'dashboard.html';
                }
            } else {
                alert('Invalid username or password');
            }
        } catch (error) {
            console.error('Login error:', error);
            alert('An error occurred during login. Please try again later.');
        }
    });
}

function initRegistrationPage() {
    const registrationForm = document.querySelector('form');
    if (!registrationForm) return;

    currentUser = loadCurrentUserFromStorage();

    if (!currentUser || currentUser.role.toLowerCase() !== 'student') {
        window.location.href = 'login.html';
        return;
    }

    registrationForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const courseId = document.querySelector('input[name="course_code"]').value;

        try {
            const response = await fetch('../json/courses.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const courses = await response.json();
            const availableCourses = courses.filter(c =>
                c.code.toLowerCase() === courseId.toLowerCase() && c.available
            );

            if (availableCourses) {
                if (currentUser.registerCourse(availableCourses[0])) {

                    saveCurrentUserToStorage(currentUser);
                    alert(`Successfully registered for course ${availableCourses[0].title}`);
                } else {
                    alert(`You are already enrolled in ${availableCourses[0].title}`);
                }
            } else {
                alert('Course not found or not available');
            }
        } catch (error) {
            console.error('Registration error:', error);
            alert('An error occurred during registration. Please try again later.');
        }
    });
}