
$(document).ready(function () {
    toastr.options = {
        "closeButton": true,
        "progressBar": true,
        "positionClass": "toast-top-right",
        "timeOut": "5000"
    };
});


/*==================== toggle icon navbar ====================*/
let menuIcon = document.querySelector('#menu-icon');
let navbar = document.querySelector('.navbar');

menuIcon.onclick = () => {
    menuIcon.classList.toggle('bx-x');
    navbar.classList.toggle('active');
};


/*==================== scroll sections active link ====================*/
let sections = document.querySelectorAll('section');
let navLinks = document.querySelectorAll('header nav a');

window.onscroll = () => {

    sections.forEach(sec => {
        let top = window.scrollY;
        let offset = sec.offsetTop - 150;
        let height = sec.offsetHeight;
        let id = sec.getAttribute('id');

        if (top >= offset && top < offset + height) {
            navLinks.forEach(links => {
                links.classList.remove('active');
                document.querySelector('header nav a[href*=' + id + ']').classList.add('active');
            });
        };
    });
    /*==================== sticky navbar ====================*/

    let header = document.querySelector('header');

    header.classList.toggle('sticky', window.scrollY > 100);


    /*==================== remove toggle icon and navbar when click navbar link (scroll) ====================*/

    menuIcon.classList.remove('bx-x');
    navbar.classList.remove('active');
};


/*==================== scroll reveal ====================*/

ScrollReveal({
    //reset:true,  // every time loads transition running
    distance: '80px',
    duration: 2000,
    delay: 200

});

ScrollReveal().reveal('.home-content, .heading', { origin: 'top' });
ScrollReveal().reveal('.home-img, .services-container, .portfolio-box, .contact form', { origin: 'bottom' });

ScrollReveal().reveal('.home-content h1 ,.subheading , .about-img ', { origin: 'left' });
ScrollReveal().reveal('.home-content p , .about-content', { origin: 'right' });



/*==================== typed js ====================*/

const typed = new Typed('.multiple-text', {
    strings: ['Software Engineer', 'ASP.NET Developer', 'IT Support Specialist', 'Multimedia Designer'],
    typeSpeed: 100,
    backSpeed: 100,
    backDelay: 1000,
    loop: true
});




/*emailSend*/
function sendMail() {

    let submitButton = document.getElementById("submit-btn");
    submitButton.disabled = true;
    submitButton.value = "Sending..."; // Change button text while processing


    let subject = document.getElementById("subject").value;
    let name = document.getElementById("name").value;
    let email = document.getElementById("email").value;
    let mobile = document.getElementById("mobile").value;
    let message = document.getElementById("message").value;

    // Form validation
    if (!subject || !name || !email || !mobile || !message) {
        toastr.error("Please fill in all required fields.");
        // Re-enable the submit button
        submitButton.disabled = false;
        submitButton.value = "Send Message"; // Reset button text
        return;
    }

    let params = { subject, name, email, mobile, message };

    emailjs.send("service_wqfc5ub", "template_rqtfq7g", params)
        .then(function (response) {
            toastr.success("Thank you for your email! I will get back to you soon.");
            // Re-enable the submit button
            submitButton.disabled = false;
            submitButton.value = "Send Message"; // Reset button text
        })
        .catch(function (error) {
            toastr.error("Failed to send your email. Please try again later.");
            // Re-enable the submit button
            submitButton.disabled = false;
            submitButton.value = "Send Message"; // Reset button text
        });
}

/*==================== PDF Converter Logic ====================*/
let selectedImages = [];
const pdfModalOverlay = document.getElementById('pdfModalOverlay');
const dragDropArea = document.getElementById('dragDropArea');
const fileInput = document.getElementById('fileInput');
const filePreviewContainer = document.getElementById('filePreviewContainer');
const convertBtn = document.getElementById('convertBtn');

function openPdfModal() {
    pdfModalOverlay.classList.add('active');
}

function closePdfModal() {
    pdfModalOverlay.classList.remove('active');
    selectedImages = [];
    renderFilePreview();
}

