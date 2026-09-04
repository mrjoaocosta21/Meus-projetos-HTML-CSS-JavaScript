let currentApiUrl = "";
let currentQrText = "";

function generateQRCode() {
    const qrInput = document.getElementById("qrInput").value.trim();
    const qrImage = document.getElementById("qrCodeImage");
    const qrFrame = document.getElementById("qrCodeFrame");
    const qrActions = document.getElementById("qrActions");

    if (qrInput === "") {
        alert("Please enter text or URL to generate QR code.");
        return;
    }

    const apiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrInput)}`;

    currentApiUrl = apiUrl;
    currentQrText = qrInput;

    qrImage.src = apiUrl;
    qrImage.alt = `QR code for ${qrInput}`;

    qrFrame.classList.add("visible");
    qrActions.classList.add("visible");
}

function sanitizeFilename(text) {
    const clean = text
        .replace(/[^a-z0-9]+/gi, "-")
        .replace(/^-+|-+$/g, "")
        .toLowerCase();
    return (clean || "qrcode").slice(0, 40);
}

async function downloadQRCode() {
    if (!currentApiUrl) return;

    try {
        const response = await fetch(currentApiUrl);
        if (!response.ok) throw new Error("Network response was not ok");
        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = `${sanitizeFilename(currentQrText)}.png`;
        document.body.appendChild(link);
        link.click();
        link.remove();

        URL.revokeObjectURL(blobUrl);
    } catch (err) {
        console.error("Download failed:", err);
        alert(
            "Não foi possível baixar o QR code diretamente. Vou abrir a imagem em uma nova aba — " +
            "clique com o botão direito nela e escolha 'Salvar imagem como...'."
        );
        window.open(currentApiUrl, "_blank");
    }
}