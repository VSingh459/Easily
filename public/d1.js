// Function to delete a job
function deleteJob(jobId) {
    if (confirm('Are you sure you want to delete this job?')) {
        fetch(`/job/${jobId}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (response.ok) {
                alert('Job deleted successfully.');
                window.location.href = '/job'; // Redirect to job list page
            } else {
                alert('Error: Unable to delete job.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred.');
        });
    }
}


document.addEventListener("DOMContentLoaded", function () {
    const modal = document.getElementById("modal");
    const openModalBtn = document.getElementsByClassName("APN")[0];
    const closeModalBtn = document.getElementById("closeModal");
    const form = document.getElementById("formII");
    const fileInput = document.getElementById('a5');
    const errorMessageContainer = document.createElement("div");
    errorMessageContainer.classList.add("error-message");
    form.prepend(errorMessageContainer);

    // Open the modal when the "Apply Now" button is clicked
    openModalBtn.addEventListener("click", () => {
        modal.style.display = "flex";
    });

    // Close the modal when the close button is clicked
    closeModalBtn.addEventListener("click", () => {
        modal.style.display = "none";
        form.reset(); // Clear all fields in the form
        errorMessageContainer.textContent = ""; // Clear any error messages
        errorMessageContainer.style.display = "none";
    });

    // Close the modal when clicking outside the modal content
    window.addEventListener("click", (event) => {
        if (event.target === modal) {
            modal.style.display = "none";
            form.reset(); // Clear all fields in the form
            errorMessageContainer.textContent = ""; // Clear any error messages
            errorMessageContainer.style.display = "none";
        }
    });

    // File type validation for PDF on client side
    fileInput.addEventListener('change', function() {
        const file = fileInput.files[0];
        if (file && file.type !== 'application/pdf') {
            errorMessageContainer.textContent = "Only PDF files are allowed.";
            errorMessageContainer.style.display = "block";
            errorMessageContainer.style.backgroundColor = "lightcoral";
            errorMessageContainer.style.color = "white";
            errorMessageContainer.style.padding = "5px";
            errorMessageContainer.style.marginTop = "10px";
            errorMessageContainer.style.borderRadius = "5px";
            fileInput.value = ""; // Clear the file input
        } else {
            errorMessageContainer.style.display = "none";
            const fileStatus = document.querySelector('.a6');
            fileStatus.textContent = file ? file.name : 'No File Chosen';
        }
    });

    // Form submission with AJAX
    form.addEventListener("submit", async function (event) {
        event.preventDefault(); // Prevent default form submission

        const formData = new FormData(form); // Automatically includes file input

        // Client-side validation for text fields
        const name = form.elements["name"].value;
        const email = form.elements["email"].value;
        const contact = form.elements["contact"].value;
        let errors = [];

        if (!name.trim()) {
            errors.push("Name is required.");
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            errors.push("Invalid email address. Ensure it includes '@' and a domain.");
        }
        const contactRegex = /^\d{10}$/;
        if (!contactRegex.test(contact)) {
            errors.push("Contact number must be exactly 10 digits.");
        }

        // If there are errors, display the first one and stop submission
        if (errors.length > 0) {
            errorMessageContainer.textContent = errors[0];
            errorMessageContainer.style.display = "block";
            errorMessageContainer.style.backgroundColor = "lightcoral";
            errorMessageContainer.style.color = "white";
            errorMessageContainer.style.padding = "5px";
            errorMessageContainer.style.marginTop = "10px";
            errorMessageContainer.style.borderRadius = "5px";
            return;
        }

        try {
            // Send form data via AJAX
            const response = await fetch('/submit-form', {
                method: 'POST',
                body: formData // FormData includes files and other fields
            });

            if (response.ok) {
                const data = await response.json();
                window.location.href = data.redirectUrl; // Redirect to success page on success
            } else if (response.status === 400) {
                const errorData = await response.json();
                errorMessageContainer.textContent = errorData.errorMessage;
                errorMessageContainer.style.display = "block";
                errorMessageContainer.style.backgroundColor = "lightcoral";
                errorMessageContainer.style.color = "white";
                errorMessageContainer.style.padding = "5px";
                errorMessageContainer.style.marginTop = "10px";
                errorMessageContainer.style.borderRadius = "5px";
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('An error occurred. Please try again.');
        }
    });

   


});
