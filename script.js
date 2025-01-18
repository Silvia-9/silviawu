document.addEventListener('DOMContentLoaded', () => {
    const scrollContainer = document.querySelector('.photo-gallery');
    const leftArrow = document.querySelector('.scroll-arrow.left');
    const rightArrow = document.querySelector('.scroll-arrow.right');

    const imageWidth = 150; // Width of one image
    const imageMargin = 15; // Margin between images
    const visibleImages = 8; // Number of images visible at a time
    const totalImages = 12; // Total number of images
    const scrollAmount = imageWidth + imageMargin; // Scroll amount for one image

    let currentIndex = 0; // Track the current scroll position

    // Event listener for the left arrow
    leftArrow.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            scrollContainer.scrollBy({
                left: -scrollAmount,
                behavior: 'smooth',
            });
        }
    });

    // Event listener for the right arrow
    rightArrow.addEventListener('click', () => {
        if (currentIndex < totalImages - visibleImages) {
            currentIndex++;
            scrollContainer.scrollBy({
                left: scrollAmount,
                behavior: 'smooth',
            });
        }
    });
});
