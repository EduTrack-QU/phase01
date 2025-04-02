document.addEventListener("DOMContentLoaded", function () {
    const course_list = document.querySelector('.course-list');
    let courses = [];
    let gradedcourses= localStorage.graded ? JSON.parse(localStorage.getItem('graded')) : []; 
    
    async function handlefetch() {
        try {
            const response = await fetch('json/tester.json');
            const users = await response.json();
            const instructor = users.find(user => user.role === "instructor");
            courses = instructor.courses;

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
                    <span class="details-btn">View students list</span>
                </button>
                <div id="students-${course.course_code}"></div>
            </div>
        `;
    }

    

    window.handleDetails=function (cid){
        if(gradedcourses.includes(cid)){
            alert("This course hvae been already graded");
            return;
        }
        const studentDiv = document.getElementById(`students-${cid}`);
        studentDiv.classList.remove('hidden')
        const course_ = courses.find(c => c.course_code === cid);
        
        if (!course_ || !course_.enrolled_students) {
            studentDiv.innerHTML = "<p>No students enrolled.</p>";
            return;
        }
        const stuHTML = course_.enrolled_students.map(s => converStutToHtml(s)).join('');
        studentDiv.innerHTML = `
        <h4>Grading Form</h4>
        <form onsubmit="submitGrades('event, ${cid}')">
            <ul id="ulist">
                ${stuHTML}
            </ul>
            <button type="submit" class="submit-btn">Submit</button>
            <button type="button" class="back-btn" onclick="document.getElementById('students-${cid}').classList.add('hidden')">Back</button>
        </form>
    `;
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

    window.submitGrades = function(event,cid) {
        event.preventDefault(); 

        gradedcourses.push(cid);
        alert('Grades submitted!');
        document.getElementById(`students-${cid}`).classList.add('hidden');
    };
    





    handlefetch();
    


});
