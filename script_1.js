function scrollLeft() {
    const gallery = document.querySelector('.photo-gallery');
    gallery.scrollBy({
        left: -300, // Scroll left by 300px
        behavior: 'smooth',
    });
}

function scrollRight() {
    const gallery = document.querySelector('.photo-gallery');
    gallery.scrollBy({
        left: 300, // Scroll right by 300px
        behavior: 'smooth',
    });
}
