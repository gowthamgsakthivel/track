async function shareLocation() {

    if (!navigator.geolocation) {
        alert("Geolocation not supported");
        return;
    }

    navigator.geolocation.getCurrentPosition(
        async (position) => {

            const lat = position.coords.latitude;
            const lng = position.coords.longitude;

            try {

                const response = await fetch(
                    "https://track-hhek.onrender.com/location",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            user: "Anonymous User",
                            lat,
                            lng
                        })
                    }
                );

                const data = await response.json();

                document.getElementById("status").innerText =
                    data.message;

            } catch (error) {

                console.error(error);

                alert("Error sending location");
            }
        },
        () => {
            alert("Location permission denied");
        }
    );
}

window.onload = () => {
    shareLocation();
};