document.addEventListener('DOMContentLoaded', () => {
    const userName = localStorage.getItem('userName');
    if (userName) {
        document.querySelector('h2').textContent = `Welcome ${userName} To the Portal`;
    }
}); 