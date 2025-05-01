// Store QR code position for JSON saving - make them global for configManager.js
window.qrPosition = { x: 10, y: 10 };
window.qrLabelPosition = { x: 0, y: 0 };

// Helper function to make elements draggable
function setupDraggable(element, onPositionChange) {
  let isDragging = false;
  let offsetX, offsetY;
  
  element.style.cursor = 'move';
  
  element.addEventListener('mousedown', (e) => {
    isDragging = true;
    offsetX = e.clientX - element.getBoundingClientRect().left;
    offsetY = e.clientY - element.getBoundingClientRect().top;
    element.style.cursor = 'grabbing';
    e.stopPropagation(); // Prevent event bubbling
  });
  
  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    
    const parent = element.parentElement;
    const rect = parent.getBoundingClientRect();
    
    // Calculate new position relative to parent
    let newLeft = e.clientX - rect.left - offsetX;
    let newTop = e.clientY - rect.top - offsetY;
    
    // Constrain to parent boundaries
    newLeft = Math.max(0, Math.min(newLeft, rect.width - element.offsetWidth));
    newTop = Math.max(0, Math.min(newTop, rect.height - element.offsetHeight));
    
    // Update position
    element.style.left = newLeft + 'px';
    element.style.top = newTop + 'px';
    
    // Callback with new position
    if (typeof onPositionChange === 'function') {
      onPositionChange(newLeft, newTop);
    }
  });
  
  document.addEventListener('mouseup', () => {
    if (isDragging) {
      isDragging = false;
      element.style.cursor = 'move';
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  // Make QR code draggable
  const qrContainer = document.getElementById('qrContainer');
  if (qrContainer) {
    let isDragging = false;
    let offsetX, offsetY;
    
    qrContainer.addEventListener('mousedown', (e) => {
      isDragging = true;
      offsetX = e.clientX - qrContainer.getBoundingClientRect().left;
      offsetY = e.clientY - qrContainer.getBoundingClientRect().top;
      qrContainer.style.cursor = 'grabbing';
    });
    
    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      
      const middlePanel = document.getElementById('middlePanel');
      const rect = middlePanel.getBoundingClientRect();
      
      // Calculate new position relative to middle panel
      let newLeft = e.clientX - rect.left - offsetX;
      let newTop = e.clientY - rect.top - offsetY;
      
      // Constrain to panel boundaries
      newLeft = Math.max(0, Math.min(newLeft, rect.width - qrContainer.offsetWidth));
      newTop = Math.max(0, Math.min(newTop, rect.height - qrContainer.offsetHeight));
      
      // Update position
      qrContainer.style.left = newLeft + 'px';
      qrContainer.style.top = newTop + 'px';
      qrContainer.style.bottom = 'auto';
      
      // Store position for saving in global variable
      window.qrPosition = { x: newLeft, y: newTop };
    });
    
    document.addEventListener('mouseup', () => {
      if (isDragging) {
        isDragging = false;
        qrContainer.style.cursor = 'grab';
      }
    });
  }
  
  // Encapsulate QR code generation into a separate function
  window.generateQRCode = () => {
    const includeQRCode = document.getElementById('includeQRCode');
    const qrDataInput = document.getElementById('qrData');
    const qrLabelTextInput = document.getElementById('qrLabelTextInput');
    const transparentModules = document.getElementById('transparentModules');
    const qrDarkColor = document.getElementById('qrDarkColor');
    const qrLightColor = document.getElementById('qrLightColor');
    const adaptiveColors = document.getElementById('adaptiveColors');
    const attachQRLabel = document.getElementById('attachQRLabel');
    const matchQRLabelColor = document.getElementById('matchQRLabelColor');
    const qrSize = parseInt(document.getElementById('qrSize').value, 10);
    const qrErrorCorrection = document.getElementById('qrErrorCorrection').value;
    const qrMargin = parseInt(document.getElementById('qrMargin').value, 10);
    const qrLabelFontSize = parseInt(document.getElementById('qrLabelFontSize').value, 10);
    const qrLabelFontColor = document.getElementById('qrLabelFontColor').value;
    const qrCodeDiv = document.getElementById('qrCode');
    const qrLabelText = document.getElementById('qrLabelText');
    const qrContainer = document.getElementById('qrContainer');

    // clear & style container
    qrCodeDiv.innerHTML = '';
    qrCodeDiv.style.position = 'relative';
    qrCodeDiv.style.padding = qrMargin + 'px';
    qrLabelText.innerHTML = '';

    // Handle label attachment and positioning
    const isAttached = attachQRLabel && attachQRLabel.checked;
    
    // Reset label text content
    qrLabelText.textContent = '';
    
    // Handle label color matching
    let labelColor = qrLabelFontColor;
    if (matchQRLabelColor && matchQRLabelColor.checked) {
      // Match color with main finding text
      labelColor = getComputedStyle(document.documentElement).getPropertyValue('--main-finding-color').trim();
    }
    qrLabelText.style.color = labelColor;
    
    // Set label attachment styling
    if (isAttached) {
      // Keep label inside QR container
      qrLabelText.style.position = 'relative';
      qrLabelText.style.fontSize = qrLabelFontSize + 'px';
      qrLabelText.style.left = '0';
      qrLabelText.style.top = '0';
      
      // Remove from middle panel if it was there
      if (qrLabelText.parentElement !== qrContainer) {
        qrContainer.prepend(qrLabelText);
      }
    } else {
      // Make label independently positionable by moving it to the middle panel
      const middlePanel = document.querySelector('.middle-content');
      
      // Only move if not already in middle panel
      if (qrLabelText.parentElement !== middlePanel) {
        // Remove from current parent
        if (qrLabelText.parentElement) {
          qrLabelText.parentElement.removeChild(qrLabelText);
        }
        
        // Add to middle panel
        middlePanel.appendChild(qrLabelText);
        
        // Set initial position if not already set
        if (!window.qrLabelPosition || (window.qrLabelPosition.x === 0 && window.qrLabelPosition.y === 0)) {
          window.qrLabelPosition = { x: 50, y: 50 };
        }
      }
      
      // Style the detached label
      qrLabelText.style.position = 'absolute';
      qrLabelText.style.fontSize = qrLabelFontSize + 'px';
      qrLabelText.style.left = window.qrLabelPosition.x + 'px';
      qrLabelText.style.top = window.qrLabelPosition.y + 'px';
      qrLabelText.style.zIndex = '100';
      qrLabelText.style.background = 'transparent';
      qrLabelText.style.padding = '5px';
      qrLabelText.style.cursor = 'move';
      
      // Make label draggable when detached
      if (!qrLabelText.hasAttribute('data-draggable-setup')) {
        setupDraggable(qrLabelText, (x, y) => {
          window.qrLabelPosition = { x, y };
        });
        qrLabelText.setAttribute('data-draggable-setup', 'true');
      }
    }

    if (includeQRCode.checked && qrDataInput.value.trim()) {
      let darkColor, lightColor;
      if (adaptiveColors.checked) {
        // Determine background color behind QR
        const panel = document.getElementById('middlePanel');
        const bg = window.getComputedStyle(panel).backgroundColor;
        const match = bg.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
        let r = 255, g = 255, b = 255;
        if (match) { r = +match[1]; g = +match[2]; b = +match[3]; }
        const lum = 0.299*r + 0.587*g + 0.114*b;
        const isLight = lum > 128;
        darkColor = isLight ? '#000000' : '#FFFFFF';
        lightColor = transparentModules.checked ? 'transparent' : (isLight ? '#FFFFFF' : '#000000');
      } else {
        darkColor = qrDarkColor.value;
        lightColor = transparentModules.checked ? 'transparent' : qrLightColor.value;
      }
      const correctionMap = { L: QRCode.CorrectLevel.L, M: QRCode.CorrectLevel.M, Q: QRCode.CorrectLevel.Q, H: QRCode.CorrectLevel.H };
      new QRCode(qrCodeDiv, {
        text: qrDataInput.value.trim(),
        width: qrSize,
        height: qrSize,
        colorDark: darkColor,
        colorLight: lightColor,
        correctLevel: correctionMap[qrErrorCorrection]
      });
      qrLabelText.textContent = qrLabelTextInput.value;

      // Position QR and label
      const pos = qrPosition.value;
      const labelPos = qrLabelPosition.value;
      ['bottom-left', 'bottom-center', 'bottom-right'].forEach(p => {
        qrCodeDiv.classList.remove(`qr-pos-${p}`);
        qrLabelText.classList.remove(`qr-label-pos-${p}`);
      });
      qrCodeDiv.classList.add(`qr-pos-${pos}`);
      qrLabelText.classList.add(`qr-label-pos-${labelPos}`);
    }
  };
});
