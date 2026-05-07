async function shareLocation() {

    const username = document.getElementById("username").value;

    if (!username) {
        alert("Enter your name");
        return;
    }

    if (!navigator.geolocation) {
        alert("Geolocation not supported");
        return;
    }

    navigator.geolocation.getCurrentPosition(
        async (position) => {

            const lat = position.coords.latitude;
            const lng = position.coords.longitude;

            const response = await fetch("https://track-hhek.onrender.com", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    user: username,
                    lat,
                    lng
                })
            });

            const data = await response.json();

            document.getElementById("status").innerText =
                data.message;
        },
        () => {
            alert("Location permission denied");
        }
    );
}