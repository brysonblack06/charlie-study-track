/*
    StudyTrack
    Sign-in page functionality

    This is a front-end demonstration and does not
    authenticate users through a server.
*/

$(document).ready(function () {
    console.log("StudyTrack sign-in page loaded.");

    const rememberedEmail = localStorage.getItem(
        "studyTrackRememberedEmail"
    );

    if (rememberedEmail) {
        $("#email").val(rememberedEmail);
        $("#remember-user").prop("checked", true);
    }

    $("#sign-in-form").on("submit", function (event) {
        event.preventDefault();

        const email = $("#email").val().trim();
        const password = $("#password").val();
        const rememberUser = $("#remember-user").is(":checked");
        const messageElement = $("#sign-in-message");

        console.log("Sign-in form submitted for:", email);

        messageElement.removeClass(
            "form-message-success form-message-error"
        );

        if (email === "" || password.length < 6) {
            messageElement
                .addClass("form-message-error")
                .text(
                    "Enter a valid email and a password containing at least six characters."
                );

            console.error("Sign-in form validation failed.");
            return;
        }

        if (rememberUser) {
            localStorage.setItem(
                "studyTrackRememberedEmail",
                email
            );
        } else {
            localStorage.removeItem(
                "studyTrackRememberedEmail"
            );
        }

        sessionStorage.setItem(
            "studyTrackSignedInUser",
            email
        );

        messageElement
            .addClass("form-message-success")
            .text(
                "Sign-in demonstration successful. You may now visit the admin page."
            );

        console.log("Front-end sign-in completed.");
    });
});