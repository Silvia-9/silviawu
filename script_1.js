    function scrollGallery(direction) {
        const gallery = document.querySelector('.photo-gallery');
        const scrollAmount = 300; // Adjust this value as needed

        if (direction === 'left') {
            gallery.scrollBy({
                left: -scrollAmount,
                behavior: 'smooth'
            });
        } else if (direction === 'right') {
            gallery.scrollBy({
                left: scrollAmount,
                behavior: 'smooth'
            });
        }
    }


