document.addEventListener('DOMContentLoaded', function () {
    // Initialize items list from localStorage
    let logData = JSON.parse(localStorage.getItem('scannedItems')) || [];

    // Start the webcam feed for capturing a photo
    function startWebcam() {
        const video = document.getElementById('video');

        // Ensure the video element exists before trying to set srcObject
        if (!video) {
            console.error("Video element not found!");
            return;
        }

        // Request access to the webcam
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(function (stream) {
                video.srcObject = stream;
                video.play();  // Start playing the video feed
            })
            .catch(function (error) {
                alert("Error accessing webcam: " + error);
            });
    }

    // Capture photo from webcam feed after a 3-second countdown
    let countdownTimer;
    function capturePhotoWithTimer() {
        let countdownValue = 3;
        const countdownDisplay = document.getElementById('countdown');
        
        countdownDisplay.textContent = countdownValue;  // Show 3 seconds countdown

        countdownTimer = setInterval(function () {
            countdownValue--;
            countdownDisplay.textContent = countdownValue;
            
            if (countdownValue === 0) {
                clearInterval(countdownTimer);  // Stop the countdown timer
                capturePhoto();  // Capture the photo when countdown reaches zero
            }
        }, 1000);
    }

    // Capture photo after countdown reaches zero
    function capturePhoto() {
        const video = document.getElementById('video');
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        const dataUrl = canvas.toDataURL('image/png');  // Capture the image as a PNG base64 string
        const photo = document.getElementById('photo');
        photo.src = dataUrl;  // Display the captured image
        document.getElementById('photoDisplay').style.display = 'block';  // Show the photo display
        document.getElementById('saveItemButton').style.display = 'block';  // Show the submit button
    }

    // Submit the item (name, photo, and timestamp)
    function submitItem() {
        const userName = document.getElementById('userName').value.trim();
        const itemName = document.getElementById('itemName').value.trim();
        const photoSrc = document.getElementById('photo').src;

        if (!userName || !itemName || !photoSrc) {
            alert('Please fill in all fields and capture a photo.');
            return;
        }

        const timestamp = new Date().toISOString();
        const itemData = { name: itemName, photo: photoSrc, timestamp, submittedBy: userName };

        // Save the item to localStorage
        logData.push(itemData);
        localStorage.setItem('scannedItems', JSON.stringify(logData));

        alert('Item submitted successfully!');
        window.location.href = 'index.html'; // Redirect to home page after submission
    }

    // Attach event listeners to the buttons
    document.getElementById('captureButton').addEventListener('click', capturePhotoWithTimer);
    document.getElementById('saveItemButton').addEventListener('click', submitItem);

    // Initialize webcam on page load
    startWebcam();
});
