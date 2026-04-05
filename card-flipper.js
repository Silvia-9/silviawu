/**
 * Card Flipper - Click image to flip to next card
 * Enhanced with smooth animations and visual feedback
 */

document.addEventListener('DOMContentLoaded', function () {
    const container = document.querySelector('.card-flipper-container');
    if (!container) return;

    const flipCards = container.querySelectorAll('.flip-card');
    let currentIndex = 0;
    const totalCards = flipCards.length;

    /**
     * Update the active card with animation
     */
    function updateCards(newIndex) {
        if (newIndex < 0 || newIndex >= totalCards) return;

        currentIndex = newIndex;

        flipCards.forEach((card, index) => {
            card.classList.remove('active', 'prev');

            if (index === currentIndex) {
                card.classList.add('active');
                // Add pulse effect on active card
                card.style.animation = 'none';
                setTimeout(() => {
                    card.style.animation = '';
                }, 10);
            } else if (index < currentIndex) {
                card.classList.add('prev');
            }
        });
    }

    /**
     * Navigate to next card (loop to first if at end)
     */
    function goNext() {
        const nextIndex = (currentIndex + 1) % totalCards;
        updateCards(nextIndex);
    }

    // Make all cards clickable with visual feedback
    flipCards.forEach((card) => {
        card.style.cursor = 'pointer';
        
        card.addEventListener('click', function(e) {
            // Add click feedback
            this.style.transform += ' scale(0.99)';
            setTimeout(() => {
                this.style.transform = this.style.transform.replace(' scale(0.99)', '');
            }, 150);
            
            goNext();
        });

        card.addEventListener('mousedown', function() {
            this.style.filter = 'brightness(0.95)';
        });

        card.addEventListener('mouseup', function() {
            this.style.filter = 'brightness(1)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.filter = 'brightness(1)';
        });
    });

    // Keyboard navigation
    document.addEventListener('keydown', function (event) {
        if (!container.offsetParent) return;
        if (event.key === 'ArrowRight') {
            event.preventDefault();
            goNext();
        }
    });

    // Initialize
    updateCards(0);
});
