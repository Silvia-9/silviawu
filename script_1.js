function scrollGallery(direction) {
    const gallery = document.querySelector('.photo-gallery');
    const scrollAmount = 200; // Adjust the amount of scroll per click
    const currentScroll = gallery.scrollLeft;

    if (direction === 'left') {
        gallery.scrollLeft = currentScroll - scrollAmount;
    } else if (direction === 'right') {
        gallery.scrollLeft = currentScroll + scrollAmount;
    }
}

