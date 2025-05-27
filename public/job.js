// Select all "View Details" buttons and attach click event listeners
// job.js
document.querySelectorAll(".vd").forEach(button => {
    button.addEventListener("click", function() {
        const jobId = this.getAttribute("data-id");
        window.location.href = `/d1?jobId=${jobId}`;
    });
});

