/* ===========================
   VOLUNTEER.JS
   Volunteer form helpers
   =========================== */

(function initVolunteerForm() {
    const form = document.querySelector('.volunteer__form');

    if (!form) {
        return;
    }

    form.addEventListener('submit', async (event) => {
        const actionUrl = form.getAttribute('action') || '';

        event.preventDefault();

        const submitButton = form.querySelector('button[type="submit"]');
        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = 'Submitting...';
        }

        try {
            const response = await fetch(actionUrl, {
                method: 'POST',
                body: new FormData(form),
                headers: {
                    Accept: 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Submission failed');
            }

            window.location.href = 'thank-you.html';
        } catch (error) {
            window.alert('We could not submit your form right now. Please try again.');
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = 'Submit Volunteer Interest';
            }
        }
    });
})();
