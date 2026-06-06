const memberTable =
    document.getElementById("memberTable");

const saveBtn =
    document.getElementById("saveBtn");

let editingId = null;

// Load Members
async function loadMembers() {

    const response =
        await fetch("/api/team");

    const members =
        await response.json();

    memberTable.innerHTML =
        members.map(member => `
            <tr>

                <td>${member.name}</td>

                <td>${member.role}</td>

                <td>

                    <button
                        class="edit-btn"
                        onclick="editMember(${member.id})"
                    >
                        Edit
                    </button>

                    <button
                        class="delete-btn"
                        onclick="deleteMember(${member.id})"
                    >
                        Delete
                    </button>

                </td>

            </tr>
        `).join("");
}

// Save Member
saveBtn.addEventListener(
    "click",
    async () => {

        const member = {
            name:
                document.getElementById("name").value,

            role:
                document.getElementById("role").value,

            image:
                document.getElementById("image").value,

            bio:
                document.getElementById("bio").value,

            linkedin:
                document.getElementById("linkedin").value,

            github:
                document.getElementById("github").value
        };

        if (
            !member.name ||
            !member.role
        ) {
            alert(
                "Name and Role are required"
            );
            return;
        }

        if (editingId) {

            await fetch(
                `/api/team/${editingId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type":
                        "application/json"
                    },
                    body: JSON.stringify(
                        member
                    )
                }
            );

            editingId = null;

            saveBtn.textContent =
                "Add Member";
        }
        else {

            await fetch(
                "/api/team",
                {
                    method: "POST",
                    headers: {
                        "Content-Type":
                        "application/json"
                    },
                    body: JSON.stringify(
                        member
                    )
                }
            );
        }

        clearForm();
        loadMembers();
    }
);

// Edit Member
async function editMember(id) {

    const response =
        await fetch("/api/team");

    const members =
        await response.json();

    const member =
        members.find(
            m => m.id === id
        );

    if (!member) return;

    document.getElementById(
        "name"
    ).value = member.name;

    document.getElementById(
        "role"
    ).value = member.role;

    document.getElementById(
        "image"
    ).value = member.image;

    document.getElementById(
        "bio"
    ).value = member.bio;

    document.getElementById(
        "linkedin"
    ).value =
        member.linkedin;

    document.getElementById(
        "github"
    ).value =
        member.github;

    editingId = id;

    saveBtn.textContent =
        "Update Member";
}

// Delete Member
async function deleteMember(id) {

    const confirmDelete =
        confirm(
            "Delete this member?"
        );

    if (!confirmDelete) return;

    await fetch(
        `/api/team/${id}`,
        {
            method: "DELETE"
        }
    );

    loadMembers();
}

// Clear Form
function clearForm() {

    document.getElementById(
        "name"
    ).value = "";

    document.getElementById(
        "role"
    ).value = "";

    document.getElementById(
        "image"
    ).value = "";

    document.getElementById(
        "bio"
    ).value = "";

    document.getElementById(
        "linkedin"
    ).value = "";

    document.getElementById(
        "github"
    ).value = "";
}

// Initial Load
loadMembers();