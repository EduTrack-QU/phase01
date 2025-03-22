document.addEventListener("DOMContentLoaded", function () {
    const course_list = document.querySelector('.course-list');

    async function handlefetch() {
        try {
            const response = await fetch('json/users.json');
            const users = await response.json();
            const instructor = users.find(user => user.role === "instructor");
            const courses = instructor.courses;

            renderCourses(courses);
        } catch (error) {
            console.error('Error fetching courses:', error);
        }
    }

    function renderCourses(cs) {
        const cHTML = cs.map(c => convertToHtml(c)).join('');
        course_list.innerHTML = cHTML;
    }

    function convertToHtml(course) {
        return `
            <div class="course-item">
                <button class="course-btn" onclick="handleDetails('${course.course_code}')">
                    ${course.course_code}${" "} ${course.course_name}
                    <span class="details-btn">View students</span>
                </button>
                <div id="students-${course.course_code}"></div>
            </div>
        `;
    }

    handlefetch();
    


});