// Click outside to close modals
window.onclick = function (event) {
    if (event.target == pdfModalOverlay) {
        closePdfModal();
    }

    let compressPdfModalOverlay = document.getElementById('compressPdfModalOverlay');
    if (compressPdfModalOverlay && event.target == compressPdfModalOverlay) {
        closeCompressPdfModal();
    }

    let singlishModalOverlay = document.getElementById('singlishModalOverlay');
    if (singlishModalOverlay && event.target == singlishModalOverlay) {
        closeSinglishModal();
    }

    let mergePdfModalOverlay = document.getElementById('mergePdfModalOverlay');
    if (mergePdfModalOverlay && event.target == mergePdfModalOverlay) {
        closeMergePdfModal();
    }
};

// Prevent default drag behaviors
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    if (dragDropArea) {
        dragDropArea.addEventListener(eventName, preventDefaults, false);
    }
});

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

// Highlight drop area when item is dragged over it
['dragenter', 'dragover'].forEach(eventName => {
    if (dragDropArea) {
        dragDropArea.addEventListener(eventName, highlight, false);
    }
});

['dragleave', 'drop'].forEach(eventName => {
    if (dragDropArea) {
        dragDropArea.addEventListener(eventName, unhighlight, false);
    }
});

function highlight(e) {
    dragDropArea.classList.add('dragover');
}

function unhighlight(e) {
    dragDropArea.classList.remove('dragover');
}

// Handle dropped files
if (dragDropArea) {
    dragDropArea.addEventListener('drop', handleDrop, false);
}

function handleDrop(e) {
    let dt = e.dataTransfer;
    let files = dt.files;
    handleFiles(files);
}

if (fileInput) {
    fileInput.addEventListener('change', function (e) {
        handleFiles(this.files);
    });
}

function handleFiles(files) {
    const fileArray = Array.from(files);
    const imageFiles = fileArray.filter(file => {
        const type = file.type ? file.type.toLowerCase() : '';
        const name = file.name ? file.name.toLowerCase() : '';
        return type === 'image/jpeg' || type === 'image/png' || name.endsWith('.jpg') || name.endsWith('.jpeg') || name.endsWith('.png');
    });

    if (imageFiles.length === 0) {
        toastr.error("Please select valid JPG or PNG images.");
        return;
    }

    imageFiles.forEach(file => {
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = function () {
            selectedImages.push({
                file: file,
                dataUrl: reader.result
            });
            renderFilePreview();
        }
    });

    // Clear input so same file can be chosen again
    const inputEl = document.getElementById('fileInput');
    if (inputEl) {
        inputEl.value = '';
    }
}

function removeImage(index) {
    selectedImages.splice(index, 1);
    renderFilePreview();
}

function renderFilePreview() {
    if (!filePreviewContainer) return;
    filePreviewContainer.innerHTML = '';

    selectedImages.forEach((imgObj, index) => {
        const item = document.createElement('div');
        item.className = 'file-preview-item';

        const img = document.createElement('img');
        img.src = imgObj.dataUrl;

        const fileName = document.createElement('div');
        fileName.className = 'file-name';
        fileName.textContent = imgObj.file.name;

        const removeIcon = document.createElement('i');
        removeIcon.className = 'bx bx-x remove-file';
        removeIcon.onclick = () => removeImage(index);

        item.appendChild(img);
        item.appendChild(fileName);
        item.appendChild(removeIcon);

        filePreviewContainer.appendChild(item);
    });

    if (selectedImages.length > 0) {
        convertBtn.disabled = false;
        if (selectedImages.length === 1) {
            convertBtn.textContent = 'Convert to PDF';
        } else {
            convertBtn.textContent = 'Merge and Convert to PDF';
        }
    } else {
        convertBtn.disabled = true;
        convertBtn.textContent = 'Convert to PDF';
    }
}

