document.addEventListener("DOMContentLoaded", () => {
    fetch('data/courses.json') 
        .then(response => response.json())
        .then(data => {
            const tableBody = document.getElementById('courses-table-body');
            data.forEach(course => {
                const row = `
                    <tr>
                        <td>${course.id}</td>
                        <td>${course.user}</td>
                        <td>${course.name}</td>
                        <td>${course.status}</td>
                        <td>
                            <button>Edit</button>
                            <button>View</button>   
                            <button>Accept</button>
                            <button>Decline</button>
                        </td>
                    </tr>`;
                tableBody.innerHTML += row;
            });
        })
        .catch(error => console.error('Error loading courses:', error));
});

