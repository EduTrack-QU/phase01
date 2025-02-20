let allCourses = [];

document.addEventListener("DOMContentLoaded", function () {
    fetch("json/courses.json")
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(courses => {
            allCourses = courses;
            displayCourses(allCourses);
        })
        .catch(error => console.error("Error loading courses:", error));

    // document.getElementById("search-button").addEventListener("click", handleSearch);
    document.getElementById("search-bar").addEventListener("input", handleSearch);
});

function displayCourses(courses) {
    const container = document.getElementById("courses-container");
    container.innerHTML = "";

    if (courses.length === 0) {
        container.innerHTML = "<p>No courses found matching your search.</p>";
        return;
    }
    courses.forEach(course => {
        const courseCard = document.createElement("div");
        courseCard.classList.add("course-card");

        courseCard.innerHTML = `
            <h3>${course.course_name}</h3>
            <p><strong>Level:</strong> ${course.course_code}</p>
            <button>View Course</button>
        `;

        container.appendChild(courseCard);
    });
}


function handleSearch() {
    const query = document.getElementById("search-bar").value.toLowerCase();
    const filteredCourses = allCourses.filter(course =>
        course.course_name.toLowerCase().includes(query) ||
        course.description.toLowerCase().includes(query) ||
        course.course_code.toLowerCase().includes(query)
    );
    displayCourses(filteredCourses);
}