async function convertToPdf() {
    if (selectedImages.length === 0) return;

    convertBtn.disabled = true;
    convertBtn.textContent = 'Converting...';

    try {
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF();

        for (let i = 0; i < selectedImages.length; i++) {
            if (i > 0) pdf.addPage();

            const imgData = selectedImages[i].dataUrl;

            // To auto-scale we need the image dimensions.
            const imgProps = pdf.getImageProperties(imgData);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

            // If the scaled height exceeds the page height, scale by height instead.
            if (pdfHeight > pdf.internal.pageSize.getHeight()) {
                const scaledWidth = (imgProps.width * pdf.internal.pageSize.getHeight()) / imgProps.height;
                const remainWidth = (pdfWidth - scaledWidth) / 2;
                pdf.addImage(imgData, 'JPEG', remainWidth, 0, scaledWidth, pdf.internal.pageSize.getHeight());
            } else {
                pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
            }
        }

        pdf.save('converted.pdf');
        toastr.success("PDF created successfully!");
        closePdfModal();

    } catch (error) {
        console.error("Error creating PDF:", error);
        toastr.error("An error occurred during conversion.");
    } finally {
        renderFilePreview();
    }
}

/*==================== Singlish to Sinhala Logic ====================*/

const singlishModalOverlay = document.getElementById('singlishModalOverlay');
const singlishInput = document.getElementById('singlishInput');
const sinhalaOutput = document.getElementById('sinhalaOutput');

function openSinglishModal() {
    if (singlishModalOverlay) singlishModalOverlay.classList.add('active');
}

function closeSinglishModal() {
    if (singlishModalOverlay) singlishModalOverlay.classList.remove('active');
}

// Click outside to close (extend existing window click)
const existingWindowClick = window.onclick;
window.onclick = function (event) {
    if (existingWindowClick) existingWindowClick(event);
    if (event.target == singlishModalOverlay) {
        closeSinglishModal();
    }
};

function copySinhala() {
    if (!sinhalaOutput || !sinhalaOutput.value) return;
    navigator.clipboard.writeText(sinhalaOutput.value).then(() => {
        toastr.success("Sinhala text copied to clipboard!");
    }).catch(err => {
        toastr.error("Failed to copy text.");
    });
}

// Singlish conversion rules (UCSC Standard structure)
const vowelsUni = ['ඌ', 'ඕ', 'ඕ', 'ඖ', 'ආ', 'ඈ', 'ඊ', 'ඒ', 'ඌ', 'ඓ', 'ඔ', 'එ', 'අ', 'උ', 'ඉ', 'ඇ', 'ආ', 'ඒ', 'ඊ', 'ඕ', 'ඌ'];
const vowels = ['oo', 'oe', 'oa', 'au', 'aa', 'aee', 'ii', 'ee', 'uu', 'ei', 'o', 'e', 'a', 'u', 'i', 'ae', 'A', 'E', 'I', 'O', 'U'];

const vowelModifiersUni = ['ූ', 'ෝ', 'ෝ', 'ෞ', 'ා', 'ෑ', 'ී', 'ේ', 'ූ', 'ෛ', 'ො', 'ෙ', '', 'ු', 'ි', 'ැ', 'ා', 'ේ', 'ී', 'ෝ', 'ූ'];
const vowelModifiers = ['oo', 'oe', 'oa', 'au', 'aa', 'aee', 'ii', 'ee', 'uu', 'ei', 'o', 'e', 'a', 'u', 'i', 'ae', 'A', 'E', 'I', 'O', 'U'];

const specialConsonantsUni = ['ඤ', 'ඥ', 'ළු', 'ද්‍ර', 'ච්‍ර', 'ඛ්‍ර', 'ඨ්‍ර', 'ඬ්‍ර', 'ඝ්‍ර', 'ඟ්‍ර', 'ඛ', 'ඝ', 'ඛ', 'ඝ', 'ච', 'ඡ', 'ඡ', 'ජ', 'ධ', 'ද', 'ඪ', 'ණ', 'ඬ', 'ථ', 'ඨ', 'ථ', 'ඨ', 'භ', 'ඳ', 'ෂ', 'ශ', 'ඥ', 'ළ', 'ෆ', 'ඣ', 'ෆ', 'ඥ'];
const specialConsonants = ['ny', 'GN', 'lu', 'dr', 'chr', 'khr', 'thr', 'ndr', 'ghr', 'ngr', 'kh', 'gh', 'Kh', 'Gh', 'ch', 'ch', 'Ch', 'jh', 'Dh', 'dh', 'Dh', 'N', 'nd', 'th', 'th', 'Th', 'Th', 'bh', 'nd', 'sh', 'sh', 'GN', 'L', 'f', 'jh', 'f', 'G'];

