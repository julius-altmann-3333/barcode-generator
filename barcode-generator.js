    // Passt die Platzhalter an, wenn der Code-Typ gewechselt wird
    function updateLabels() {
        const type = document.getElementById('codeType').value;
        const label = document.getElementById('inputLabel');
        const input = document.getElementById('textInput');
        
        if (type === 'QR') {
            label.textContent = "2. Website-Link (URL) eingeben:";
            input.value = "https://";
        } else if (type === 'EAN13') {
            label.textContent = "2. Zahlenkette eingeben (Exakt 12 oder 13 Ziffern):";
            input.value = "1234567890128";
        } else {
            label.textContent = "2. Text oder Zahlen eingeben:";
            input.value = "ARTIKEL-123";
        }
    }

    // Hauptfunktion zum Generieren
    function generateNow() {
        const type = document.getElementById('codeType').value;
        const value = document.getElementById('textInput').value.trim();
        
        const statusText = document.getElementById('statusText');
        const qrOutput = document.getElementById('qrcode-output');
        const barcodeOutput = document.getElementById('barcode-output');
        const downloadBtn = document.getElementById('downloadBtn');

        // Reset der Anzeige
        qrOutput.innerHTML = "";
        barcodeOutput.style.display = "none";
        downloadBtn.style.display = "none";
        statusText.style.display = "block";

        if (!value) {
            alert("Bitte geben Sie zuerst einen Text oder Link ein.");
            return;
        }

        try {
            if (type === 'QR') {
                if (typeof QRCode === "undefined") {
                    alert("Hinweis: Sie sind offline. Um QR-Codes offline zu nutzen, speichern Sie die 'qrcode.min.js' lokal ab.");
                    return;
                }
                statusText.style.display = "none";
                new QRCode(qrOutput, {
                    text: value,
                    width: 180,
                    height: 180,
                    correctLevel: QRCode.CorrectLevel.H
                });
                // Kurze Verzögerung, damit das QR-Bild generiert wird, bevor der Download-Button erscheint
                setTimeout(() => { downloadBtn.style.display = "block"; }, 100);
                
            } else {
                if (typeof JsBarcode === "undefined") {
                    alert("Hinweis: Sie sind offline. Um Barcodes offline zu nutzen, speichern Sie die 'JsBarcode.all.min.js' lokal ab.");
                    return;
                }
                statusText.style.display = "none";
                barcodeOutput.style.display = "block";
                
                JsBarcode(barcodeOutput, value, {
                    format: type,
                    lineColor: "#000",
                    width: 2,
                    height: 80,
                    displayValue: true
                });
                downloadBtn.style.display = "block";
            }
        } catch (e) {
            alert("Fehler bei der Generierung. Überprüfen Sie, ob Ihre Eingabe zum gewählten Typ passt.");
            statusText.style.display = "block";
        }
    }

    // Speicherfunktion für das fertige Bild
    function saveImage() {
        const type = document.getElementById('codeType').value;
        let dataUrl = "";
        let filename = "code.png";

        if (type === 'QR') {
            const img = document.querySelector('#qrcode-output img');
            if (img) {
                dataUrl = img.src;
                filename = "qrcode.png";
            }
        } else {
            const img = document.getElementById('barcode-output');
            if (img) {
                dataUrl = img.src;
                filename = "barcode.png";
            }
        }

        if (dataUrl) {
            const a = document.createElement('a');
            a.href = dataUrl;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        } else {
            alert("Fehler beim Herunterladen des Bildes.");
        }
    }