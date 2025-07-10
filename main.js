// Main JavaScript file for performance optimization
document.addEventListener('DOMContentLoaded', function () {
    // Register Service Worker for mobile performance
    if ('serviceWorker' in navigator && window.location.protocol === 'https:') {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('SW registered successfully');
            })
            .catch((error) => {
                console.log('SW registration failed');
            });
    }

    // Google Analytics page tracking
    if (typeof gtag !== 'undefined') {
        // Track page view with custom page title
        const pageTitle = document.title;
        const pagePath = window.location.pathname;
        
        gtag('config', 'G-BBHT40SPSV', {
            page_title: pageTitle,
            page_location: window.location.href,
            page_path: pagePath
        });
        
        // Send custom page view event
        gtag('event', 'page_view', {
            page_title: pageTitle,
            page_location: window.location.href,
            page_path: pagePath
        });
    }

    // Mobile-optimized iframe lazy loading with Intersection Observer
    const iframes = document.querySelectorAll('iframe[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const iframeObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const iframe = entry.target;
                    // Only load iframe when it's about to be visible
                    if (!iframe.dataset.loaded) {
                        iframe.dataset.loaded = 'true';
                        // Add mobile-specific parameters for better performance
                        if (window.innerWidth <= 768) {
                            iframe.style.height = '350px'; // Smaller height on mobile
                        }
                    }
                    observer.unobserve(iframe);
                }
            });
        }, {
            rootMargin: '100px 0px', // Load when 100px before entering viewport
            threshold: 0.1
        });
        
        iframes.forEach(iframe => {
            iframeObserver.observe(iframe);
        });
    }

    // Initialize flatpickr with the custom date format and English locale
    if (typeof flatpickr !== 'undefined') {
        flatpickr("#date-picker", {
            dateFormat: "M, d, Y",  // Format the date as "Jan, 16, 2024"
            altInput: true,         // Show alternative format in the input field
            locale: "en"            // Force the calendar to be in English
        });
    }

    // Form handling with improved UX
    const form = document.getElementById('myForm');
    if (form) {
        const submitBtn = form.querySelector('.submit-btn');
        const btnText = submitBtn?.querySelector('.btn-text');
        const btnLoading = submitBtn?.querySelector('.btn-loading');

        // Add form validation styling
        function addValidationStyling() {
            const inputs = form.querySelectorAll('input, textarea, select');
            inputs.forEach(input => {
                input.addEventListener('invalid', function(e) {
                    e.preventDefault();
                    this.classList.add('error');
                    const helpText = document.getElementById(this.getAttribute('aria-describedby'));
                    if (helpText) {
                        helpText.style.color = '#e74c3c';
                        helpText.textContent = this.validationMessage;
                    }
                });
                
                input.addEventListener('input', function() {
                    if (this.validity.valid) {
                        this.classList.remove('error');
                        const helpText = document.getElementById(this.getAttribute('aria-describedby'));
                        if (helpText) {
                            helpText.style.color = '';
                            // Reset to original help text
                            if (this.id === 'date-picker') helpText.textContent = 'Select the date you\'re submitting this message';
                            if (this.id === 'first_name') helpText.textContent = 'Enter your first name';
                            if (this.id === 'last_name') helpText.textContent = 'Enter your last name';
                            if (this.id === 'email') helpText.textContent = 'Enter your email address for response';
                            if (this.id === 'telephone') helpText.textContent = 'Optional: Your phone number';
                            if (this.id === 'country') helpText.textContent = 'Select your country';
                            if (this.id === 'bio') helpText.textContent = 'Write your message or feedback';
                        }
                    }
                });
            });
        }

        addValidationStyling();

        form.addEventListener('submit', async function (event) {
            event.preventDefault();  // Prevent form from submitting automatically

            // Check if the form is valid
            if (!form.checkValidity()) {
                form.reportValidity();  // Show validation messages
                return;  // Exit to prevent form submission
            }

            // Show loading state
            if (submitBtn && btnText && btnLoading) {
                submitBtn.disabled = true;
                btnText.style.display = 'none';
                btnLoading.style.display = 'inline';
            }

            // If the form is valid, collect the form data
            const data = {
                date: document.getElementById('date-picker')?.value || '',
                first_name: document.getElementById('first_name')?.value?.trim() || '',
                last_name: document.getElementById('last_name')?.value?.trim() || '',
                email: document.getElementById('email')?.value?.trim() || '',
                telephone: document.getElementById('telephone')?.value?.trim() || '',
                country: document.getElementById('country')?.value || '',
                bio: document.getElementById('bio')?.value?.trim() || '',
                timestamp: new Date().toISOString(),
                source: 'homepage_form'
            };

            try {
                const response = await fetch('https://sheetdb.io/api/v1/zxuvhmfu8aghd', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)   // Send data directly (no "data" wrapper)
                });

                // Log response
                const responseData = await response.json();

                if (response.ok) {
                    // Success feedback with better UX
                    const successMsg = document.createElement('div');
                    successMsg.className = 'success-message';
                    successMsg.innerHTML = '✅ Your message has been sent successfully! Thank you for reaching out.';
                    form.insertBefore(successMsg, form.firstChild);
                    form.reset();  // Reset the form after successful submission
                    
                    // Track successful form submission
                    if (typeof gtag !== 'undefined') {
                        gtag('event', 'form_submit', {
                            event_category: 'Contact',
                            event_label: 'Homepage Contact Form Success',
                            value: 1
                        });
                    }
                    
                    // Remove success message after 5 seconds
                    setTimeout(() => {
                        if (successMsg.parentNode) {
                            successMsg.parentNode.removeChild(successMsg);
                        }
                    }, 5000);
                } else {
                    throw new Error('Server response was not ok');
                }
            } catch (error) {
                console.error('Error:', error);
                const errorMsg = document.createElement('div');
                errorMsg.className = 'error-message';
                errorMsg.innerHTML = '❌ There was an error sending your message. Please try again or use the contact page.';
                form.insertBefore(errorMsg, form.firstChild);
                
                // Remove error message after 7 seconds
                setTimeout(() => {
                    if (errorMsg.parentNode) {
                        errorMsg.parentNode.removeChild(errorMsg);
                    }
                }, 7000);
            } finally {
                // Reset button state
                if (submitBtn && btnText && btnLoading) {
                    submitBtn.disabled = false;
                    btnText.style.display = 'inline';
                    btnLoading.style.display = 'none';
                }
            }
        });
    }

    // Enhanced navigation tracking
    const navLinks = document.querySelectorAll('nav a, .navbutton');
    navLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            if (typeof gtag !== 'undefined') {
                const linkText = this.textContent.trim();
                const linkUrl = this.href;
                
                gtag('event', 'click', {
                    event_category: 'Navigation',
                    event_label: linkText,
                    page_location: linkUrl
                });
            }
        });
    });

    // Photo gallery scroll functionality with mobile touch support removed (no scroll arrows, no JS scroll interference)
    
    // Mobile performance optimizations
    if (window.innerWidth <= 768) {
        // Reduce animation duration on mobile for better performance
        const logo = document.getElementById('logo');
        if (logo) {
            logo.style.animationDuration = '1s';
        }
        
        // Optimize form inputs for mobile
        const formInputs = document.querySelectorAll('input, textarea, select');
        formInputs.forEach(input => {
            // Prevent zoom on focus for iOS
            input.addEventListener('focus', function() {
                if (window.innerWidth <= 768) {
                    const viewport = document.querySelector('meta[name="viewport"]');
                    if (viewport) {
                        viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
                    }
                }
            });
            
            input.addEventListener('blur', function() {
                if (window.innerWidth <= 768) {
                    const viewport = document.querySelector('meta[name="viewport"]');
                    if (viewport) {
                        viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, viewport-fit=cover');
                    }
                }
            });
        });
    }

    // Read more/less functionality
    const readMoreButtons = document.querySelectorAll('.read-more-btn');
    readMoreButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            const moreText = document.getElementById(targetId);
            
            if (moreText) {
                if (moreText.style.display === "none" || moreText.style.display === "") {
                    moreText.style.display = "block";
                    this.textContent = "Read less";
                } else {
                    moreText.style.display = "none";
                    this.textContent = "Read more";
                }
            }
        });
    });
    
    // Initialize the more-text elements to be hidden
    const moreTextElements = document.querySelectorAll('.more-text');
    moreTextElements.forEach(element => {
        element.style.display = 'none';
    });
});
