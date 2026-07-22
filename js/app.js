/*
    StudyTrack
    Home-page functionality

    This script saves, displays, edits, calculates,
    and removes study-session data.
*/

$(document).ready(function () {
    console.log("StudyTrack home page loaded.");

    const storageKey = "studyTrackSessions";

    function getSessions() {
        const savedSessions = localStorage.getItem(storageKey);

        if (!savedSessions) {
            return [];
        }

        try {
            return JSON.parse(savedSessions);
        } catch (error) {
            console.error("Could not read saved sessions:", error);
            return [];
        }
    }

    function saveSessions(sessions) {
        localStorage.setItem(storageKey, JSON.stringify(sessions));
        console.log("Study sessions saved:", sessions);
    }

    function escapeHtml(value) {
        return $("<div>").text(value).html();
    }

    function formatDate(dateValue) {
        if (!dateValue) {
            return "No date";
        }

        const dateParts = dateValue.split("-");

        if (dateParts.length !== 3) {
            return dateValue;
        }

        return `${dateParts[1]}/${dateParts[2]}/${dateParts[0]}`;
    }

    function showMessage(message, messageType) {
        const messageElement = $("#form-message");

        messageElement
            .removeClass(
                "form-message-success form-message-error"
            )
            .addClass(
                messageType === "success"
                    ? "form-message-success"
                    : "form-message-error"
            )
            .text(message);

        window.setTimeout(function () {
            messageElement
                .removeClass(
                    "form-message-success form-message-error"
                )
                .text("");
        }, 4000);
    }

    function updateSummary(sessions) {
        const totalMinutes = sessions.reduce(
            function (total, session) {
                return total + Number(session.duration);
            },
            0
        );

        $("#session-count").text(sessions.length);
        $("#total-minutes").text(`${totalMinutes} minutes`);

        console.log("Summary updated:", {
            sessionCount: sessions.length,
            totalMinutes: totalMinutes
        });
    }

    function displaySessions() {
        const sessions = getSessions();
        const sessionList = $("#session-list");

        sessionList.empty();

        if (sessions.length === 0) {
            $("#empty-message").removeClass("d-none");
            updateSummary(sessions);
            return;
        }

        $("#empty-message").addClass("d-none");

        sessions.forEach(function (session) {
            const notes = session.notes
                ? escapeHtml(session.notes)
                : "No notes were provided.";

            const sessionCard = `
                <div class="col-md-6 col-lg-4">
                    <article class="card session-card">
                        <div class="card-body">
                            <h3 class="card-title h5">
                                ${escapeHtml(session.subject)}
                            </h3>

                            <p class="card-text mb-1">
                                <strong>Date:</strong>
                                ${formatDate(session.date)}
                            </p>

                            <p class="card-text mb-1">
                                <strong>Duration:</strong>
                                ${Number(session.duration)} minutes
                            </p>

                            <p class="card-text mb-1">
                                <strong>Type:</strong>
                                ${escapeHtml(session.type)}
                            </p>

                            <p class="card-text">
                                <strong>Notes:</strong>
                                ${notes}
                            </p>

                            <button
                                type="button"
                                class="btn btn-outline-primary btn-sm edit-session-button"
                                data-session-id="${session.id}"
                            >
                                <i class="bi bi-pencil"></i>
                                Edit
                            </button>

                            <button
                                type="button"
                                class="btn btn-outline-danger btn-sm delete-session-button"
                                data-session-id="${session.id}"
                            >
                                <i class="bi bi-trash"></i>
                                Delete
                            </button>
                        </div>
                    </article>
                </div>
            `;

            sessionList.append(sessionCard);
        });

        updateSummary(sessions);
    }

    function resetForm() {
        $("#study-session-form")[0].reset();
        $("#edit-session-id").val("");
        $("#save-session-button").html(
            '<i class="bi bi-save"></i> Save Session'
        );
        $("#cancel-edit-button").addClass("d-none");
    }

    $("#study-session-form").on("submit", function (event) {
        event.preventDefault();

        const subject = $("#subject").val().trim();
        const date = $("#session-date").val();
        const duration = Number($("#duration").val());
        const type = $("#session-type").val();
        const notes = $("#notes").val().trim();
        const editSessionId = $("#edit-session-id").val();

        console.log("Study session form submitted.");

        if (
            subject === "" ||
            date === "" ||
            duration < 1 ||
            type === ""
        ) {
            showMessage(
                "Please complete all required fields.",
                "error"
            );
            return;
        }

        const sessions = getSessions();

        if (editSessionId) {
            const sessionIndex = sessions.findIndex(
                function (session) {
                    return String(session.id) === editSessionId;
                }
            );

            if (sessionIndex !== -1) {
                sessions[sessionIndex] = {
                    id: sessions[sessionIndex].id,
                    subject: subject,
                    date: date,
                    duration: duration,
                    type: type,
                    notes: notes
                };

                console.log(
                    "Study session updated:",
                    sessions[sessionIndex]
                );

                showMessage(
                    "The study session was updated.",
                    "success"
                );
            }
        } else {
            const newSession = {
                id: Date.now(),
                subject: subject,
                date: date,
                duration: duration,
                type: type,
                notes: notes
            };

            sessions.push(newSession);

            console.log("New study session created:", newSession);

            showMessage(
                "The study session was saved.",
                "success"
            );
        }

        saveSessions(sessions);
        resetForm();
        displaySessions();
    });

    $("#session-list").on(
        "click",
        ".edit-session-button",
        function () {
            const selectedId = String(
                $(this).data("session-id")
            );

            const sessions = getSessions();

            const selectedSession = sessions.find(
                function (session) {
                    return String(session.id) === selectedId;
                }
            );

            if (!selectedSession) {
                showMessage(
                    "The selected session could not be found.",
                    "error"
                );
                return;
            }

            $("#edit-session-id").val(selectedSession.id);
            $("#subject").val(selectedSession.subject);
            $("#session-date").val(selectedSession.date);
            $("#duration").val(selectedSession.duration);
            $("#session-type").val(selectedSession.type);
            $("#notes").val(selectedSession.notes);

            $("#save-session-button").html(
                '<i class="bi bi-check-circle"></i> Update Session'
            );

            $("#cancel-edit-button").removeClass("d-none");

            document
                .getElementById("session-form-section")
                .scrollIntoView({
                    behavior: "smooth"
                });

            console.log(
                "Editing study session:",
                selectedSession
            );
        }
    );

    $("#session-list").on(
        "click",
        ".delete-session-button",
        function () {
            const selectedId = String(
                $(this).data("session-id")
            );

            const sessions = getSessions();

            const updatedSessions = sessions.filter(
                function (session) {
                    return String(session.id) !== selectedId;
                }
            );

            saveSessions(updatedSessions);
            displaySessions();

            showMessage(
                "The study session was deleted.",
                "success"
            );

            console.log(
                "Study session deleted. ID:",
                selectedId
            );
        }
    );

    $("#cancel-edit-button").on("click", function () {
        resetForm();

        showMessage(
            "Editing was canceled.",
            "success"
        );

        console.log("Edit canceled.");
    });

    $("#clear-sessions-button").on("click", function () {
        localStorage.removeItem(storageKey);
        resetForm();
        displaySessions();

        showMessage(
            "All study sessions were removed.",
            "success"
        );

        console.log("All study sessions cleared.");
    });

    displaySessions();
});

/**
 * Loads starter study-session records from the JSON file.
 * Falls back to an empty array when the request fails.
 */
async function fetchStarterSessions() {
    try {
        const response = await fetch("data/sessions.json");

        if (!response.ok) {
            throw new Error(
                `Unable to load sessions: ${response.status}`
            );
        }

        const sessions = await response.json();

        console.log("Starter JSON sessions loaded:", sessions);

        return sessions;
    } catch (error) {
        console.error("Starter session fetch failed:", error);

        return [];
    }
}