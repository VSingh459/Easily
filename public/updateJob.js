const dropdowns = document.querySelectorAll(".dro");

// Define options for job designations
const techOptions = ["MERN Stack Developer", "DevOps", "Java Developer", "Cyber Analyst", "Software Engineer"];
const nonTechOptions = ["Cook", "Manager", "Driver", "Waiter", "Gas Station Attendant", "Doctor"];

// Get existing values from hidden fields, if present
const existingCategory = document.getElementById("categoryInput").value;
const existingDesignation = document.getElementById("designationInput").value;
const existingSkills = document.getElementById("skillsInput").value ? document.getElementById("skillsInput").value.split(", ") : [];

dropdowns.forEach((dropdown, index) => {
    const droSel = dropdown.querySelector(".droSel");
    const dropdownSelection = droSel.querySelector("p");
    const dropdownOptions = dropdown.querySelectorAll(".droCont div");

    // Toggle dropdown open/close when clicking on `.droSel`
    droSel.addEventListener("click", function (e) {
        dropdowns.forEach(d => {
            if (d !== dropdown) {
                d.classList.remove("open");
                d.querySelector(".droSel").classList.remove("actB");
            }
        });
        dropdown.classList.toggle("open");
        droSel.classList.toggle("actB");
        e.stopPropagation();
    });

    // Set initial category or designation if updating an existing job
    if (index === 0 && existingCategory) {
        dropdownSelection.textContent = existingCategory;
    } else if (index === 1 && existingDesignation) {
        dropdownSelection.textContent = existingDesignation;
    }

    // Handle the first dropdown selection to update the second dropdown
    if (index === 0) {
        dropdownOptions.forEach(option => {
            option.addEventListener("click", function (e) {
                dropdownSelection.textContent = option.textContent;
                dropdown.classList.remove("open");
                droSel.classList.remove("actB");
                e.stopPropagation();

                // Update the second dropdown based on the selection
                const secondDropdown = dropdowns[1];
                const secondDroCont = secondDropdown.querySelector(".droCont");
                const secondSelection = secondDropdown.querySelector(".droSel p");
                secondDroCont.innerHTML = ""; // Clear existing options

                const optionsToUse = option.textContent === "Non-Tech" ? nonTechOptions : techOptions;

                // Add the new options to the second dropdown
                optionsToUse.forEach(opt => {
                    const newOption = document.createElement("div");
                    newOption.textContent = opt;
                    newOption.addEventListener("click", function (e) {
                        secondSelection.textContent = newOption.textContent;
                        secondDropdown.classList.remove("open");
                        secondDropdown.querySelector(".droSel").classList.remove("actB");
                        e.stopPropagation();
                    });
                    secondDroCont.appendChild(newOption);
                });

                // Reset the second dropdown placeholder or set it to existing value
                secondSelection.textContent = existingDesignation || "Select Job Designation";
            });
        });
    }
});

// Close dropdown if clicked outside of it
document.addEventListener("click", function (e) {
    dropdowns.forEach(dropdown => {
        if (!dropdown.contains(e.target)) {
            dropdown.classList.remove("open");
            dropdown.querySelector(".droSel").classList.remove("actB");
        }
    });
});

// Skills selection
const skills = document.querySelectorAll(".skill");
let selectedSkills = 0;
const maxSkills = 6;

// Select skills based on existing values if updating a job
skills.forEach(skill => {
    if (existingSkills.includes(skill.textContent)) {
        skill.classList.add("selected");
        selectedSkills++;
    }
    skill.addEventListener("click", () => {
        // Deselect if already selected
        if (skill.classList.contains("selected")) {
            skill.classList.remove("selected");
            selectedSkills--;
        } else if (selectedSkills < maxSkills) {
            // Select if max not reached
            skill.classList.add("selected");
            selectedSkills++;
        } else {
            alert("You can select a maximum of 6 skills.");
        }
    });
});

// Form submission to gather dropdown and selected skills data
document.getElementById("pFo").addEventListener("submit", function () {
    const category = document.querySelectorAll(".dro")[0].querySelector(".droSel p").textContent;
    const designation = document.querySelectorAll(".dro")[1].querySelector(".droSel p").textContent;
    const skills = Array.from(document.querySelectorAll(".skill.selected")).map(skill => skill.textContent);

    document.getElementById("categoryInput").value = category;
    document.getElementById("designationInput").value = designation;
    document.getElementById("skillsInput").value = skills.join(", ");
});

