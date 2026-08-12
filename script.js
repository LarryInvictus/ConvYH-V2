function launchProxy() {
    let query = document.getElementById("proxySearch").value;
    if (!query) return alert("Enter something first!");

    window.open("https://your-proxy-url/?q=" + encodeURIComponent(query));
}

function openProxy(url) {
    window.open("https://your-proxy-url/?q=" + encodeURIComponent(url));
}

function openGame(url) {
    window.open(url);
}

function requestLink() {
    alert("Request submitted! (Replace with your backend)");
}