const consonantsUni = ['ක', 'ග', 'ට', 'ඩ', 'ත', 'ද', 'ප', 'බ', 'ම', 'ය', 'ර', 'ල', 'ව', 'ස', 'හ', 'ණ', 'ළ', 'ඛ', 'ඝ', 'ඨ', 'ඪ', 'ඵ', 'භ', 'ශ', 'ෂ', 'ං', 'ඃ', 'ච', 'ජ', 'ඤ', 'ව', 'න'];
const consonants = ['k', 'g', 't', 'd', 't', 'd', 'p', 'b', 'm', 'y', 'r', 'l', 'v', 's', 'h', 'N', 'L', 'K', 'G', 'T', 'D', 'P', 'B', 'S', 'S', 'x', 'X', 'c', 'j', 'z', 'w', 'n'];

const allConsonantsUni = [...specialConsonantsUni, ...consonantsUni];
const allConsonants = [...specialConsonants, ...consonants];

function startText() {
    if (!singlishInput || !sinhalaOutput) return;
    let s = singlishInput.value;

    // special rules
    s = s.replace(/rR/g, 'ඍ');
    s = s.replace(/ruu/g, 'ෲ');

    // consonants + vowel modifiers
    for (let i = 0; i < allConsonants.length; i++) {
        for (let j = 0; j < vowels.length; j++) {
            s = s.replace(new RegExp(allConsonants[i] + vowels[j], 'g'), allConsonantsUni[i] + vowelModifiersUni[j]);
        }
    }

    // consonants + hal kirima
    for (let i = 0; i < allConsonants.length; i++) {
        s = s.replace(new RegExp(allConsonants[i], 'g'), allConsonantsUni[i] + '්');
    }

    // vowels individually
    for (let i = 0; i < vowels.length; i++) {
        s = s.replace(new RegExp(vowels[i], 'g'), vowelsUni[i]);
    }

    sinhalaOutput.value = s;
}

// Emoji Picker Native Implementation
function toggleEmojiPicker(event) {
    if (event) event.stopPropagation();
    const wrapper = document.getElementById('emojiPickerWrapper');
    if (wrapper) {
        wrapper.style.display = wrapper.style.display === 'none' ? 'block' : 'none';

        // Populate if empty
        const grid = document.getElementById('nativeEmojiGrid');
        if (grid && grid.innerHTML.trim() === '<!-- Emojis will be dynamically added here -->') {
            grid.innerHTML = '';
            const commonEmojis = ['😊', '😂', '🤣', '❤', '😍', '😒', '😘', '😭', '🥺', '😅', '🤦‍♂️', '🤷‍♂️', '👍', '✌', '🙏', '😎', '😷', '😬', '💯', '✨', '🔥', '🎉'];

            commonEmojis.forEach(emoji => {
                let span = document.createElement('span');
                span.textContent = emoji;
                span.style.cursor = 'pointer';
                span.style.transition = 'transform 0.2s';
                span.onmouseover = () => span.style.transform = 'scale(1.2)';
                span.onmouseout = () => span.style.transform = 'scale(1)';

                span.addEventListener('click', (e) => {
                    const sInput = document.getElementById('singlishInput');
                    if (!sInput) return;

                    e.stopPropagation();
                    const cursorPosition = sInput.selectionStart;
                    const textBefore = sInput.value.substring(0, cursorPosition);
                    const textAfter = sInput.value.substring(cursorPosition, sInput.value.length);

                    sInput.value = textBefore + emoji + textAfter;

                    const newPosition = cursorPosition + emoji.length;
                    sInput.selectionStart = newPosition;
                    sInput.selectionEnd = newPosition;

                    startText();
                    sInput.focus();
                    wrapper.style.display = 'none';
                });
                grid.appendChild(span);
            });
        }
    }
}

// Close picker when clicking outside
document.addEventListener('click', event => {
    const wrapper = document.getElementById('emojiPickerWrapper');
    const btn = document.getElementById('emojiBtn');
    if (wrapper && btn && wrapper.style.display === 'block') {
        if (!wrapper.contains(event.target) && !btn.contains(event.target)) {
            wrapper.style.display = 'none';
        }
    }
});

