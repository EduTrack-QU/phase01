document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.querySelector('form');
    
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
            
            // Find the user
            const user = users.find(u => 
                u.username === username && u.password === password
            );
            
            if (user) {
                // Store user name in localStorage
                localStorage.setItem('userName', user.name);
                
                // Redirect based on role
                switch(user.role.toLowerCase()) {
                    case 'student':
                        window.location.href = '/student_dashboard.html';
                        break;
                    case 'instructor':
                        window.location.href = '/instructor_dashboard.html';
                        break;
                    case 'admin':
                        window.location.href = '/admin_dashboard.html';
                        break;
                    default:
                        alert('Invalid user role');
                }
            } else {
                alert('Invalid username or password');
            }
            
        } catch (error) {
            console.error('Error during authentication:', error);
            alert('An error occurred during login. Please try again.');
        }
    });
}); 