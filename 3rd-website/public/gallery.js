document.addEventListener('DOMContentLoaded', () => {
    const photoGrid = document.getElementById('photoGrid');
    const gridFileInput = document.getElementById('gridFileInput');

    // Fetch and Display Photos
    async function fetchPhotos() {
        try {
            const response = await fetch('/api/photos');
            const photos = await response.json();

            if (photos.error) throw new Error(photos.error);

            photoGrid.innerHTML = ''; // Clear loading

            // 1. Render all existing photos
            photos.forEach(photo => {
                const card = document.createElement('div');
                card.className = 'photo-card';
                const viewUrl = `/api/image/${photo.id}`;
                
                if (photo.mimeType && photo.mimeType.startsWith('video/')) {
                    const video = document.createElement('video');
                    video.src = photo.webContentLink || '';
                    video.muted = true;
                    video.poster = viewUrl; 
                    card.appendChild(video);
                    const playIcon = document.createElement('div');
                    playIcon.className = 'play-overlay';
                    playIcon.innerHTML = '<i class="fas fa-play"></i>';
                    card.appendChild(playIcon);
                } else {
                    const img = document.createElement('img');
                    img.src = viewUrl;
                    img.loading = 'lazy';
                    card.appendChild(img);
                }
                
                card.addEventListener('click', () => openLightbox(photo));
                
                // Add Delete Button
                const deleteBtn = document.createElement('button');
                deleteBtn.className = 'delete-btn';
                deleteBtn.innerHTML = '<i class="fas fa-times"></i>';
                deleteBtn.onclick = (e) => {
                    e.stopPropagation();
                    if (confirm('Permanently delete this memory?')) {
                        handleDelete(photo.id, card);
                    }
                };
                card.appendChild(deleteBtn);
                
                photoGrid.appendChild(card);
            });

            // 2. Append the 'Add Memory' card at the end
            const addCard = document.createElement('div');
            addCard.className = 'photo-card add-card';
            addCard.innerHTML = `
                <div class="add-content">
                    <i class="fas fa-plus"></i>
                    <span>Add Memory</span>
                    <small>Click or Drag & Drop</small>
                </div>
                <div class="upload-progress" id="gridUploadProgress"></div>
            `;
            
            addCard.addEventListener('click', () => gridFileInput.click());
            
            // Drag and Drop for the Add Card
            ['dragover', 'dragenter'].forEach(evt => {
                addCard.addEventListener(evt, (e) => {
                    e.preventDefault();
                    addCard.classList.add('drag-active');
                });
            });

            ['dragleave', 'dragend', 'drop'].forEach(evt => {
                addCard.addEventListener(evt, (e) => {
                    e.preventDefault();
                    addCard.classList.remove('drag-active');
                    if (evt === 'drop') {
                        const files = e.dataTransfer.files;
                        if (files.length) handleFileUpload(files[0]);
                    }
                });
            });

            photoGrid.appendChild(addCard);

        } catch (error) {
            console.error('Fetch error:', error);
            photoGrid.innerHTML = '<div class="loading-spinner" style="color: red;">Failed to load gallery.</div>';
        }
    }

    // Handle File selection
    gridFileInput.addEventListener('change', () => {
        if (gridFileInput.files.length) {
            handleFileUpload(gridFileInput.files[0]);
        }
    });

    async function handleFileUpload(file) {
        const addCard = document.querySelector('.add-card');
        const progressDiv = document.getElementById('gridUploadProgress');
        
        const formData = new FormData();
        formData.append('photo', file);

        // UI Loading
        addCard.classList.add('uploading');
        addCard.style.pointerEvents = 'none';
        progressDiv.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Uploading...';

        try {
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });
            const result = await response.json();
            if (result.success) {
                progressDiv.innerHTML = 'Success!';
                setTimeout(fetchPhotos, 1000);
            } else {
                throw new Error(result.error);
            }
        } catch (error) {
            alert('Upload failed: ' + error.message);
            addCard.classList.remove('uploading');
            addCard.style.pointerEvents = 'auto';
            progressDiv.innerHTML = '';
        }
    }

    // --- Lightbox Modal Logic ---
    const modal = document.getElementById('photoModal');
    const modalMedia = document.getElementById('modalMediaContainer');
    const closeModal = document.querySelector('.close-modal');

    function openLightbox(photo) {
        modalMedia.innerHTML = '';
        if (photo.mimeType && photo.mimeType.startsWith('video/')) {
            const video = document.createElement('video');
            video.src = photo.webContentLink || '';
            video.controls = true;
            video.autoplay = true;
            modalMedia.appendChild(video);
        } else {
            const img = document.createElement('img');
            img.src = `/api/image/${photo.id}`;
            modalMedia.appendChild(img);
        }
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        modalMedia.innerHTML = '';
    }

    closeModal.addEventListener('click', closeLightbox);
    modal.addEventListener('click', (e) => { if (e.target === modal) closeLightbox(); });

    async function handleDelete(fileId, element) {
        try {
            const response = await fetch('/api/delete-photo', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fileId })
            });
            const result = await response.json();
            if (result.success) {
                element.style.opacity = '0';
                element.style.transform = 'scale(0.8)';
                setTimeout(() => element.remove(), 300);
            } else {
                alert('Delete failed: ' + result.error);
            }
        } catch (error) {
            console.error('Delete error:', error);
            alert('An error occurred while deleting.');
        }
    }

    fetchPhotos();
});