/*==================== PDF Compressor Logic ====================*/
const compressPdfModalOverlay = document.getElementById('compressPdfModalOverlay');
const compressDragDropArea = document.getElementById('compressDragDropArea');
const compressFileInput = document.getElementById('compressFileInput');
const compressSelectedPdfInfo = document.getElementById('compressSelectedPdfInfo');
const compressPdfBtn = document.getElementById('compressPdfBtn');
let selectedCompressPdfFile = null;

function openCompressPdfModal() {
    if (compressPdfModalOverlay) compressPdfModalOverlay.classList.add('active');
}

function closeCompressPdfModal() {
    if (compressPdfModalOverlay) compressPdfModalOverlay.classList.remove('active');
    selectedCompressPdfFile = null;
    if (compressSelectedPdfInfo) compressSelectedPdfInfo.innerHTML = '';
    if (compressPdfBtn) {
        compressPdfBtn.style.display = 'none';
        compressPdfBtn.innerHTML = 'Compress & Download';
        compressPdfBtn.disabled = false;
    }
}

if (compressDragDropArea && compressFileInput) {
    // Click to open file dialog
    compressDragDropArea.addEventListener('click', () => compressFileInput.click());

    // Basic Drag & Drop Event Overrides
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        compressDragDropArea.addEventListener(eventName, preventDefaults, false);
    });

    ['dragenter', 'dragover'].forEach(eventName => {
        compressDragDropArea.addEventListener(eventName, () => compressDragDropArea.classList.add('highlight'), false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        compressDragDropArea.addEventListener(eventName, () => compressDragDropArea.classList.remove('highlight'), false);
    });

    // Handle File Drops
    compressDragDropArea.addEventListener('drop', handleCompressDrop, false);

    // Handle Input Changes
    compressFileInput.addEventListener('change', function () {
        if (this.files && this.files.length > 0) processCompressSelection(this.files[0]);
    });
}

function handleCompressDrop(e) {
    let dt = e.dataTransfer;
    let files = dt.files;
    if (files.length > 0) processCompressSelection(files[0]);
}

function processCompressSelection(file) {
    if (file.type !== 'application/pdf') {
        toastr.error('Please upload a valid PDF document.');
        return;
    }

    selectedCompressPdfFile = file;
    const mbSize = (file.size / (1024 * 1024)).toFixed(2);

    compressSelectedPdfInfo.innerHTML = `
        <div style="font-size: 1.6rem; color: var(--main-color); margin-top: 1rem;">
            <strong>Target:</strong> ${file.name} <br>
            <span style="color: var(--text-color); font-size: 1.4rem;">Original Size: ${mbSize} MB</span>
        </div>
    `;
    compressPdfBtn.style.display = 'block';
}

