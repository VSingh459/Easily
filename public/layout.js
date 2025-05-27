document.addEventListener("DOMContentLoaded", function() {
    // Navigation script
    const jobButton = document.getElementById('mon');
    const homeButton = document.getElementById('mo23');
    const recruiterButton = document.getElementById('recruiterDropdown');
    const registerButton = document.getElementById('tue');

    if (jobButton) {
        jobButton.addEventListener('click', function() {
            window.location.href = '/jobs';
        });
    }

    if (homeButton) {
        homeButton.addEventListener('click', function() {
            window.location.href = '/';
        });
    }

    if (recruiterButton) {
        recruiterButton.addEventListener('click', function() {
            const dropdownMenu = document.getElementById('dropdownMenu');
            if (dropdownMenu) {
                dropdownMenu.classList.toggle('show');
            }
        });
    }

    if (registerButton) {
        registerButton.addEventListener('click', function() {
            const registerModal = document.getElementById('registerModal');
            if (registerModal) {
                registerModal.style.display = 'block';
            }
        });
    }
});
