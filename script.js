
document.addEventListener("DOMContentLoaded", function () {
    // Get the left and right buttons
    const leftArrow = document.querySelector('.scroll-arrow.left');
    const rightArrow = document.querySelector('.scroll-arrow.right');
    const gallery = document.querySelector('.photo-gallery');
    
    // Check for null, and if not present, console log error (just for debugging)
    if (!gallery || !leftArrow || !rightArrow) {
        console.error("Could not find photo gallery or scroll arrows!");
        return;
    }

    // Scroll left function
    leftArrow.addEventListener('click', () => {
        gallery.scrollBy({
            left: -200,  // Scroll amount (can be adjusted as necessary)
            behavior: 'smooth'  // Smooth scrolling
        });
    });

    // Scroll right function
    rightArrow.addEventListener('click', () => {
        gallery.scrollBy({
            left: 200,  // Scroll amount (can be adjusted as necessary)
            behavior: 'smooth'  // Smooth scrolling
        });
    });
});
