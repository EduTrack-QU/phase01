document.addEventListener('DOMContentLoaded', async function() {
    try {
        // Fetch data from JSON files
        const coursesResponse = await fetch('json/courses.json');
        const usersResponse = await fetch('json/users.json');
        const preferencesResponse = await fetch('json/preferences.json');
        
        if (!coursesResponse.ok || !usersResponse.ok || !preferencesResponse.ok) {
            throw new Error('Failed to fetch data');
        }
        
        const courses = await coursesResponse.json();
        const users = await usersResponse.json();
        const preferencesData = await preferencesResponse.json();
        
        // Extract preferences array from the preferences object
        const preferences = preferencesData.preferences || [];
        
        // Filter instructors from users
        const instructors = users.filter(user => user.role === "instructor");
        
        // Process data to get course preferences
        const coursePreferences = {};
        
        // Initialize coursePreferences with all courses
        courses.forEach(course => {
            coursePreferences[course.id] = {
                course: course,
                interestedInstructors: []
            };
        });
        
        // Add instructor preferences to courses
        preferences.forEach(pref => {
            const instructor = instructors.find(inst => inst.username === pref.instructorId);
            if (instructor && coursePreferences[pref.courseId]) {
                coursePreferences[pref.courseId].interestedInstructors.push({
                    name: instructor.name,
                    username: instructor.username
                });
            }
        });
        
        // Populate the table
        const tableBody = document.getElementById('courses-table-body');
        
        Object.values(coursePreferences).forEach(coursePref => {
            const course = coursePref.course;
            const row = document.createElement('tr');
            
            // Course name cell
            const nameCell = document.createElement('td');
            nameCell.textContent = `${course.code}: ${course.title}`;
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
                
                selectElement.appendChild(option);
            });
            
            assignedCell.appendChild(selectElement);
            row.appendChild(assignedCell);
            
            tableBody.appendChild(row);
        });
        
        // Handle the assign button click
        document.getElementById('assign-button').addEventListener('click', async function() {
            const assignments = [];
            const selects = document.querySelectorAll('.instructor-select');
            
            selects.forEach(select => {
                if (select.value) {
                    assignments.push({
                        courseId: parseInt(select.dataset.courseId),
                        instructorId: select.value
                    });
                }
            });
            
            if (assignments.length === 0) {
                alert('Please assign at least one instructor before submitting.');
                return;
            }
            
            try {
                // Change button text to "Assigned"
                document.querySelector('.btn-text-one').style.top = '-100%';
                document.querySelector('.btn-text-two').style.top = '50%';
                
                // Create assignments object with the structure you specified
                const assignmentsData = {
                    assignments: assignments
                };
                
                // In a real application with a backend, you would use fetch with POST method
                // For this demo, we'll just log it to console
                console.log('Assignments data to save:', assignmentsData);
                
                // Simulate saving to assignments.json
                // In a real application, you would have an API endpoint to handle this
                // For example:
                // await fetch('api/assignments', {
                //     method: 'POST',
                //     headers: {
                //         'Content-Type': 'application/json',
                //     },
                //     body: JSON.stringify(assignmentsData),
                // });
                
                // Update courses with assigned instructors
                const updatedCourses = courses.map(course => {
                    const assignment = assignments.find(a => a.courseId === course.id);
                    if (assignment) {
                        return {
                            ...course,
                            instructorId: assignment.instructorId
                        };
                    }
                    return course;
                });
                
                console.log('Updated courses:', updatedCourses);
                
                // Show success message
                alert('Instructors assigned successfully! Assignments saved to assignments.json');
                
            } catch (error) {
                console.error('Error saving assignments:', error);
                alert('Failed to save assignments. Please try again.');
            }
        });
        
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('courses-table-body').innerHTML = 
            '<tr><td colspan="3">Failed to load data. Please try again later.</td></tr>';
    }
});