// language-switcher.js - Optimized version with additional features

// Constants for better code readability
const STORAGE_KEY = 'primaveravan-language';
const DEFAULT_LANG = 'en';
const SUPPORTED_LANGUAGES = ['en', 'fr', 'ua', 'ca', 'es', 'pl', 'ru'];

// Cached DOM elements to improve performance
let cachedElements = null;

// Wait for the DOM to be fully loaded before executing
document.addEventListener('DOMContentLoaded', function() {
  // Initialize the language system
  initLanguageSystem();
  
  // Event listener for language dropdown toggle
  const langBtn = document.getElementById('language-btn');
  const langMenu = document.getElementById('language-menu');
  
  if (langBtn && langMenu) {
    langBtn.addEventListener('click', function() {
      langMenu.classList.toggle('show');
    });
  
    // Close the dropdown when clicking outside
    document.addEventListener('click', function(event) {
      if (!langBtn.contains(event.target) && !langMenu.contains(event.target)) {
        langMenu.classList.remove('show');
      }
    });
  
    // Set up language selection
    const langOptions = document.querySelectorAll('.language-option');
    langOptions.forEach(option => {
      option.addEventListener('click', function() {
        const lang = this.getAttribute('data-lang');
        if (!lang || !isLanguageSupported(lang)) return;
        
        // Update active class
        langOptions.forEach(opt => opt.classList.remove('active'));
        this.classList.add('active');
        
        // Update button text/icon
        updateButtonDisplay(langBtn, this);
        
        // Apply the selected language
        setLanguage(lang);
        
        // Update URL if needed
        updateUrlWithLanguage(lang);
        
        // Close the dropdown
        langMenu.classList.remove('active');
      });
    });
  }
});

// Initialize the language system
function initLanguageSystem() {
  // Check if translations are loaded
  if (typeof translations === 'undefined') {
    console.error('Translations not loaded. Make sure translations.js is included before this script.');
    return;
  }
  
  // Check URL for language parameter
  const urlParams = new URLSearchParams(window.location.search);
  const urlLang = urlParams.get('lang');
  
  // Language selection priority: URL > localStorage > browser > English
  let selectedLang;
  
  if (urlLang && isLanguageSupported(urlLang)) {
    // Language is specified in URL and supported
    selectedLang = urlLang;
    
    // Update localStorage to save the choice
    localStorage.setItem(STORAGE_KEY, selectedLang);
  } else {
    // Get from localStorage or determine from browser
    selectedLang = localStorage.getItem(STORAGE_KEY);
    
    if (!selectedLang || !isLanguageSupported(selectedLang)) {
      // Try to detect browser language
      selectedLang = getBrowserLanguage();
      
      if (!isLanguageSupported(selectedLang)) {
        // If browser language is not supported, use English
        selectedLang = DEFAULT_LANG;
      }
    }
  }
  
  // Apply the selected language
  setLanguage(selectedLang);
  updateLanguageUI(selectedLang);
}

// Updates the language button display
function updateButtonDisplay(button, selectedOption) {
  const btnIcon = button.querySelector('.lang-icon');
  const btnText = button.querySelector('.lang-text');
  const selectedIcon = selectedOption.querySelector('.lang-icon');
  const selectedText = selectedOption.querySelector('.lang-text');
  
  if (btnIcon && btnText && selectedIcon && selectedText) {
    btnIcon.className = selectedIcon.className;
    btnIcon.textContent = selectedIcon.textContent;
    btnText.textContent = selectedText.textContent;
  }
}

// Set the page language and update all text elements
function setLanguage(lang) {
  // Cache elements on first call to improve performance
  if (!cachedElements) {
    cachedElements = {
      textElements: document.querySelectorAll('[data-i18n]'),
      placeholderElements: document.querySelectorAll('[data-i18n-placeholder]'),
      selectElements: document.querySelectorAll('option[data-i18n]')
    };
  }
  
  // Save the language preference
  localStorage.setItem(STORAGE_KEY, lang);
  
  // Set the lang attribute for HTML
  document.documentElement.setAttribute('lang', lang);
  
  // Get the translations for the selected language
  const trans = translations[lang] || translations[DEFAULT_LANG]; // Fallback to English
  
  // Update page title
  const titleElement = document.querySelector('title');
  if (titleElement && titleElement.getAttribute('data-i18n')) {
    const titleKey = titleElement.getAttribute('data-i18n');
    if (trans[titleKey]) {
      titleElement.textContent = trans[titleKey];
    }
  }
  
  // Update all elements with 'data-i18n' attribute
  cachedElements.textElements.forEach(element => {
    const key = element.getAttribute('data-i18n');
    if (trans[key]) {
      element.textContent = trans[key];
    }
  });
  
  // Update all elements with 'data-i18n-placeholder' attribute
  cachedElements.placeholderElements.forEach(element => {
    const key = element.getAttribute('data-i18n-placeholder');
    if (trans[key]) {
      element.setAttribute('placeholder', trans[key]);
    }
  });
  
  // Update all select options with 'data-i18n' attribute
  cachedElements.selectElements.forEach(option => {
    const key = option.getAttribute('data-i18n');
    if (trans[key]) {
      option.textContent = trans[key];
    }
  });
  
  // Dispatch language change event
  document.dispatchEvent(new CustomEvent('languageChanged', { detail: { language: lang }}));
}

// Update the language selector UI to reflect current language
function updateLanguageUI(lang) {
  const langBtn = document.getElementById('language-btn');
  const langOptions = document.querySelectorAll('.language-option');
  
  if (langBtn && langOptions) {
    // Update active class on language options
    langOptions.forEach(option => {
      const optionLang = option.getAttribute('data-lang');
      if (optionLang === lang) {
        option.classList.add('active');
        
        // Update button display
        updateButtonDisplay(langBtn, option);
      } else {
        option.classList.remove('active');
      }
    });
  }
}

// Function to check if a language is supported
function isLanguageSupported(lang) {
  return SUPPORTED_LANGUAGES.includes(lang);
}

// Function to determine browser language
function getBrowserLanguage() {
  // Get language from navigator.language (e.g., 'en-US', 'ru', 'fr')
  const fullLang = navigator.language || navigator.userLanguage || DEFAULT_LANG;
  // Take only the first part of the code (e.g., 'en' from 'en-US')
  return fullLang.split('-')[0];
}

// Function to update URL with language parameter
function updateUrlWithLanguage(lang) {
  // Don't change URL if not needed
  if (!shouldUpdateUrlWithLang()) return;
  
  const url = new URL(window.location.href);
  url.searchParams.set('lang', lang);
  
  // Use History API to update URL without reloading
  window.history.replaceState({}, '', url.toString());
}

// Function to determine if URL should be updated
function shouldUpdateUrlWithLang() {
  // Configuration: update URL by default
  return true;
}