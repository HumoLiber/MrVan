document.addEventListener('DOMContentLoaded', function() {
    // Language dropdown functionality - видалено оскільки селектор мов було приховано
    
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
    const forms = document.querySelectorAll('.beta-form');
    
    forms.forEach(form => {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(form);
            const formType = form.closest('.tab-content').id.replace('-tab', '');
            let formValues = {
                type: formType,
                created_at: new Date().toISOString()
            };
            
            for (let [key, value] of formData.entries()) {
                formValues[key] = value;
            }
            
            console.log('Form submitted:', formValues);
            
            try {
                let result;
                
                // Submit to Supabase based on form type
                if (window.PrimaveravanAPI) {
                    // Обробляємо різні типи форм
                    switch (formType) {
                        case 'client':
                            // Клієнт - зберігаємо як лід
                            result = await window.PrimaveravanAPI.saveLead(formValues);
                            break;
                            
                        case 'bank':
                        case 'investor':
                        case 'vibe-coder':
                            // Партнери, інвестори, розробники - зберігаємо як ліди
                            result = await window.PrimaveravanAPI.saveLead(formValues);
                            break;
                            
                        default:
                            // Інші типи форм зберігаємо як контакти
                            result = await window.PrimaveravanAPI.saveContactForm(formValues);
                    }
                    
                    if (!result || !result.success) {
                        console.error('Error submitting form:', result?.error || 'Unknown error');
                        alert('Виникла помилка при відправці форми. Будь ласка, спробуйте ще раз.');
                        return;
                    }
                } else {
                    console.warn('PrimaveravanAPI не знайдено. Дані не будуть збережені.');
                }
                
                // Replace form with success message
                const successMessage = document.createElement('div');
                successMessage.className = 'success-message';
                
                // Різні повідомлення для різних типів форм
                let thankYouMessage, contactMessage;
                
                switch (formType) {
                    case 'client':
                        thankYouMessage = 'Thank you for your application!';
                        contactMessage = 'We will contact you soon about your camper van booking.';
                        break;
                    case 'bank':
                        thankYouMessage = 'Thank you for your application!';
                        contactMessage = 'Our team will contact you soon to discuss festival partnership opportunities.';
                        break;
                    case 'investor':
                        thankYouMessage = 'Thank you for your application!';
                        contactMessage = 'Our team will contact you soon to discuss partnership opportunities.';
                        break;
                    case 'vibe-coder':
                        thankYouMessage = 'Welcome to our Travel Influencer network!';
                        contactMessage = 'We will contact you soon with details about collaboration opportunities on Primaveravan promotions.';
                        break;
                    default:
                        thankYouMessage = 'Thank you for your inquiry!';
                        contactMessage = 'We will contact you soon.';
                }
                
                successMessage.innerHTML = `
                    <h3>${thankYouMessage}</h3>
                    <p class="text-center">${contactMessage}</p>
                `;
                
                form.innerHTML = '';
                form.appendChild(successMessage);
            } catch (err) {
                console.error('Exception when submitting form:', err);
                alert('Виникла помилка при відправці форми. Будь ласка, спробуйте ще раз.');
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
    
    // Ініціалізація таблиць Supabase при завантаженні сторінки
    window.addEventListener('load', async function() {
        if (window.PrimaveravanAPI && window.PrimaveravanAPI.initializeTables) {
            console.log('Перевірка та ініціалізація таблиць Supabase...');
            const result = await window.PrimaveravanAPI.initializeTables();
            console.log('Результат ініціалізації таблиць:', result);
        }
    });
});
