document.addEventListener('DOMContentLoaded', function() {
    // Language dropdown functionality
    const languageBtn = document.getElementById('language-btn');
    const languageMenu = document.getElementById('language-menu');
    const languageOptions = document.querySelectorAll('.language-option');
    
    if (languageBtn && languageMenu) {
        // Handle language selection
        languageOptions.forEach(option => {
            option.addEventListener('click', function() {
                const lang = this.getAttribute('data-lang');
                const langText = this.querySelector('.lang-text').textContent;
                const langIcon = this.querySelector('.lang-icon').textContent;
                
                // Update button text and icon
                languageBtn.querySelector('.lang-text').textContent = langText;
                languageBtn.querySelector('.lang-icon').textContent = langIcon;
                
                // Update active class
                languageOptions.forEach(opt => opt.classList.remove('active'));
                this.classList.add('active');
                
                console.log(`Language changed to: ${lang}`);
                // In a real implementation, this would change the language of the site
            });
        });
    }
    // Tabs functionality
    const tabHeaders = document.querySelectorAll('.tab-header');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabHeaders.forEach(header => {
        header.addEventListener('click', () => {
            // Remove active class from all headers and contents
            tabHeaders.forEach(h => h.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked header
            header.classList.add('active');
            
            // Show corresponding content
            const tabId = header.getAttribute('data-tab');
            document.getElementById(`${tabId}-tab`).classList.add('active');
        });
    });
    
    // Accordion functionality
    const accordionItems = document.querySelectorAll('.accordion-item');
    
    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header');
        
        header.addEventListener('click', () => {
            // Toggle active class
            item.classList.toggle('active');
        });
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Account for fixed header
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Form submission handling with Supabase integration
    const forms = document.querySelectorAll('.beta-form, .contact-form');
    
    forms.forEach(form => {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(form);
            let formValues = {
                created_at: new Date().toISOString()
            };
            
            // If it's a tab-content form, add the type
            const tabContent = form.closest('.tab-content');
            if (tabContent) {
                formValues.type = tabContent.id.replace('-tab', '');
            } else if (form.classList.contains('misterfy-style')) {
                formValues.type = 'partner-application';
            }
            
            for (let [key, value] of formData.entries()) {
                formValues[key] = value;
            }
            
            console.log('Form submitted:', formValues);
            
            try {
                // Submit to Supabase if API is available
                if (window.xBankAPI && window.xBankAPI.saveContactForm) {
                    const { success, error } = await window.xBankAPI.saveContactForm(formValues);
                    
                    if (!success) {
                        console.error('Error submitting form:', error);
                        alert('There was an error submitting your form. Please try again.');
                        return;
                    }
                }
                
                // Replace form with success message
                const successMessage = document.createElement('div');
                successMessage.className = 'success-message';
                successMessage.innerHTML = `
                    <h3>Thank you for your request!</h3>
                    <p>We will contact you soon.</p>
                `;
                
                form.innerHTML = '';
                form.appendChild(successMessage);
            } catch (err) {
                console.error('Exception when submitting form:', err);
                alert('There was an error submitting your form. Please try again.');
            }
        });
    });
    
    // Add animation on scroll
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.feature-card, .advantage-card, .step, .accordion-item');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.3;
            
            if (elementPosition < screenPosition) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };
    
    // Set initial state for animation
    const elementsToAnimate = document.querySelectorAll('.feature-card, .advantage-card, .step, .accordion-item');
    elementsToAnimate.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });
    
    // Run animation on load and scroll
    window.addEventListener('load', animateOnScroll);
    window.addEventListener('scroll', animateOnScroll);
});
