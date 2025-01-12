// Elementos del DOM
const countryCode = document.getElementById('countryCode');
const phoneNumber = document.getElementById('phoneNumber');
const message = document.getElementById('message');
const generateButton = document.getElementById('generateButton');
const previewMessage = document.getElementById('previewMessage');
const emojiButton = document.getElementById('emojiButton');
const emojiPicker = document.getElementById('emojiPicker');
const contactNumber = document.querySelector('.contact-number');
const linkContainer = document.getElementById('linkContainer');
const generatedLink = document.getElementById('generatedLink');
const copyButton = document.getElementById('copyButton');
const previewButton = document.getElementById('previewButton');

// Establecer México como país predeterminado
function setDefaultCountry() {
    const mexicoOption = Array.from(countryCode.options).find(option => option.value === '+52');
    if (mexicoOption) {
        mexicoOption.selected = true;
    }
}

// Función para crear el elemento del código de país
function createCountryCodeElement() {
    const codeElement = document.createElement('div');
    codeElement.className = 'country-code-display';
    codeElement.style.display = 'block';
    codeElement.textContent = '+52 ';
    phoneNumber.parentNode.appendChild(codeElement);
    return codeElement;
}

const countryCodeDisplay = createCountryCodeElement();

// Función para actualizar el placeholder del campo de teléfono
function updatePhonePlaceholder() {
    const selectedCode = countryCode.value;
    if (selectedCode) {
        countryCodeDisplay.textContent = `${selectedCode} `;
        countryCodeDisplay.style.display = 'block';
        phoneNumber.style.paddingLeft = `${countryCodeDisplay.offsetWidth + 5}px`;
    } else {
        countryCodeDisplay.style.display = 'none';
        phoneNumber.style.paddingLeft = '1rem';
    }
    phoneNumber.placeholder = 'Número de WhatsApp';
    phoneNumber.style.textAlign = 'left';
}

// Emojis comunes para el picker
const commonEmojis = [
    '😊', '👋', '🙏', '❤️', '👍', '🎉',
    '💪', '🤝', '📱', '💼', '✨', '🌟'
];

// Inicializar el emoji picker
function initEmojiPicker() {
    emojiPicker.innerHTML = commonEmojis.map(emoji => 
        `<span class="emoji-option">${emoji}</span>`
    ).join('');

    // Eventos para los emojis
    emojiPicker.querySelectorAll('.emoji-option').forEach(emoji => {
        emoji.addEventListener('click', () => {
            message.value += emoji.textContent;
            emojiPicker.classList.add('hidden');
            updatePreviewAndLink();
        });
    });
}

// Limpiar y formatear el mensaje para la URL
function formatMessage(text) {
    return encodeURIComponent(text);
}

// Generar el enlace de WhatsApp
function generateWhatsAppLink() {
    const cleanPhone = (countryCode.value + phoneNumber.value).replace(/\D/g, '');
    const formattedMessage = formatMessage(message.value);
    return `https://wa.me/${cleanPhone}?text=${formattedMessage}`;
}

// Actualizar la vista previa y el enlace
function updatePreviewAndLink() {
    // Actualizar vista previa
    const formattedNumber = phoneNumber.value ? `${countryCode.value} ${phoneNumber.value}` : `${countryCode.value} 55 1234 5678`;
    contactNumber.textContent = formattedNumber;
    previewMessage.textContent = message.value || 'Aquí se verá tu mensaje';
}

// Event Listeners
phoneNumber.addEventListener('input', (e) => {
    // Permitir solo números
    e.target.value = e.target.value.replace(/\D/g, '');
    updatePreviewAndLink();
});

message.addEventListener('input', updatePreviewAndLink);
countryCode.addEventListener('change', () => {
    updatePreviewAndLink();
    updatePhonePlaceholder();
    // Actualizar el número de contacto en el preview
    const formattedNumber = phoneNumber.value ? `${countryCode.value} ${phoneNumber.value}` : `${countryCode.value} 55 1234 5678`;
    contactNumber.textContent = formattedNumber;
});

// Event listener para el campo de teléfono
phoneNumber.addEventListener('focus', updatePhonePlaceholder);
phoneNumber.addEventListener('blur', () => {
    if (!phoneNumber.value) {
        phoneNumber.style.textAlign = 'center';
        phoneNumber.style.paddingLeft = '1rem';
    }
});

// Toggle emoji picker
emojiButton.addEventListener('click', () => {
    emojiPicker.classList.toggle('hidden');
});

// Generar y abrir enlace de WhatsApp
generateButton.addEventListener('click', () => {
    const link = generateWhatsAppLink();
    
    // Crear y añadir animación
    if (generateButton.querySelector('.copy-animation')) {
        generateButton.querySelector('.copy-animation').remove();
    }
    
    const animationContainer = document.createElement('div');
    animationContainer.className = 'copy-animation';
    const circle1 = document.createElement('div');
    circle1.className = 'copy-circle';
    const circle2 = document.createElement('div');
    circle2.className = 'copy-circle copy-circle-2';
    
    animationContainer.appendChild(circle1);
    animationContainer.appendChild(circle2);
    generateButton.appendChild(animationContainer);
    
    // Copiar al portapapeles
    navigator.clipboard.writeText(link).then(() => {
        generateButton.style.pointerEvents = 'none';
        generateButton.textContent = '¡Enlace Copiado!';
        setTimeout(() => {
            generateButton.textContent = 'Actualizar enlace';
            generateButton.style.pointerEvents = 'auto';
            animationContainer.remove();
        }, 1500);
    }).catch(err => {
        console.error('Error al copiar:', err);
        animationContainer.remove();
        generateButton.style.pointerEvents = 'auto';
    });
    
    generatedLink.value = link;
    linkContainer.classList.remove('hidden');
});

// Copiar enlace
copyButton.addEventListener('click', async () => {
    try {
        await navigator.clipboard.writeText(generatedLink.value);
        copyButton.textContent = '¡Copiado!';
        setTimeout(() => {
            copyButton.innerHTML = `
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16 1H4C2.9 1 2 1.9 2 3V17H4V3H16V1ZM19 5H8C6.9 5 6 5.9 6 7V21C6 22.1 6.9 23 8 23H19C20.1 23 21 22.1 21 21V7C21 5.9 20.1 5 19 5ZM19 21H8V7H19V21Z" fill="currentColor"/>
                </svg>
                Copiar Enlace
            `;
        }, 2000);
    } catch (err) {
        console.error('Error al copiar:', err);
    }
});

// Abrir vista previa
previewButton.addEventListener('click', () => {
    window.open(generatedLink.value, '_blank');
});

// Cerrar emoji picker al hacer clic fuera
document.addEventListener('click', (e) => {
    if (!emojiButton.contains(e.target) && !emojiPicker.contains(e.target)) {
        emojiPicker.classList.add('hidden');
    }
});

// Inicializar
initEmojiPicker();
updatePreviewAndLink();
setDefaultCountry();
updatePhonePlaceholder();