async function processCompressPdf() {
    if (!selectedCompressPdfFile) return;

    compressPdfBtn.innerHTML = '<i class="bx bx-loader-alt bx-spin"></i> Uploading to GhostScript Server...';
    compressPdfBtn.disabled = true;

    try {
        // HARDCODE YOUR FREE CONVERTAPI KEY HERE
        const apiKey = 'vx6NiXLgsHMX2QI7PR4QWRYzM79jyrPT';

        if (apiKey === '') {
            toastr.error('Developer: Please hardcode your Free ConvertAPI Secret Key into script.js');
            compressPdfBtn.innerHTML = 'Compress & Download';
            compressPdfBtn.disabled = false;
            return;
        }

        compressSelectedPdfInfo.innerHTML = `
            <div style="font-size: 1.6rem; color: var(--main-color); margin-top: 1rem;">
                <strong>${selectedCompressPdfFile.name}</strong> <br>
                <span style="color: var(--text-color); font-size: 1.5rem;">Authenticating and Compressing via API...</span>
                <div style="width: 100%; background: var(--bg-color); border: 1px solid var(--main-color); border-radius: 5px; margin-top: 10px; height: 10px; overflow: hidden;">
                    <div style="width: 100%; background: var(--main-color); height: 100%; animation: pulse 1s infinite alternate;"></div>
                </div>
            </div>
            <style>
                @keyframes pulse {
                    0% { opacity: 0.5; width: 0%;}
                    100% { opacity: 1; width: 100%;}
                }
            </style>
        `;

        const formData = new FormData();
        formData.append('File', selectedCompressPdfFile);

        const response = await fetch(`https://v2.convertapi.com/convert/pdf/to/compress?Secret=${apiKey}`, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            const errorResult = await response.json();
            throw new Error(errorResult.Message || 'Failed to authenticate or process API.');
        }

        const result = await response.json();

        if (result.Files && result.Files.length > 0) {
            const fileData = result.Files[0].FileData; // Base64 payload from ConvertAPI 

            // Convert Base64 stream to Blob explicitly
            const byteCharacters = atob(fileData);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);

            const originalSize = selectedCompressPdfFile.size;
            const newSize = byteArray.byteLength;

            const originalMB = (originalSize / (1024 * 1024)).toFixed(2);
            const newMB = (newSize / (1024 * 1024)).toFixed(2);

            let statusString = `<span style="color: ${newSize < originalSize ? '#28a745' : '#ffc107'};">Final Compressed Size: ${newMB} MB</span>`;

            compressSelectedPdfInfo.innerHTML = `
                <div style="font-size: 1.6rem; color: var(--main-color); margin-top: 1rem;">
                    <strong>${selectedCompressPdfFile.name}</strong> <br>
                    <span style="color: var(--text-color); font-size: 1.4rem; text-decoration: line-through;">Original: ${originalMB} MB</span><br>
                    ${statusString}
                </div>
            `;

            const blob = new Blob([byteArray], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'compressed_' + selectedCompressPdfFile.name;
            document.body.appendChild(a);
            a.click();

            setTimeout(() => {
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                toastr.success('GhostScript Compression completed successfully!');

                compressPdfBtn.innerHTML = '<i class="bx bx-check"></i> Downloaded';
                setTimeout(closeCompressPdfModal, 2500);
            }, 100);
        } else {
            throw new Error("No files returned from API.");
        }

    } catch (error) {
        console.error("Compression Error:", error);
        toastr.error(error.message || 'Failed to process API Compression.');
        compressPdfBtn.innerHTML = 'Compress & Download';
        compressPdfBtn.disabled = false;

        compressSelectedPdfInfo.innerHTML = `
            <div style="font-size: 1.6rem; color: #dc3545; margin-top: 1rem;">
                <strong>Error formatting document. Ensure your API key is valid.</strong>
            </div>
        `;
    }
}

/*==================== Merge PDF Logic ====================*/
let mergeFiles = []; // Array of { file, name }

function openMergePdfModal() {
    document.getElementById('mergePdfModalOverlay').classList.add('active');
}

function closeMergePdfModal() {
    document.getElementById('mergePdfModalOverlay').classList.remove('active');
    mergeFiles = [];
    renderMergeFileList();
    document.getElementById('mergeStatus').innerHTML = '';
    const btn = document.getElementById('mergePdfBtn');
    btn.style.display = 'none';
    btn.innerHTML = '<i class="bx bx-git-merge"></i> Merge & Download PDF';
    btn.disabled = false;
}

// --- Drop zone setup ---
const mergeDragDropArea = document.getElementById('mergeDragDropArea');
const mergeFileInput = document.getElementById('mergeFileInput');

if (mergeDragDropArea && mergeFileInput) {
    mergeDragDropArea.addEventListener('click', () => mergeFileInput.click());

    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(ev =>
        mergeDragDropArea.addEventListener(ev, preventDefaults, false));

    ['dragenter', 'dragover'].forEach(ev =>
        mergeDragDropArea.addEventListener(ev, () => mergeDragDropArea.classList.add('highlight')));

    ['dragleave', 'drop'].forEach(ev =>
        mergeDragDropArea.addEventListener(ev, () => mergeDragDropArea.classList.remove('highlight')));

    mergeDragDropArea.addEventListener('drop', e => {
        addMergeFiles(e.dataTransfer.files);
    });

    mergeFileInput.addEventListener('change', function () {
        addMergeFiles(this.files);
        this.value = '';
    });
}

