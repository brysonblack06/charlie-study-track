/*
    StudyTrack
    Admin dashboard functionality
*/

$(document).ready(function () {
    console.log("StudyTrack admin page loaded.");

    const storageKey = "studyTrackSessions";
    const signedInUser = sessionStorage.getItem(
        "studyTrackSignedInUser"
    );

    function getSessions() {
        const savedSessions = localStorage.getItem(storageKey);

        if (!savedSessions) {
            return [];
        }

        try {
            return JSON.parse(savedSessions);
        } catch (error) {
            console.error("Unable to read session data:", error);
            return [];
        }
    }

    function escapeHtml(value) {
        return $("<div>").text(value).html();
    }

    function formatDate(dateValue) {
        const dateParts = dateValue.split("-");

        if (dateParts.length !== 3) {
            return dateValue;
        }

        return `${dateParts[1]}/${dateParts[2]}/${dateParts[0]}`;
    }

    function displaySignedInStatus() {
        if (signedInUser) {
            $("#signed-in-status").text(
                `Signed-in demonstration user: ${signedInUser}`
            );
        } else {
            $("#signed-in-status").html(
                'No demonstration user is signed in. <a href="signin.html">Visit the sign-in page</a>.'
            );
        }
    }

    function displayAdminData() {
        const sessions = getSessions();
        const tableBody = $("#admin-session-table");

        tableBody.empty();

        const totalMinutes = sessions.reduce(
            function (total, session) {
                return total + Number(session.duration);
            },
            0
        );

        const averageMinutes =
            sessions.length > 0
                ? Math.round(totalMinutes / sessions.length)
                : 0;

        $("#admin-session-count").text(sessions.length);
        $("#admin-total-minutes").text(totalMinutes);
        $("#admin-average-minutes").text(averageMinutes);

        if (sessions.length === 0) {
            $("#admin-empty-message").removeClass("d-none");
            console.log("No sessions available for admin table.");
            return;
        }

        $("#admin-empty-message").addClass("d-none");

        sessions.forEach(function (session) {
            const notes = session.notes
                ? escapeHtml(session.notes)
                : "No notes";

            const tableRow = `
                <tr>
                    <td>${escapeHtml(session.subject)}</td>
                    <td>${formatDate(session.date)}</td>
                    <td>${Number(session.duration)}</td>
                    <td>${escapeHtml(session.type)}</td>
                    <td>${notes}</td>
                </tr>
            `;

            tableBody.append(tableRow);
        });

        console.log("Admin dashboard updated:", {
            sessionCount: sessions.length,
            totalMinutes: totalMinutes,
            averageMinutes: averageMinutes
        });
    }

    displaySignedInStatus();
    displayAdminData();
});