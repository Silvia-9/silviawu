const scrollContainer = document.querySelector('.photo-gallery');
const leftArrow = document.querySelector('.scroll-arrow.left');
const rightArrow = document.querySelector('.scroll-arrow.right');

const imageWidth = 165; // Width of one image (150px + 15px margin)
const visibleImages = 8; // Number of images visible at a time
const scrollAmount = imageWidth * visibleImages; // Scroll amount to display eight new images

leftArrow.addEventListener('click', () => {
    scrollContainer.scrollBy({
        left: -scrollAmount,
        behavior: 'smooth',
    });
});

rightArrow.addEventListener('click', () => {
    scrollContainer.scrollBy({
        left: scrollAmount,
        behavior: 'smooth',
    });
});
