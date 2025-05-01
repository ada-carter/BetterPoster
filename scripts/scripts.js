// Make customSectionCount globally accessible
window.customSectionCount = 0;

document.addEventListener('DOMContentLoaded', () => {
  const root = document.documentElement;
  const posterPreview = document.getElementById('posterPreview');
  
  // Get the panel container that's already in the HTML
  const panelContainer = document.querySelector('.panel-container');
  
  // Panel elements
  const leftPanel = document.getElementById('leftPanel');
  const rightPanel = document.getElementById('rightPanel');
  const middlePanel = document.getElementById('middlePanel');
  
  // Preview elements
  const mainFinding = document.getElementById('mainFinding');
  const mainImageContainer = document.getElementById('mainImageContainer');
  const qrContainer = document.getElementById('qrContainer');
  const qrLabelText = document.getElementById('qrLabelText');
  
  // Left panel content
  const previewPosterTitle = document.getElementById('previewPosterTitle');
  const previewAuthors = document.getElementById('previewAuthors');
  const previewAffiliation = document.getElementById('previewAffiliation');
  const previewIntroduction = document.getElementById('previewIntroduction');
  const previewObjective = document.getElementById('previewObjective');
  const previewMethodology = document.getElementById('previewMethodology');
  
  // Right panel content
  const previewAnalysis = document.getElementById('previewAnalysis');
  const previewResults = document.getElementById('previewResults');
  const previewConclusion = document.getElementById('previewConclusion');
  const previewAcknowledgements = document.getElementById('previewAcknowledgements');
  const previewReferences = document.getElementById('previewReferences');
  // --- Annotated Figure Section ---
  const figuresSection = document.getElementById('figuresSection');
  const annotatedFigureDisplay = document.getElementById('annotatedFigureDisplay');
  const annotatedFigureTitle = document.getElementById('annotatedFigureTitle');
  const annotatedFigureCaption = document.getElementById('annotatedFigureCaption');

  // Control elements
  const posterWidth = document.getElementById('posterWidth');
  const posterHeight = document.getElementById('posterHeight');
  const ratioInput = document.getElementById('ratio');
  const bgTypeInputs = document.querySelectorAll('input[name="bgType"]');
  const colorPicker = document.getElementById('colorPicker');
  const gradientPicker = document.getElementById('gradientPicker');
  const bgColor = document.getElementById('bgColor');
  const bgOpacity = document.getElementById('bgOpacity');
  const gradAngle = document.getElementById('gradAngle');
  const gradientType = document.getElementById('gradientType');
  
  // Main panel content
  const titleText = document.getElementById('titleText');
  const mainAlignment = document.getElementById('mainAlignment');
  const mainImage = document.getElementById('mainImage');
  
  // Track current image for scaling
  let currentImg = null;
  const figureScale = document.getElementById('figureScale');
  // Scale listener
  figureScale.addEventListener('input', () => {
    if (currentImg) currentImg.style.transform = `scale(${figureScale.value})`;
  });
  
  // Figure upload & drag functionality
  mainImage.addEventListener('change', () => {
    const file = mainImage.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      mainImageContainer.innerHTML = '';
      const img = document.createElement('img');
      img.src = reader.result;
      img.style.left = '0px';
      img.style.top = '0px';
      img.style.transformOrigin = '0 0';
      // Apply initial scale
      const initScale = parseFloat(figureScale.value);
      img.style.transform = `scale(${initScale})`;
      currentImg = img;
      mainImageContainer.appendChild(img);
      // Enable dragging
      let isDragging = false, startX, startY, origX, origY;
      img.addEventListener('mousedown', e => {
        e.preventDefault();
        isDragging = true;
        startX = e.clientX; startY = e.clientY;
        origX = parseInt(img.style.left, 10); origY = parseInt(img.style.top, 10);
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
      });
      function onMouseMove(e) {
        if (!isDragging) return;
        const dx = e.clientX - startX, dy = e.clientY - startY;
        img.style.left = origX + dx + 'px';
        img.style.top = origY + dy + 'px';
      }
      function onMouseUp() {
        isDragging = false;
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      }
    };
    reader.readAsDataURL(file);
  });

  // QR code & label drag functionality
  const qrDragContainer = document.getElementById('qrContainer');
  let isQrDragging = false, qrStartX, qrStartY, qrOrigX, qrOrigY;
  qrDragContainer.addEventListener('mousedown', e => {
    e.preventDefault();
    isQrDragging = true;
    qrStartX = e.clientX; qrStartY = e.clientY;
    const cs = window.getComputedStyle(qrDragContainer);
    qrOrigX = parseInt(cs.left, 10);
    qrOrigY = parseInt(cs.top, 10);
    document.addEventListener('mousemove', qrMouseMove);
    document.addEventListener('mouseup', qrMouseUp);
  });
  function qrMouseMove(e) {
    if (!isQrDragging) return;
    const dx = e.clientX - qrStartX, dy = e.clientY - qrStartY;
    qrDragContainer.style.left = qrOrigX + dx + 'px';
    qrDragContainer.style.top = qrOrigY + dy + 'px';
  }
  function qrMouseUp() {
    isQrDragging = false;
    document.removeEventListener('mousemove', qrMouseMove);
    document.removeEventListener('mouseup', qrMouseUp);
  }

  // Left panel inputs
  const posterTitle = document.getElementById('posterTitle');
  const authorsInput = document.getElementById('authors');
  const affiliationInput = document.getElementById('affiliation');
  const introductionInput = document.getElementById('introduction');
  const objectiveInput = document.getElementById('objective');
  const methodologyInput = document.getElementById('methodology');
  
  // Right panel inputs
  const analysisInput = document.getElementById('analysis');
  const resultsInput = document.getElementById('results');
  const conclusionInput = document.getElementById('conclusion');
  const acknowledgementInput = document.getElementById('acknowledgements');
  const referencesInput = document.getElementById('references');
  
  // Extras 
  const includeQRCode = document.getElementById('includeQRCode');
  const qrDataInput = document.getElementById('qrData');
  const qrLabelTextInput = document.getElementById('qrLabelTextInput');
  const transparentModules = document.getElementById('transparentModules');
  const qrDarkColor = document.getElementById('qrDarkColor');
  const qrLightColor = document.getElementById('qrLightColor');
  const qrPosition = document.getElementById('qrPosition');
  const qrLabelPosition = document.getElementById('qrLabelPosition');
  const customSectionsContainer = document.getElementById('customSections');
  const customPreviewContainer = document.getElementById('customPreviewSections');
  const controlsDiv = document.querySelector('.controls');
  
  // Set initial font size CSS variables
  root.style.setProperty('--main-finding-font-size', '2.5rem');
  root.style.setProperty('--poster-title-font-size', '1.5rem');
  root.style.setProperty('--section-header-font-size', '1.2rem');
  root.style.setProperty('--body-text-font-size', '0.8rem');
  root.style.setProperty('--authors-font-size', '0.9rem');
  root.style.setProperty('--affiliation-font-size', '0.8rem');
  root.style.setProperty('--list-item-font-size', '0.8rem');
  root.style.setProperty('--subheader-font-size', '1rem');
  root.style.setProperty('--figure-caption-font-size', '0.9rem');
  root.style.setProperty('--qr-label-font-size', '0.8rem');
  
  // Set initial text color CSS variables
  root.style.setProperty('--main-finding-color', '#ffffff');
  root.style.setProperty('--poster-title-color', '#000000');
  root.style.setProperty('--section-header-color', '#000000');
  root.style.setProperty('--body-text-color', '#000000');
  root.style.setProperty('--authors-color', '#000000');
  root.style.setProperty('--affiliation-color', '#000000');
  root.style.setProperty('--list-item-color', '#000000');
  root.style.setProperty('--subheader-color', '#000000');
  root.style.setProperty('--figure-caption-color', '#000000');
  root.style.setProperty('--qr-label-color', '#ffffff');
  
  // Export buttons
  const exportPDF = document.getElementById('exportPDF');
  const exportJPG = document.getElementById('exportJPG');

  // Helper formatting functions for sidebar preview sections
  function formatTextWithBullets(text) {
    if (!text) return '';
    const lines = text.split('\n');
    let html = '';
    let inList = false;
    lines.forEach(line => {
      const trimmed = line.trim();
      if (trimmed.startsWith('- ')) {
        if (!inList) { html += '<ul>'; inList = true; }
        html += `<li>${trimmed.slice(2)}</li>`;
      } else if (trimmed.startsWith('-')) {
        if (!inList) { html += '<ul>'; inList = true; }
        html += `<li>${trimmed.slice(1).trim()}</li>`;
      } else {
        if (inList) { html += '</ul>'; inList = false; }
        html += `<p>${line}</p>`;
      }
    });
    if (inList) html += '</ul>';
    return html;
  }

  function formatResults(text) {
    return formatTextWithBullets(text);
  }

  function formatReferences(text) {
    return formatTextWithBullets(text);
  }

  // Helper: convert hex color + opacity to rgba
  function hexToRgba(hex, alpha) {
    const r = parseInt(hex.slice(1,3), 16);
    const g = parseInt(hex.slice(3,5), 16);
    const b = parseInt(hex.slice(5,7), 16);
    return `rgba(${r},${g},${b},${alpha})`;
  }

  // Define the core updatePreview function
  function updatePreview() {
    // Size and ratio updates
    root.style.setProperty('--poster-width', posterWidth.value + 'in');
    root.style.setProperty('--poster-height', posterHeight.value + 'in');
    
    panelContainer.style.width = `calc(${posterWidth.value}in / 5)`;
    panelContainer.style.height = `calc(${posterHeight.value}in / 5)`;
    
    const ratio = parseFloat(ratioInput.value);
    root.style.setProperty('--middle-ratio', ratio);
    root.style.setProperty('--side-ratio', 1);

    // Background updates
    const bgType = document.querySelector('input[name="bgType"]:checked').value;
    if (bgType === 'color') {
      const rgba = hexToRgba(bgColor.value, parseFloat(bgOpacity.value));
      middlePanel.style.background = rgba;
      root.style.setProperty('--primary-color', rgba);
    } else {
      const type = gradientType.value;
      const angle = parseInt(gradAngle.value, 10);
      const stops = Array.from(document.querySelectorAll('#gradStops .gradStopColor')).map(i => i.value);
      if (stops.length) {
        const gradient = type === 'linear'
          ? `linear-gradient(${angle}deg, ${stops.join(', ')})`
          : `radial-gradient(circle at center, ${stops.join(', ')})`;
        middlePanel.style.background = gradient;
        root.style.setProperty('--primary-color', stops[0]);
      }
    }
    
    // Main Finding updates
    if (titleText.value) {
      // Markdown-style **bold** conversion
      const html = titleText.value.replace(/\*\*(.+?)\*\*/g, '<b>$1</b>');
      mainFinding.innerHTML = html;
    } else {
      mainFinding.textContent = '';
    }
    mainFinding.style.textAlign = mainAlignment.value;
    
    // Left panel content
    previewPosterTitle.textContent = posterTitle.value || '';
    previewAuthors.innerHTML = authorsInput.value ? authorsInput.value.replace(/\^(\d+)/g, '<sup>$1</sup>') : '';
    previewAffiliation.innerHTML = affiliationInput.value ? affiliationInput.value.split(';').map(item => {
      const m = item.trim().match(/^\^(\d+)(.*)$/);
      return m ? `<p><sup>${m[1]}</sup> ${m[2].trim()}</p>` : `<p>${item.trim()}</p>`;
    }).join('') : '';
    previewIntroduction.innerHTML = formatTextWithBullets(introductionInput.value || '');
    previewObjective.innerHTML = formatTextWithBullets(objectiveInput.value || '');
    previewMethodology.innerHTML = formatTextWithBullets(methodologyInput.value || '');
    
    // Right panel content
    previewAnalysis.innerHTML = formatTextWithBullets(analysisInput.value || '');
    previewResults.innerHTML = formatResults(resultsInput.value || '');
    previewConclusion.innerHTML = formatTextWithBullets(conclusionInput.value || '');
    previewAcknowledgements.innerHTML = formatTextWithBullets(acknowledgementInput.value || '');
    previewReferences.innerHTML = formatReferences(referencesInput.value || '');
    
    // Delegate QR code generation
    if (window.generateQRCode) window.generateQRCode();
    
    // Check for overflow after all updates
    checkAllSectionsForOverflow();
    
    // Update custom sections
    customPreviewContainer.innerHTML = '';
    customSectionsContainer.querySelectorAll('.custom-section-control').forEach(div => {
      const id = div.dataset.id;
      if (div.querySelector(`#showCustomSection_${id}`).checked) {
        const title = div.querySelector(`#customTitle_${id}`).value;
        const content = div.querySelector(`#customContent_${id}`).value;
        const sec = document.createElement('div');
        sec.className = 'section';
        sec.innerHTML = `<h2>${title}</h2><div>${formatTextWithBullets(content)}</div>`;
        customPreviewContainer.appendChild(sec);
      }
    });

    // --- Annotated Figure Section Logic ---
    const dataUrl = document.getElementById('annotatedFigureDisplay').src;
    const figTitle = document.getElementById('annotatorFigureTitle').value;
    const figCaption = document.getElementById('annotatorFigureCaption').value;
    const figuresSection = document.getElementById('figuresSection');
    const annotatedFigureDisplay = document.getElementById('annotatedFigureDisplay');
    const annotatedFigureTitle = document.getElementById('annotatedFigureTitle');
    const annotatedFigureCaption = document.getElementById('annotatedFigureCaption');
    if (dataUrl && dataUrl.startsWith('data:image')) {
      figuresSection.style.display = '';
      annotatedFigureDisplay.src = dataUrl;
      annotatedFigureTitle.textContent = figTitle;
      annotatedFigureCaption.textContent = figCaption;
    } else {
      figuresSection.style.display = 'none';
    }
  }

  // Add event listeners to all inputs
  document.querySelectorAll('.controls input, .controls textarea, .controls select').forEach(input => {
    if (input.type === 'file') {
      input.addEventListener('change', updatePreview);
    } else if (input.type === 'radio' || input.type === 'checkbox') {
      input.addEventListener('change', updatePreview);
    } else {
      input.addEventListener('input', updatePreview);
      input.addEventListener('change', updatePreview);
    }
  });

  // Live markdown bold support
  titleText.addEventListener('input', () => {
    const html = titleText.value.replace(/\*\*(.+?)\*\*/g, '<b>$1</b>');
    mainFinding.innerHTML = html;
  });

  // Export at 300 DPI
  exportPDF.addEventListener('click', async () => {
    const dpi = 600;
    const ppi = 96;
    const scale = dpi / ppi;
    // temporarily set poster dimensions to CSS inches
    const root = document.documentElement;
    const origW = root.style.getPropertyValue('--poster-width');
    const origH = root.style.getPropertyValue('--poster-height');
    const widthIn = parseFloat(posterWidth.value);
    const heightIn = parseFloat(posterHeight.value);
    root.style.setProperty('--poster-width', `${widthIn}in`);
    root.style.setProperty('--poster-height', `${heightIn}in`);
    // render
    const canvas = await html2canvas(panelContainer, { scale, useCORS: true });
    // restore
    root.style.setProperty('--poster-width', origW);
    root.style.setProperty('--poster-height', origH);
    // PDF
    const imgData = canvas.toDataURL('image/png');
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({ orientation: 'landscape', unit: 'in', format: [widthIn, heightIn] });
    pdf.addImage(imgData, 'PNG', 0, 0, widthIn, heightIn);
    pdf.save('poster.pdf');
  });
  exportJPG.addEventListener('click', async () => {
    const dpiSelect = document.getElementById('exportDPISetting');
    const dpi = dpiSelect ? parseInt(dpiSelect.value, 10) : 600;
    const ppi = 96;
    const scale = dpi / ppi;
    const root = document.documentElement;
    const origW = root.style.getPropertyValue('--poster-width');
    const origH = root.style.getPropertyValue('--poster-height');
    const widthIn = parseFloat(posterWidth.value);
    const heightIn = parseFloat(posterHeight.value);
    root.style.setProperty('--poster-width', `${widthIn}in`);
    root.style.setProperty('--poster-height', `${heightIn}in`);
    const canvas = await html2canvas(panelContainer, { scale, useCORS: true });
    root.style.setProperty('--poster-width', origW);
    root.style.setProperty('--poster-height', origH);
    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'poster.jpg';
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }, 'image/jpeg', 1.0);
  });

  // Check if an element has overflow
  const checkOverflow = (element) => {
    return false; // Always return false to prevent overflow detection
  };
  
  // Check all sections for overflow - disabled to remove warnings
  const checkAllSectionsForOverflow = () => {
    // Function disabled to remove overflow warnings
    return false;
  };

  // Add section visibility toggles and QR code color controls
  const addSectionControls = () => {
    // Create section visibility control fieldset
    const sectionFieldset = document.createElement('fieldset');
    sectionFieldset.innerHTML = `
      <legend>Section Visibility</legend>
      <p style="margin-top:0;">Toggle sections to show or hide them:</p>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:5px;">
        <label><input type="checkbox" id="showPosterTitle" checked> Poster Title</label>
        <label><input type="checkbox" id="showIntroduction" checked> Introduction</label>
        <label><input type="checkbox" id="showObjective" checked> Objective</label>
        <label><input type="checkbox" id="showMethodology" checked> Methodology</label>
        <label><input type="checkbox" id="showAnalysis" checked> Analysis</label>
        <label><input type="checkbox" id="showResults" checked> Results</label>
        <label><input type="checkbox" id="showFigures" checked> Figures</label>
        <label><input type="checkbox" id="showConclusion" checked> Conclusion</label>
        <label><input type="checkbox" id="showAcknowledgements" checked> Acknowledgements</label>
        <label><input type="checkbox" id="showReferences" checked> References</label>
      </div>
    `;
    
    // Insert section toggle controls after the font controls
    const firstFieldset = document.querySelector('fieldset');
    firstFieldset.parentNode.insertBefore(sectionFieldset, firstFieldset.nextSibling);
    
    // Add event listeners for section visibility controls
    document.getElementById('showPosterTitle').addEventListener('change', (e) => {
      const section = document.querySelector('.poster-title-section');
      section.classList.toggle('hidden-section', !e.target.checked);
      updatePreview();
    });
    
    document.getElementById('showIntroduction').addEventListener('change', (e) => {
      const section = document.querySelector('#previewIntroduction').parentNode;
      section.classList.toggle('hidden-section', !e.target.checked);
      updatePreview();
    });
    
    document.getElementById('showObjective').addEventListener('change', (e) => {
      const section = document.querySelector('#previewObjective').parentNode;
      section.classList.toggle('hidden-section', !e.target.checked);
      updatePreview();
    });
    
    document.getElementById('showMethodology').addEventListener('change', (e) => {
      const section = document.querySelector('#previewMethodology').parentNode;
      section.classList.toggle('hidden-section', !e.target.checked);
      updatePreview();
    });
    
    document.getElementById('showAnalysis').addEventListener('change', (e) => {
      const section = document.querySelector('#previewAnalysis').parentNode;
      section.classList.toggle('hidden-section', !e.target.checked);
      updatePreview();
    });
    
    document.getElementById('showResults').addEventListener('change', (e) => {
      const section = document.querySelector('#previewResults').parentNode;
      section.classList.toggle('hidden-section', !e.target.checked);
      updatePreview();
    });
    
    document.getElementById('showFigures').addEventListener('change', (e) => {
      const section = document.querySelector('.figures');
      section.classList.toggle('hidden-section', !e.target.checked);
      updatePreview();
    });
    
    document.getElementById('showConclusion').addEventListener('change', (e) => {
      const section = document.querySelector('#previewConclusion').parentNode;
      section.classList.toggle('hidden-section', !e.target.checked);
      updatePreview();
    });
    
    document.getElementById('showAcknowledgements').addEventListener('change', (e) => {
      const section = document.querySelector('#previewAcknowledgements').parentNode;
      section.classList.toggle('hidden-section', !e.target.checked);
      updatePreview();
    });
    
    document.getElementById('showReferences').addEventListener('change', (e) => {
      const section = document.querySelector('#previewReferences').parentNode;
      section.classList.toggle('hidden-section', !e.target.checked);
      updatePreview();
    });
    
    // Add event listeners for QR code color
    document.getElementById('qrDarkColor').addEventListener('input', (e) => { updatePreview(); });
    document.getElementById('qrLightColor').addEventListener('input', (e) => { updatePreview(); });
  };
  
  try {
    addSectionControls();
  } catch (e) {
    console.error('Could not create section controls:', e);
  }

  // Custom sections data and containers
  // const customSectionsContainer = document.getElementById('customSections');
  // const customPreviewContainer = document.getElementById('customPreviewSections');

  // Function to create a custom section control
  window.createCustomSectionControl = function(id, title = '', content = '') {
    const div = document.createElement('div');
    div.className = 'custom-section-control';
    div.dataset.id = id;
    div.innerHTML = `
      <div class="custom-section-header">
        <input type="text" placeholder="Section Title" id="customTitle_${id}" value="${title}" />
        <div class="custom-section-controls">
          <label><input type="checkbox" class="section-visibility" id="showCustomSection_${id}" checked> Show</label>
          <button type="button" class="removeSection" data-id="${id}">Remove</button>
        </div>
      </div>
      <textarea placeholder="Section Content" id="customContent_${id}">${content}</textarea>
    `;
    customSectionsContainer.appendChild(div);

    // Remove button handler
    div.querySelector('.removeSection').addEventListener('click', (e) => {
      const rid = e.target.dataset.id;
      customSectionsContainer.querySelector(`[data-id='${rid}']`).remove();
      updatePreview();
    });

    // Visibility toggle handler
    div.querySelector(`#showCustomSection_${id}`).addEventListener('change', updatePreview);

    // Update preview on input
    div.querySelector(`#customTitle_${id}`).addEventListener('input', updatePreview);
    div.querySelector(`#customContent_${id}`).addEventListener('input', updatePreview);
  };

  // Add new custom section on button click
  document.getElementById('addCustomSection').addEventListener('click', () => {
    const id = ++window.customSectionCount;
    window.createCustomSectionControl(id);
  });
  
  // Modify updatePreview to respect custom section visibility
  const originalUpdatePreview = updatePreview;
  updatePreview = () => {
    originalUpdatePreview();
    
    // Update custom sections with visibility
    customPreviewContainer.innerHTML = '';
    customSectionsContainer.querySelectorAll('.custom-section-control').forEach(div => {
      const id = div.dataset.id;
      const visible = div.querySelector(`#showCustomSection_${id}`).checked;
      
      if (visible) {
        const title = div.querySelector(`#customTitle_${id}`).value;
        const content = div.querySelector(`#customContent_${id}`).value;
        const sec = document.createElement('div');
        sec.className = 'section';
        sec.innerHTML = `<h2>${title}</h2><div>${formatTextWithBullets(content)}</div>`;
        customPreviewContainer.appendChild(sec);
      }
    });

    // --- Annotated Figure Section Logic ---
    const dataUrl = document.getElementById('annotatedFigureDisplay').src;
    const figTitle = document.getElementById('annotatorFigureTitle').value;
    const figCaption = document.getElementById('annotatorFigureCaption').value;
    const figuresSection = document.getElementById('figuresSection');
    const annotatedFigureDisplay = document.getElementById('annotatedFigureDisplay');
    const annotatedFigureTitle = document.getElementById('annotatedFigureTitle');
    const annotatedFigureCaption = document.getElementById('annotatedFigureCaption');
    if (dataUrl && dataUrl.startsWith('data:image')) {
      figuresSection.style.display = '';
      annotatedFigureDisplay.src = dataUrl;
      annotatedFigureTitle.textContent = figTitle;
      annotatedFigureCaption.textContent = figCaption;
    } else {
      figuresSection.style.display = 'none';
    }
  };

  // Fix updatePreview modifications
  const baseUpdatePreview = function() {
    // Size and ratio updates
    root.style.setProperty('--poster-width', posterWidth.value + 'in');
    root.style.setProperty('--poster-height', posterHeight.value + 'in');
    
    panelContainer.style.width = `calc(${posterWidth.value}in / 5)`;
    panelContainer.style.height = `calc(${posterHeight.value}in / 5)`;
    
    const ratio = parseFloat(ratioInput.value);
    root.style.setProperty('--middle-ratio', ratio);
    root.style.setProperty('--side-ratio', 1);

    // Background updates
    const bgType = document.querySelector('input[name="bgType"]:checked').value;
    if (bgType === 'color') {
      const rgba = hexToRgba(bgColor.value, parseFloat(bgOpacity.value));
      middlePanel.style.background = rgba;
      root.style.setProperty('--primary-color', rgba);
    } else {
      const type = gradientType.value;
      const angle = parseInt(gradAngle.value, 10);
      const stops = Array.from(document.querySelectorAll('#gradStops .gradStopColor')).map(i => i.value);
      if (stops.length) {
        const gradient = type === 'linear'
          ? `linear-gradient(${angle}deg, ${stops.join(', ')})`
          : `radial-gradient(circle at center, ${stops.join(', ')})`;
        middlePanel.style.background = gradient;
        root.style.setProperty('--primary-color', stops[0]);
      }
    }
    
    // Main Finding updates
    if (titleText.value) {
      // Markdown-style **bold** conversion
      const html = titleText.value.replace(/\*\*(.+?)\*\*/g, '<b>$1</b>');
      mainFinding.innerHTML = html;
    } else {
      mainFinding.textContent = '';
    }
    mainFinding.style.textAlign = mainAlignment.value;
    
    // Left panel content
    previewPosterTitle.textContent = posterTitle.value || '';
    previewAuthors.innerHTML = authorsInput.value ? authorsInput.value.replace(/\^(\d+)/g, '<sup>$1</sup>') : '';
    previewAffiliation.innerHTML = affiliationInput.value ? affiliationInput.value.split(';').map(item => {
      const m = item.trim().match(/^\^(\d+)(.*)$/);
      return m ? `<p><sup>${m[1]}</sup> ${m[2].trim()}</p>` : `<p>${item.trim()}</p>`;
    }).join('') : '';
    previewIntroduction.innerHTML = formatTextWithBullets(introductionInput.value || '');
    previewObjective.innerHTML = formatTextWithBullets(objectiveInput.value || '');
    previewMethodology.innerHTML = formatTextWithBullets(methodologyInput.value || '');
    
    // Right panel content
    previewAnalysis.innerHTML = formatTextWithBullets(analysisInput.value || '');
    previewResults.innerHTML = formatResults(resultsInput.value || '');
    previewConclusion.innerHTML = formatTextWithBullets(conclusionInput.value || '');
    previewAcknowledgements.innerHTML = formatTextWithBullets(acknowledgementInput.value || '');
    previewReferences.innerHTML = formatReferences(referencesInput.value || '');
    
    // Update custom sections
    customPreviewContainer.innerHTML = '';
    customSectionsContainer.querySelectorAll('.custom-section-control').forEach(div => {
      const id = div.dataset.id;
      if (div.querySelector(`#showCustomSection_${id}`).checked) {
        const title = div.querySelector(`#customTitle_${id}`).value;
        const content = div.querySelector(`#customContent_${id}`).value;
        const sec = document.createElement('div');
        sec.className = 'section';
        sec.innerHTML = `<h2>${title}</h2><div>${formatTextWithBullets(content)}</div>`;
        customPreviewContainer.appendChild(sec);
      }
    });

    // --- Annotated Figure Section Logic ---
    const dataUrl = document.getElementById('annotatedFigureDisplay').src;
    const figTitle = document.getElementById('annotatorFigureTitle').value;
    const figCaption = document.getElementById('annotatorFigureCaption').value;
    const figuresSection = document.getElementById('figuresSection');
    const annotatedFigureDisplay = document.getElementById('annotatedFigureDisplay');
    const annotatedFigureTitle = document.getElementById('annotatedFigureTitle');
    const annotatedFigureCaption = document.getElementById('annotatedFigureCaption');
    if (dataUrl && dataUrl.startsWith('data:image')) {
      figuresSection.style.display = '';
      annotatedFigureDisplay.src = dataUrl;
      annotatedFigureTitle.textContent = figTitle;
      annotatedFigureCaption.textContent = figCaption;
    } else {
      figuresSection.style.display = 'none';
    }

    // Check for overflow after all updates
    checkAllSectionsForOverflow();
  };

  // Replace the previous updatePreview function
  updatePreview = baseUpdatePreview;
  
  // Call updatePreview once on load
  updatePreview();

  // Initialize blank poster and mock figure
  // Clear all text inputs for one-line starter copy
  ['titleText','posterTitle','authors','affiliation','introduction','objective','methodology',
   'analysis','results','conclusion','acknowledgements','references',
   'annotatorFigureTitle','annotatorFigureCaption'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });

  // Mock figure placeholder
  const mockUrl = 'https://via.placeholder.com/600x400?text=Mock+Figure';
  const previewImgEl = document.getElementById('annotatorFigurePreview');
  const displayImgEl = document.getElementById('annotatedFigureDisplay');
  previewImgEl.src = mockUrl;
  previewImgEl.style.display = 'block';
  displayImgEl.src = mockUrl;
  document.getElementById('annotatorFigureTitle').value = 'Figure 1';
  document.getElementById('annotatorFigureCaption').value = 'Caption';
  document.getElementById('figuresSection').style.display = 'block';
  updatePreview();

  // Section Management
  const sectionToggles = document.querySelectorAll('.section-toggle');
  // Use the left panel custom sections container for controls, and the preview container for preview

  // Handle section visibility toggles
  sectionToggles.forEach(toggle => {
    toggle.addEventListener('change', (e) => {
      const sectionName = e.target.dataset.section;
      const section = document.querySelector(`[id="preview${sectionName.charAt(0).toUpperCase() + sectionName.slice(1)}"]`).closest('.section');
      if (section) {
        section.style.display = e.target.checked ? 'block' : 'none';
      }
    });
  });

  // Custom Section Management
  let customSectionCount = 0;

  document.getElementById('addCustomSection').addEventListener('click', () => {
    const sectionId = `customSection${++customSectionCount}`;
    
    // Create control panel elements
    const sectionControl = document.createElement('div');
    sectionControl.className = 'custom-section-control';
    sectionControl.innerHTML = `
      <div class="custom-section-header">
        <input type="text" id="${sectionId}Title" placeholder="Section Title" maxlength="60">
        <div class="custom-section-controls">
          <input type="checkbox" class="section-visibility" checked title="Toggle visibility">
          <button class="removeSection" title="Remove section">×</button>
        </div>
      </div>
      <textarea id="${sectionId}Content" maxlength="500" placeholder="Section content"></textarea>
    `;
    
    // Add to controls panel
    customSectionsContainer.appendChild(sectionControl);
    
    // Create preview section
    const previewSection = document.createElement('div');
    previewSection.className = 'section';
    previewSection.id = `preview${sectionId}`;
    previewSection.innerHTML = `
      <h2></h2>
      <div class="section-content"></div>
    `;
    
    // Add to preview panel
    customPreviewContainer.appendChild(previewSection);
    
    // Handle title changes
    const titleInput = sectionControl.querySelector(`#${sectionId}Title`);
    titleInput.addEventListener('input', (e) => {
      previewSection.querySelector('h2').textContent = e.target.value;
    });
    
    // Handle content changes
    const contentInput = sectionControl.querySelector(`#${sectionId}Content`);
    contentInput.addEventListener('input', (e) => {
      previewSection.querySelector('.section-content').innerHTML = e.target.value.replace(/\n/g, '<br>');
    });
    
    // Handle visibility toggle
    const visibilityToggle = sectionControl.querySelector('.section-visibility');
    visibilityToggle.addEventListener('change', (e) => {
      previewSection.style.display = e.target.checked ? 'block' : 'none';
    });
    
    // Handle section removal
    const removeButton = sectionControl.querySelector('.removeSection');
    removeButton.addEventListener('click', () => {
      sectionControl.remove();
      previewSection.remove();
    });
  });

  // Storage Integration for Custom Sections
  const originalSaveState = saveState;
  saveState = () => {
    const state = originalSaveState();
    
    // Add custom sections to state
    state.customSections = [];
    customSectionsContainer.querySelectorAll('.custom-section-control').forEach(control => {
      const id = control.querySelector('input[type="text"]').id.replace('Title', '');
      state.customSections.push({
        id,
        title: control.querySelector('input[type="text"]').value,
        content: control.querySelector('textarea').value,
        visible: control.querySelector('.section-visibility').checked
      });
    });
    
    // Add section visibility states
    state.sectionVisibility = {};
    sectionToggles.forEach(toggle => {
      state.sectionVisibility[toggle.dataset.section] = toggle.checked;
    });
    
    return state;
  };

  const originalLoadState = loadState;
  loadState = (state) => {
    originalLoadState(state);
    
    // Restore section visibility
    if (state.sectionVisibility) {
      Object.entries(state.sectionVisibility).forEach(([section, visible]) => {
        const toggle = document.querySelector(`.section-toggle[data-section="${section}"]`);
        if (toggle) {
          toggle.checked = visible;
          toggle.dispatchEvent(new Event('change'));
        }
      });
    }
    
    // Restore custom sections
    if (state.customSections) {
      state.customSections.forEach(section => {
        document.getElementById('addCustomSection').click();
        const control = document.querySelector('.custom-section-control:last-child');
        control.querySelector('input[type="text"]').value = section.title;
        control.querySelector('textarea').value = section.content;
        control.querySelector('.section-visibility').checked = section.visible;
        
        // Trigger events to update preview
        control.querySelector('input[type="text"]').dispatchEvent(new Event('input'));
        control.querySelector('textarea').dispatchEvent(new Event('input'));
        control.querySelector('.section-visibility').dispatchEvent(new Event('change'));
      });
    }
  };

  // Make sure all input fields trigger updates
  document.querySelectorAll('input, textarea, select').forEach(element => {
    if (element.type === 'file') {
      element.addEventListener('change', () => updatePreview());
    } else if (element.type === 'radio' || element.type === 'checkbox') {
      element.addEventListener('change', () => updatePreview());
    } else {
      ['input', 'change', 'blur'].forEach(eventType => {
        element.addEventListener(eventType, () => updatePreview());
      });
    }
  });

  // Ensure the preview updates when sections are toggled
  document.querySelectorAll('.section-toggle').forEach(toggle => {
    toggle.addEventListener('change', () => {
      const sectionName = toggle.dataset.section;
      const section = document.querySelector(`#preview${sectionName.charAt(0).toUpperCase() + sectionName.slice(1)}`);
      if (section) {
        section.closest('.section').style.display = toggle.checked ? 'block' : 'none';
      }
      updatePreview();
    });
  });

  // Fix custom section handling
  document.getElementById('addCustomSection').addEventListener('click', () => {
    const id = ++window.customSectionCount;
    window.createCustomSectionControl(id);
    updatePreview();
  });

  // Ensure custom sections update properly
  const customSectionsObserver = new MutationObserver(() => {
    updatePreview();
  });

  if (customSectionsContainer) {
    customSectionsObserver.observe(customSectionsContainer, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true
    });
  }
  
  // Expose for external listeners
  window.updatePreview = updatePreview;
  
  // Final binding: ensure all sidebar controls trigger preview update
  document.querySelectorAll('.controls input, .controls textarea, .controls select').forEach(el => {
    el.addEventListener('input', updatePreview);
    el.addEventListener('change', updatePreview);
  });
});