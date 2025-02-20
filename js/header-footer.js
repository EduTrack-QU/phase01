document.addEventListener("DOMContentLoaded", function () {

    const bodyContent = document.body.innerHTML;
    document.body.innerHTML = `<div class="page-wrapper">${bodyContent}</div>`;
    

    const headerElement = document.getElementById('header');
    const footerElement = document.getElementById('footer');

    fetch("components/header.html")
        .then(response => response.text())
        .then(data => headerElement.innerHTML = data);

    fetch("components/footer.html")
        .then(response => response.text())
        .then(data => footerElement.innerHTML = data);
});
