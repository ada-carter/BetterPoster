// Handles delegation of sidebar control events to updatePreview

document.addEventListener('DOMContentLoaded', () => {
  const controlsDiv = document.querySelector('.controls');
  if (!controlsDiv) return;

  // Toggle color/gradient picker UI
  const colorPickerDiv = document.getElementById('colorPicker');
  const gradientPickerDiv = document.getElementById('gradientPicker');
  const bgTypeInputs = document.querySelectorAll('input[name="bgType"]');
  function updateBgUI() {
    const val = document.querySelector('input[name="bgType"]:checked').value;
    colorPickerDiv.style.display = val === 'color' ? '' : 'none';
    gradientPickerDiv.style.display = val === 'gradient' ? '' : 'none';
  }
  bgTypeInputs.forEach(input => input.addEventListener('change', () => {
    updateBgUI();
    if (typeof updatePreview === 'function') updatePreview();
  }));
  updateBgUI();

  // Dynamic gradient stops
  const gradStopsContainer = document.getElementById('gradStops');
  const addStopBtn = document.getElementById('addGradStop');
  const removeStopBtn = document.getElementById('removeGradStop');
  function refreshStopLabels() {
    Array.from(gradStopsContainer.children).forEach((div, idx) => {
      const input = div.querySelector('input');
      div.innerHTML = `<label>Stop ${idx+1}: <input type="color" class="gradStopColor" value="${input.value}"></label>`;
    });
  }
  addStopBtn.addEventListener('click', () => {
    const count = gradStopsContainer.children.length;
    if (count < 5) {
      const div = document.createElement('div');
      div.className = 'grad-stop';
      const defaultColor = '#ffffff';
      div.innerHTML = `<label>Stop ${count+1}: <input type="color" class="gradStopColor" value="${defaultColor}"></label>`;
      gradStopsContainer.appendChild(div);
      refreshStopLabels();
      updatePreview();
    }
  });
  removeStopBtn.addEventListener('click', () => {
    const count = gradStopsContainer.children.length;
    if (count > 2) {
      gradStopsContainer.removeChild(gradStopsContainer.lastElementChild);
      refreshStopLabels();
      updatePreview();
    }
  });

  // Randomize gradient stops with complementary colors
  const randomizeBtn = document.getElementById('randomizeGradient');
  if (randomizeBtn) {
    randomizeBtn.addEventListener('click', () => {
      const inputs = gradStopsContainer.querySelectorAll('.gradStopColor');
      if (inputs.length >= 2) {
        const rand = Math.floor(Math.random() * 0xFFFFFF);
        const hex1 = '#'+rand.toString(16).padStart(6,'0');
        const hex2 = '#'+(0xFFFFFF - rand).toString(16).padStart(6,'0');
        inputs.forEach((inp, idx) => inp.value = idx % 2 === 0 ? hex1 : hex2);
        refreshStopLabels();
        // Randomize gradient angle
        const angleInput = document.getElementById('gradAngle');
        const angleVal = Math.floor(Math.random() * 361);
        angleInput.value = angleVal;
        const angleDisplay = document.getElementById('gradAngleValue');
        if (angleDisplay) angleDisplay.textContent = angleVal + '°';
        // Immediate background update
        const middlePanel = document.getElementById('middlePanel');
        const gradientTypeEl = document.getElementById('gradientType');
        const stops = Array.from(gradStopsContainer.querySelectorAll('.gradStopColor')).map(i => i.value);
        const type = gradientTypeEl.value;
        const gradient = type === 'linear'
          ? `linear-gradient(${angleVal}deg, ${stops.join(', ')})`
          : `radial-gradient(circle at center, ${stops.join(', ')})`;
        middlePanel.style.background = gradient;
        document.documentElement.style.setProperty('--primary-color', stops[0]);
        if (typeof updatePreview === 'function') updatePreview();
      }
    });
  }

  // Section Management: static toggles
  document.querySelectorAll('.section-toggle').forEach(input => {
    input.addEventListener('change', (e) => {
      const sec = e.target.dataset.section;
      const cap = sec.charAt(0).toUpperCase() + sec.slice(1);
      const previewEl = document.getElementById(`preview${cap}`);
      if (previewEl) {
        const sectionDiv = previewEl.closest('.section');
        sectionDiv.classList.toggle('hidden-section', !e.target.checked);
        if (typeof updatePreview === 'function') updatePreview();
      }
    });
  });

  // Delegate input and change events to updatePreview
  controlsDiv.addEventListener('input', () => {
    if (typeof updatePreview === 'function') updatePreview();
  });
  controlsDiv.addEventListener('change', () => {
    if (typeof updatePreview === 'function') updatePreview();
  });

  // Function to directly update section headers in the preview
  function updateSectionHeader(input) {
    const sectionName = input.dataset.section;
    const sectionValue = input.value;
    const capitalized = sectionName.charAt(0).toUpperCase() + sectionName.slice(1);
    const sectionElement = document.getElementById(`preview${capitalized}`);
    
    if (sectionElement) {
      const sectionHeader = sectionElement.closest('.section').querySelector('h2');
      if (sectionHeader && sectionValue) {
        sectionHeader.textContent = sectionValue;
      }
    }
  }
  
  // Make updateSectionHeader globally available for configManager.js
  window.updateSectionHeader = updateSectionHeader;

  // Update preview immediately when section name inputs change
  document.querySelectorAll('.section-name-input').forEach(input => {
    // Add direct update event
    input.addEventListener('input', () => {
      updateSectionHeader(input);
    });
    
    // Also update during normal preview refresh
    input.addEventListener('change', () => {
      if (typeof updatePreview === 'function') updatePreview();
    });
    
    // Initialize with current values
    updateSectionHeader(input);
  });

  // Show sidebar-footer only when scrolled to bottom
  const footer = document.getElementById('sidebar-footer');
  if (footer) {
    function checkFooterVisibility() {
      const atBottom = Math.abs(controlsDiv.scrollHeight - controlsDiv.scrollTop - controlsDiv.clientHeight) < 2;
      if (atBottom) {
        footer.classList.add('visible');
      } else {
        footer.classList.remove('visible');
      }
    }
    controlsDiv.addEventListener('scroll', checkFooterVisibility);
    checkFooterVisibility();
  }
});