function addMergeFiles(fileList) {
    const allowed = ['application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'image/jpeg', 'image/png', 'image/jpg'];

    Array.from(fileList).forEach(file => {
        const type = file.type.toLowerCase();
        const name = file.name.toLowerCase();
        if (!allowed.includes(type) && !name.endsWith('.docx')) {
            toastr.warning(`Skipped unsupported file: ${file.name}`);
            return;
        }
        mergeFiles.push({ file, name: file.name });
    });

    renderMergeFileList();
}

function getFileMergeIcon(filename) {
    const n = filename.toLowerCase();
    if (n.endsWith('.pdf')) return '<i class="bx bxs-file-pdf" style="color:#e74c3c;"></i>';
    if (n.endsWith('.docx') || n.endsWith('.doc')) return '<i class="bx bxs-file-doc" style="color:#2980b9;"></i>';
    return '<i class="bx bxs-image" style="color:#27ae60;"></i>';
}

function renderMergeFileList() {
    const ul = document.getElementById('mergeFileItems');
    const listWrap = document.getElementById('mergeFileList');
    const btn = document.getElementById('mergePdfBtn');

    ul.innerHTML = '';

    if (mergeFiles.length === 0) {
        listWrap.style.display = 'none';
        btn.style.display = 'none';
        return;
    }

    listWrap.style.display = 'block';
    btn.style.display = 'block';

    mergeFiles.forEach((item, idx) => {
        const li = document.createElement('li');
        li.dataset.index = idx;
        li.draggable = true;
        li.style.cssText = `
            display:flex; align-items:center; gap:10px;
            padding:10px 14px; margin-bottom:8px;
            background:var(--second-bg-color);
            border:1px solid var(--main-color);
            border-radius:8px; cursor:grab;
            font-size:1.4rem; color:var(--text-color);
            transition: background 0.2s;
        `;
        li.innerHTML = `
            <span style="font-size:2rem; line-height:1;">${getFileMergeIcon(item.name)}</span>
            <span style="flex:1; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;" title="${item.name}">${item.name}</span>
            <span style="background:var(--bg-color); padding:2px 8px; border-radius:4px; font-size:1.2rem; color:var(--main-color); flex-shrink:0;">#${idx + 1}</span>
            <i class='bx bx-x' onclick="removeMergeFile(${idx})" style="cursor:pointer; color:#e74c3c; font-size:2rem; flex-shrink:0;"></i>
        `;

        // Drag-to-reorder
        li.addEventListener('dragstart', e => {
            e.dataTransfer.setData('text/plain', idx);
            li.style.opacity = '0.5';
        });
        li.addEventListener('dragend', () => li.style.opacity = '1');
        li.addEventListener('dragover', e => {
            e.preventDefault();
            li.style.background = 'rgba(0,150,255,0.12)';
        });
        li.addEventListener('dragleave', () => li.style.background = '');
        li.addEventListener('drop', e => {
            e.preventDefault();
            li.style.background = '';
            const fromIdx = parseInt(e.dataTransfer.getData('text/plain'));
            const toIdx = idx;
            if (fromIdx !== toIdx) {
                const moved = mergeFiles.splice(fromIdx, 1)[0];
                mergeFiles.splice(toIdx, 0, moved);
                renderMergeFileList();
            }
        });

        ul.appendChild(li);
    });
}

function removeMergeFile(idx) {
    mergeFiles.splice(idx, 1);
    renderMergeFileList();
}

async function processMergePdf() {
    if (mergeFiles.length === 0) return;

    const btn = document.getElementById('mergePdfBtn');
    const statusEl = document.getElementById('mergeStatus');
    btn.disabled = true;
    btn.innerHTML = '<i class="bx bx-loader-alt bx-spin"></i> Merging...';

    try {
        const { PDFDocument, rgb, StandardFonts } = PDFLib;
        const mergedPdf = await PDFDocument.create();

        for (let i = 0; i < mergeFiles.length; i++) {
            const item = mergeFiles[i];
            const file = item.file;
            const fname = item.name.toLowerCase();

            statusEl.innerHTML = `
                <div style="font-size:1.4rem; color:var(--text-color); margin-top:0.5rem;">
                    Processing ${i + 1} of ${mergeFiles.length}: <strong>${item.name}</strong>
                    <div style="width:100%; background:var(--bg-color); border:1px solid var(--main-color); border-radius:5px; margin-top:8px; height:8px; overflow:hidden;">
                        <div style="width:${Math.round((i / mergeFiles.length) * 100)}%; background:var(--main-color); height:100%; transition:width 0.3s;"></div>
                    </div>
                </div>`;
            await new Promise(r => setTimeout(r, 30));

            if (fname.endsWith('.pdf')) {
                // PDF: copy all pages directly
                const arrayBuf = await file.arrayBuffer();
                const srcPdf = await PDFDocument.load(arrayBuf, { ignoreEncryption: true });
                const pages = await mergedPdf.copyPages(srcPdf, srcPdf.getPageIndices());
                pages.forEach(p => mergedPdf.addPage(p));

            } else if (fname.endsWith('.docx')) {
                // Word: extract raw text via mammoth, lay out as text pages
                const arrayBuf = await file.arrayBuffer();
                const result = await mammoth.extractRawText({ arrayBuffer: arrayBuf });
                const text = result.value || '';
                const lines = text.split('\n');
                const LINES_PER_PAGE = 45;
                const chunks = [];
                for (let l = 0; l < lines.length; l += LINES_PER_PAGE) {
                    chunks.push(lines.slice(l, l + LINES_PER_PAGE).join('\n'));
                }
                if (chunks.length === 0) chunks.push('');

                const font = await mergedPdf.embedFont(StandardFonts.Helvetica);
                for (const chunk of chunks) {
                    const page = mergedPdf.addPage([595, 842]); // A4
                    page.drawText(chunk || ' ', {
                        x: 50, y: 780,
                        size: 11, font,
                        color: rgb(0.1, 0.1, 0.1),
                        maxWidth: 495,
                        lineHeight: 16,
                    });
                }

            } else {
                // Image (JPEG / PNG): embed and fit to A4
                const arrayBuf = await file.arrayBuffer();
                let embeddedImg;
                if (fname.endsWith('.png')) {
                    embeddedImg = await mergedPdf.embedPng(arrayBuf);
                } else {
                    embeddedImg = await mergedPdf.embedJpg(arrayBuf);
                }
                const { width, height } = embeddedImg.scaleToFit(555, 802);
                const imgPage = mergedPdf.addPage([595, 842]);
                imgPage.drawImage(embeddedImg, {
                    x: (595 - width) / 2,
                    y: (842 - height) / 2,
                    width, height,
                });
            }
        }

        // Final save
        statusEl.innerHTML = `
            <div style="font-size:1.4rem; color:var(--text-color); margin-top:0.5rem;">
                Building final PDF...
                <div style="width:100%; background:var(--bg-color); border:1px solid var(--main-color); border-radius:5px; margin-top:8px; height:8px; overflow:hidden;">
                    <div style="width:100%; background:var(--main-color); height:100%;"></div>
                </div>
            </div>`;
        await new Promise(r => setTimeout(r, 50));

        const mergedBytes = await mergedPdf.save();
        const blob = new Blob([mergedBytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'merged_document.pdf';
        document.body.appendChild(a);
        a.click();

        const totalPages = mergedPdf.getPageCount();
        const sizeMB = (mergedBytes.length / (1024 * 1024)).toFixed(2);

        statusEl.innerHTML = `
            <div style="font-size:1.5rem; color:#28a745; margin-top:0.5rem;">
                <i class='bx bx-check-circle'></i>
                Merged ${mergeFiles.length} file(s) into ${totalPages} page(s) &mdash; ${sizeMB} MB
            </div>`;

        setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(url); }, 200);
        toastr.success('PDF merged and downloaded!');

        btn.innerHTML = '<i class="bx bx-check"></i> Downloaded!';
        setTimeout(closeMergePdfModal, 3000);

    } catch (err) {
        console.error('Merge error:', err);
        toastr.error('Failed to merge: ' + (err.message || err));
        btn.innerHTML = '<i class="bx bx-git-merge"></i> Merge & Download PDF';
        btn.disabled = false;
    }
}
