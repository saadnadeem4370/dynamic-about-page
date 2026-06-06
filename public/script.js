const teamContainer = document.getElementById("teamContainer");
const searchInput = document.getElementById("searchInput");
const roleFilter = document.getElementById("roleFilter");
const themeBtn = document.getElementById("themeBtn");

let teamMembers = [];

// Fetch Team Members
async function fetchTeamMembers() {
    try {
        const response = await fetch("/api/team");
        teamMembers = await response.json();

        displayMembers(teamMembers);
    } catch (error) {
        console.error("Error fetching team members:", error);

        teamContainer.innerHTML =
            "<p>Failed to load team members.</p>";
    }
}

// Display Members
function displayMembers(members) {

    if (members.length === 0) {
        teamContainer.innerHTML =
            "<p>No team members found.</p>";
        return;
    }

    teamContainer.innerHTML = members
        .map(member => `
            <div class="card">

                <img
                    src="${member.image}"
                    alt="${member.name}"
                    loading="lazy"
                >

                <div class="card-content">

                    <h3>${member.name}</h3>

                    <p class="role">
                        ${member.role}
                    </p>

                    <p class="bio">
                        ${member.bio}
                    </p>

                    <div class="socials">

                        <a
                            href="${member.linkedin}"
                            target="_blank"
                        >
                            <i class="fab fa-linkedin"></i>
                        </a>

                        <a
                            href="${member.github}"
                            target="_blank"
                        >
                            <i class="fab fa-github"></i>
                        </a>

                    </div>

                </div>

            </div>
        `)
        .join("");
}

// Search + Filter
function filterMembers() {

    const searchValue =
        searchInput.value.toLowerCase();

    const selectedRole =
        roleFilter.value;

    const filtered = teamMembers.filter(member => {

        const matchName =
            member.name
            .toLowerCase()
            .includes(searchValue);

        const matchRole =
            selectedRole === "All" ||
            member.role === selectedRole;

        return matchName && matchRole;
    });

    displayMembers(filtered);
}

// Search Event
searchInput.addEventListener(
    "input",
    filterMembers
);

// Filter Event
roleFilter.addEventListener(
    "change",
    filterMembers
);

// Dark Mode
themeBtn.addEventListener("click", () => {

    document.body.classList.toggle("dark");

    const icon =
        themeBtn.querySelector("i");

    if (
        document.body.classList.contains(
            "dark"
        )
    ) {
        icon.classList.remove(
            "fa-moon"
        );

        icon.classList.add(
            "fa-sun"
        );

        localStorage.setItem(
            "theme",
            "dark"
        );
    }
    else {

        icon.classList.remove(
            "fa-sun"
        );

        icon.classList.add(
            "fa-moon"
        );

        localStorage.setItem(
            "theme",
            "light"
        );
    }
});

// Load Saved Theme
window.addEventListener("load", () => {

    const savedTheme =
        localStorage.getItem("theme");

    if (savedTheme === "dark") {

        document.body.classList.add(
            "dark"
        );

        themeBtn.innerHTML =
            '<i class="fa-solid fa-sun"></i>';
    }

    fetchTeamMembers();
});