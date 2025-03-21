document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.querySelector('form');
    
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const courseCode = document.querySelector('input[name="course_code"]').value;
        
        
            const response = await fetch('/json/courses.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const courses = await response.json();
            
            const course = courses.find(c => 
                c.course_code.toLowerCase() === courseCode.toLowerCase() && c.open === true
            );

            console.log(course)
        
            
    
    });
}); 