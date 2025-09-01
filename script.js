class PDFMerger {
    constructor() {
        this.files = [];
        this.maxFileSize = 50 * 1024 * 1024; // 50MB per fil
        this.maxTotalSize = 200 * 1024 * 1024; // 200MB totalt
        this.maxFiles = 20; // Maksimum 20 filer
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupDragAndDrop();
        this.setupSortable();
    }

    setupEventListeners() {
        const fileInput = document.getElementById('fileInput');
        fileInput.addEventListener('change', (e) => this.handleFileSelect(e.target.files));
    }

    setupDragAndDrop() {
        const uploadArea = document.getElementById('uploadArea');

        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('dragover');
        });

        uploadArea.addEventListener('dragleave', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
        });

        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
            const files = Array.from(e.dataTransfer.files).filter(file => file.type === 'application/pdf');
            this.handleFileSelect(files);
        });
    }

    setupSortable() {
        const fileList = document.getElementById('fileList');
        CustomSortable.create(fileList, {
            animation: 150,
            ghostClass: 'sortable-ghost',
            onEnd: (evt) => {
                // Update the files array based on new order
                const movedFile = this.files.splice(evt.oldIndex, 1)[0];
                this.files.splice(evt.newIndex, 0, movedFile);
            }
        });
    }

    handleFileSelect(fileList) {
        const files = Array.from(fileList);
        const pdfFiles = files.filter(file => file.type === 'application/pdf');

        if (pdfFiles.length !== files.length) {
            this.showStatus('Bare PDF-filer er tillatt!', 'error');
        }

        // Sjekk individuelle filstørrelser og totalt antall
        for (const file of pdfFiles) {
            if (file.size > this.maxFileSize) {
                this.showStatus(`Filen "${file.name}" er for stor (${this.formatFileSize(file.size)}). Maksimal filstørrelse er ${this.formatFileSize(this.maxFileSize)}.`, 'error');
                continue;
            }

            if (this.files.length >= this.maxFiles) {
                this.showStatus(`Kan ikke legge til flere filer. Maksimalt ${this.maxFiles} filer er tillatt.`, 'error');
                break;
            }

            if (!this.files.some(existingFile => 
                existingFile.name === file.name && existingFile.size === file.size)) {
                this.files.push(file);
            }
        }

        // Sjekk total størrelse
        const totalSize = this.files.reduce((sum, file) => sum + file.size, 0);
        if (totalSize > this.maxTotalSize) {
            this.showStatus(`Total filstørrelse (${this.formatFileSize(totalSize)}) overstiger grensen på ${this.formatFileSize(this.maxTotalSize)}. Fjern noen filer.`, 'error');
        }

        this.updateFileList();
        this.updateMergeButton();
    }

    updateFileList() {
        const fileList = document.getElementById('fileList');
        
        if (this.files.length === 0) {
            fileList.innerHTML = '<div class="empty-state">Ingen filer valgt. Velg PDF-filer som skal slås sammen.</div>';
            return;
        }

        fileList.innerHTML = this.files.map((file, index) => `
            <div class="file-item" data-index="${index}">
                <div class="file-info">
                    <span class="drag-handle">⋮⋮</span>
                    <span class="file-icon">📄</span>
                    <span class="file-name">${this.escapeHtml(file.name)}</span>
                    <span class="file-size">(${this.formatFileSize(file.size)})</span>
                </div>
                <button class="remove-btn" onclick="pdfMerger.removeFile(${index})">×</button>
            </div>
        `).join('');
        
        // Re-initialize sortable functionality for new items
        this.initializeSortableItems();
    }

    initializeSortableItems() {
        const fileList = document.getElementById('fileList');
        const items = fileList.querySelectorAll('.file-item');
        items.forEach((item, index) => {
            item.draggable = true;
            item.dataset.index = index;
        });
    }

    removeFile(index) {
        this.files.splice(index, 1);
        this.updateFileList();
        this.updateMergeButton();
    }

    clearFiles() {
        this.files = [];
        this.updateFileList();
        this.updateMergeButton();
        this.hideStatus();
    }

    updateMergeButton() {
        const mergeBtn = document.getElementById('mergeBtn');
        const totalSize = this.files.reduce((sum, file) => sum + file.size, 0);
        
        const isDisabled = this.files.length < 2 || totalSize > this.maxTotalSize;
        mergeBtn.disabled = isDisabled;
        
        if (totalSize > this.maxTotalSize) {
            mergeBtn.title = `Total størrelse (${this.formatFileSize(totalSize)}) overstiger grensen`;
        } else if (this.files.length < 2) {
            mergeBtn.title = 'Velg minst 2 filer';
        } else {
            mergeBtn.title = `Klar til å slå sammen ${this.files.length} filer (${this.formatFileSize(totalSize)})`;
        }
    }

    async mergePDFs() {
        if (this.files.length < 2) {
            this.showStatus('Velg minst 2 PDF-filer for å slå dem sammen.', 'error');
            return;
        }

        const totalSize = this.files.reduce((sum, file) => sum + file.size, 0);
        if (totalSize > this.maxTotalSize) {
            this.showStatus(`Total filstørrelse (${this.formatFileSize(totalSize)}) er for stor. Maksimal størrelse er ${this.formatFileSize(this.maxTotalSize)}.`, 'error');
            return;
        }

        const mergeBtn = document.getElementById('mergeBtn');
        const progressBar = document.getElementById('progressBar');
        const progressFill = document.getElementById('progressFill');

        // Vis advarsel for store filer
        if (totalSize > 50 * 1024 * 1024) { // 50MB
            const proceed = confirm(`Du er i ferd med å behandle ${this.formatFileSize(totalSize)} data. Dette kan ta lang tid og bruke mye minne. Fortsette?`);
            if (!proceed) return;
        }

        try {
            mergeBtn.disabled = true;
            mergeBtn.innerHTML = 'Slår sammen...';
            progressBar.style.display = 'block';
            this.hideStatus();

            // Create a new PDF document
            const mergedPdf = await PDFLib.PDFDocument.create();
            let processedSize = 0;

            // Process each file
            for (let i = 0; i < this.files.length; i++) {
                const file = this.files[i];
                const progress = ((i + 1) / this.files.length) * 100;
                progressFill.style.width = `${progress}%`;

                try {
                    console.log(`Behandler fil ${i + 1}/${this.files.length}: ${file.name} (${this.formatFileSize(file.size)})`);
                    
                    const arrayBuffer = await file.arrayBuffer();
                    const pdf = await PDFLib.PDFDocument.load(arrayBuffer);
                    const pageCount = pdf.getPageCount();
                    
                    if (pageCount > 100) {
                        console.warn(`Stor PDF: ${file.name} har ${pageCount} sider`);
                    }
                    
                    const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
                    pages.forEach((page) => mergedPdf.addPage(page));
                    
                    processedSize += file.size;
                    console.log(`Behandlet: ${this.formatFileSize(processedSize)}/${this.formatFileSize(totalSize)}`);
                    
                } catch (error) {
                    console.error(`Error processing file ${file.name}:`, error);
                    throw new Error(`Kunne ikke behandle "${file.name}". ${error.message || 'Sørg for at det er en gyldig PDF-fil.'}`);
                }
            }

            console.log('Genererer sammenslått PDF...');
            const mergedPdfBytes = await mergedPdf.save();
            console.log(`Sammenslått PDF generert: ${this.formatFileSize(mergedPdfBytes.length)}`);

            // Create download link
            const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            const downloadLink = document.createElement('a');
            downloadLink.href = url;
            downloadLink.download = `sammensatt-${Date.now()}.pdf`;
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
            URL.revokeObjectURL(url);

            this.showStatus(`Vellykket! Slo sammen ${this.files.length} PDF-filer til ${this.formatFileSize(mergedPdfBytes.length)}.`, 'success');

        } catch (error) {
            console.error('Merge error:', error);
            let errorMessage = 'Ukjent feil oppstod under sammenslåing.';
            
            if (error.message.includes('OutOfMemoryError') || error.message.includes('memory')) {
                errorMessage = 'Ikke nok minne tilgjengelig. Prøv med færre eller mindre filer.';
            } else if (error.message.includes('Invalid PDF')) {
                errorMessage = 'En av filene er ikke en gyldig PDF.';
            } else if (error.message.includes('timeout')) {
                errorMessage = 'Operasjonen tok for lang tid. Prøv med mindre filer.';
            } else if (error.message) {
                errorMessage = error.message;
            }
            
            this.showStatus(`Feil: ${errorMessage}`, 'error');
        } finally {
            mergeBtn.disabled = false;
            mergeBtn.innerHTML = 'Slå sammen PDF-er';
            progressBar.style.display = 'none';
            progressFill.style.width = '0%';
        }
    }

    showStatus(message, type) {
        const statusMessage = document.getElementById('statusMessage');
        statusMessage.textContent = message;
        statusMessage.className = `status-message status-${type}`;
        statusMessage.style.display = 'block';

        if (type === 'success') {
            setTimeout(() => this.hideStatus(), 5000);
        }
    }

    hideStatus() {
        const statusMessage = document.getElementById('statusMessage');
        statusMessage.style.display = 'none';
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 bytes';
        const k = 1024;
        const sizes = ['bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, (m) => map[m]);
    }
}

// Global functions for event handlers
function mergePDFs() {
    pdfMerger.mergePDFs();
}

function clearFiles() {
    pdfMerger.clearFiles();
}

// Initialize the PDF merger when the page loads
let pdfMerger;
document.addEventListener('DOMContentLoaded', () => {
    pdfMerger = new PDFMerger();
});

// Handle file input changes
document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('fileInput');
    fileInput.addEventListener('change', (e) => {
        if (pdfMerger) {
            pdfMerger.handleFileSelect(e.target.files);
        }
    });
});