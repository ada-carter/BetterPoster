(function(){
  console.log('configManager.js loaded');
  
  // Define the section controls for visibility
  const visibilityControls = [
    'showPosterTitle','showIntroduction','showObjective','showMethodology',
    'showAnalysis','showResults','showFigures','showConclusion',
    'showAcknowledgements','showReferences'
  ];

  function collectState(){
    const state = { 
      controls: {}, 
      sectionVisibility:{}, 
      customSections:[], 
      gradientStops:[], 
      gradientType:'', 
      gradAngle:0, 
      bgOpacity:1,
      fontSizes: {},
      textColors: {},
      qrPositions: {},
      sectionNames: {}
    };
    // controls
    document.querySelectorAll('.controls input, .controls textarea, .controls select').forEach(el=>{
      if(el.type==='file') return;
      state.controls[el.id] = (el.type==='checkbox' || el.type==='radio') ? el.checked : el.value;
    });
    // Gradient settings - ensure full preservation of values
    state.gradientStops = Array.from(document.querySelectorAll('#gradStops .gradStopColor')).map(inp=>inp.value);
    state.gradientType = document.getElementById('gradientType').value;
    state.gradAngle = parseInt(document.getElementById('gradAngle').value,10);
    state.bgOpacity = parseFloat(document.getElementById('bgOpacity').value);
    
    // Font sizes and colors
    const fontSizeControls = [
      'mainFindingFontSize', 'posterTitleFontSize', 'sectionHeaderFontSize', 
      'bodyTextFontSize', 'subheaderFontSize', 'authorsFontSize', 
      'affiliationFontSize', 'listItemFontSize', 'figureCaptionFontSize'
    ];
    
    fontSizeControls.forEach(id => {
      const element = document.getElementById(id);
      if (element) {
        state.fontSizes[id] = parseFloat(element.value);
      }
    });
    
    // Text colors
    const colorControls = [
      'mainFindingColor', 'posterTitleColor', 'sectionHeaderColor', 
      'bodyTextColor', 'subheaderColor', 'authorsColor', 
      'affiliationColor', 'listItemColor', 'figureCaptionColor'
    ];
    
    colorControls.forEach(id => {
      const element = document.getElementById(id);
      if (element) {
        state.textColors[id] = element.value;
      }
    });
    // section visibility
    visibilityControls.forEach(id=>{ state.sectionVisibility[id] = !!document.getElementById(id).checked; });
    
    // section names
    document.querySelectorAll('.section-name-input').forEach(input => {
      const section = input.dataset.section;
      if (section) {
        state.sectionNames[section] = input.value;
      }
    });
    
    // QR code positions
    if (typeof window.qrPosition !== 'undefined') {
      state.qrPositions.qrCode = window.qrPosition;
    }
    if (typeof window.qrLabelPosition !== 'undefined') {
      state.qrPositions.qrLabel = window.qrLabelPosition;
    }
    
    // QR code settings
    const attachQRLabel = document.getElementById('attachQRLabel');
    if (attachQRLabel) {
      state.controls['attachQRLabel'] = attachQRLabel.checked;
    }
    
    const matchQRLabelColor = document.getElementById('matchQRLabelColor');
    if (matchQRLabelColor) {
      state.controls['matchQRLabelColor'] = matchQRLabelColor.checked;
    }
    // custom sections
    document.querySelectorAll('.custom-section-control').forEach(div=>{
      const id = div.dataset.id;
      state.customSections.push({
        title: div.querySelector(`#customTitle_${id}`).value,
        content: div.querySelector(`#customContent_${id}`).value,
        visible: div.querySelector(`#showCustomSection_${id}`).checked
      });
    });
    return state;
  }

  // Helper function to directly update CSS variables
  function updateCSSVariable(name, value) {
    document.documentElement.style.setProperty(name, value);
  }

  // Helper function to update display values
  function updateDisplayValue(id, value, suffix = '') {
    const el = document.getElementById(id);
    if (el) el.textContent = value + suffix;
  }

  function applyState(state) {
    console.log('Applying state:', state);
    
    // Phase 1: Set all form control values first
    // Apply basic controls
    Object.entries(state.controls||{}).forEach(([id,val])=>{
      const el=document.getElementById(id);
      if(el){
        if(el.type==='checkbox'||el.type==='radio') el.checked=val;
        else el.value=val;
      }
    });
    
    // Apply background settings
    // First, ensure we have the correct background type
    if (state.controls) {
      // If we have gradient stops but bgType is not set to gradient, fix it
      if (state.gradientStops && state.gradientStops.length >= 2 && state.controls.bgType !== 'gradient') {
        console.log('Detected gradient stops but bgType is not gradient, fixing...');
        state.controls.bgType = 'gradient';
      }
      
      // Select correct bg type radio button
      if (state.controls.hasOwnProperty('bgType')) {
        const bgTypeRadios = document.querySelectorAll('input[name="bgType"]');
        let foundCheckedRadio = false;
        
        bgTypeRadios.forEach(radio => {
          if (radio.value === state.controls.bgType) {
            radio.checked = true;
            foundCheckedRadio = true;
            // Create and dispatch both change and input events
            radio.dispatchEvent(new Event('change', { bubbles: true }));
            radio.dispatchEvent(new Event('input', { bubbles: true }));
          } else {
            radio.checked = false;
          }
        });
        
        // If we didn't find a matching radio, default to color
        if (!foundCheckedRadio && bgTypeRadios.length > 0) {
          bgTypeRadios[0].checked = true; // Default to first option (color)
          bgTypeRadios[0].dispatchEvent(new Event('change', { bubbles: true }));
        }
        
        // Directly set the display style for color and gradient pickers
        const colorPicker = document.getElementById('colorPicker');
        const gradientPicker = document.getElementById('gradientPicker');
        if (colorPicker && gradientPicker) {
          colorPicker.style.display = state.controls.bgType === 'color' ? '' : 'none';
          gradientPicker.style.display = state.controls.bgType === 'gradient' ? '' : 'none';
        }
      }
    }
    
    // Apply dynamic gradient stops completely and accurately
    const container = document.getElementById('gradStops'); 
    if(container){
      container.innerHTML='';
      state.gradientStops.forEach((col,i)=>{
        const div=document.createElement('div'); 
        div.className='grad-stop';
        div.innerHTML=`<label>Stop ${i+1}: <input type="color" class="gradStopColor" value="${col}"></label>`;
        container.appendChild(div);
      });
    }
    
    // Also apply the gradient directly to the middle panel if in gradient mode
    if (state.controls && state.controls.bgType === 'gradient' && state.gradientStops && state.gradientStops.length >= 2) {
      const middlePanel = document.getElementById('middlePanel');
      if (middlePanel) {
        const type = state.gradientType || 'linear';
        const angle = state.gradAngle || 135;
        const stops = state.gradientStops;
        const gradient = type === 'linear'
          ? `linear-gradient(${angle}deg, ${stops.join(', ')})`
          : `radial-gradient(circle at center, ${stops.join(', ')})`;
        middlePanel.style.background = gradient;
        document.documentElement.style.setProperty('--primary-color', stops[0]);
      }
    } else if (state.controls && state.controls.bgType === 'color') {
      // Apply color background
      const middlePanel = document.getElementById('middlePanel');
      const bgColor = state.controls.bgColor || '#000000';
      const bgOpacity = state.bgOpacity || 1;
      if (middlePanel) {
        const rgba = `rgba(${parseInt(bgColor.slice(1,3),16)},${parseInt(bgColor.slice(3,5),16)},${parseInt(bgColor.slice(5,7),16)},${bgOpacity})`;
        middlePanel.style.background = rgba;
        document.documentElement.style.setProperty('--primary-color', rgba);
      }
    }
    
    // Set gradient properties
    if(state.gradientType) {
      const gradTypeEl = document.getElementById('gradientType');
      if (gradTypeEl) {
        gradTypeEl.value = state.gradientType;
        gradTypeEl.dispatchEvent(new Event('change'));
      }
    }
    
    if(state.gradAngle != null) {
      const gradAngleEl = document.getElementById('gradAngle');
      if (gradAngleEl) {
        gradAngleEl.value = state.gradAngle;
        // Update display value
        const gradAngleValueEl = document.getElementById('gradAngleValue');
        if (gradAngleValueEl) gradAngleValueEl.textContent = state.gradAngle + '°';
        gradAngleEl.dispatchEvent(new Event('input'));
      }
    }
    
    if(state.bgOpacity != null) {
      const bgOpacityEl = document.getElementById('bgOpacity');
      if (bgOpacityEl) {
        bgOpacityEl.value = state.bgOpacity;
        // Update display value
        const bgOpacityValueEl = document.getElementById('bgOpacityValue');
        if (bgOpacityValueEl) bgOpacityValueEl.textContent = state.bgOpacity;
        bgOpacityEl.dispatchEvent(new Event('input'));
      }
    }
    // apply section visibility
    Object.entries(state.sectionVisibility||{}).forEach(([id,v])=>{
      const cb=document.getElementById(id); if(cb){cb.checked=v; cb.dispatchEvent(new Event('change'));}
    });
    // apply custom sections
    document.getElementById('customSections').innerHTML='';
    state.customSections.forEach(sec=>{
      const id = ++window.customSectionCount;
      window.createCustomSectionControl(id,sec.title,sec.content);
      document.getElementById(`showCustomSection_${id}`).checked = sec.visible;
      document.getElementById(`showCustomSection_${id}`).dispatchEvent(new Event('change'));
    });
    // Apply font sizes and directly update CSS variables
    if(state.fontSizes) {
      Object.entries(state.fontSizes).forEach(([id, value]) => {
        const element = document.getElementById(id);
        if(element) {
          // Update input value
          element.value = value;
          
          // Update display value
          const valueElement = document.getElementById(id + 'Value');
          if(valueElement) {
            const suffix = valueElement.textContent.includes('rem') ? 'rem' : '';
            valueElement.textContent = value + suffix;
          }
          
          // Directly update CSS variable based on ID pattern
          let cssVarName = '';
          if (id === 'mainFindingFontSize') cssVarName = '--main-finding-font-size';
          else if (id === 'posterTitleFontSize') cssVarName = '--poster-title-font-size';
          else if (id === 'sectionHeaderFontSize') cssVarName = '--section-header-font-size';
          else if (id === 'bodyTextFontSize') cssVarName = '--body-text-font-size';
          else if (id === 'subheaderFontSize') cssVarName = '--subheader-font-size';
          else if (id === 'authorsFontSize') cssVarName = '--authors-font-size';
          else if (id === 'affiliationFontSize') cssVarName = '--affiliation-font-size';
          else if (id === 'listItemFontSize') cssVarName = '--list-item-font-size';
          else if (id === 'figureCaptionFontSize') cssVarName = '--figure-caption-font-size';
          
          if (cssVarName) {
            updateCSSVariable(cssVarName, value + 'rem');
          }
          
          // Also trigger the input event to ensure any event handlers run
          element.dispatchEvent(new Event('input'));
        }
      });
    }
    
    // Apply text colors and directly update CSS variables
    if(state.textColors) {
      Object.entries(state.textColors).forEach(([id, value]) => {
        const element = document.getElementById(id);
        if(element) {
          // Update input value
          element.value = value;
          
          // Directly update CSS variable based on ID pattern
          let cssVarName = '';
          if (id === 'mainFindingColor') cssVarName = '--main-finding-color';
          else if (id === 'posterTitleColor') cssVarName = '--poster-title-color';
          else if (id === 'sectionHeaderColor') cssVarName = '--section-header-color';
          else if (id === 'bodyTextColor') cssVarName = '--body-text-color';
          else if (id === 'subheaderColor') cssVarName = '--subheader-color';
          else if (id === 'authorsColor') cssVarName = '--authors-color';
          else if (id === 'affiliationColor') cssVarName = '--affiliation-color';
          else if (id === 'listItemColor') cssVarName = '--list-item-color';
          else if (id === 'figureCaptionColor') cssVarName = '--figure-caption-color';
          
          if (cssVarName) {
            updateCSSVariable(cssVarName, value);
          }
          
          // Also trigger the input event to ensure any event handlers run
          element.dispatchEvent(new Event('input'));
        }
      });
    }
    
    // Phase 4: Force a complete redraw of the preview
    // First, directly apply all CSS variables to ensure they take effect
    applyFontSizesToCSS(state.fontSizes || {});
    applyTextColorsToCSS(state.textColors || {});
    applyBackgroundToCSS(state);
    
    // Apply section names
    if (state.sectionNames) {
      Object.entries(state.sectionNames).forEach(([section, name]) => {
        const input = document.querySelector(`.section-name-input[data-section="${section}"]`);
        if (input && input.value !== name) {
          input.value = name;
          // Update section headers directly
          const updateSectionHeaderFn = window.updateSectionHeader;
          if (typeof updateSectionHeaderFn === 'function') {
            updateSectionHeaderFn(input);
          }
        }
      });
    }
    
    // Apply QR positions
    if (state.qrPositions) {
      // Store QR code position in global variables for the QR generator
      if (state.qrPositions.qrCode) {
        window.qrPosition = state.qrPositions.qrCode;
        
        // Apply position to the QR container
        const qrContainer = document.getElementById('qrContainer');
        if (qrContainer) {
          qrContainer.style.left = state.qrPositions.qrCode.x + 'px';
          qrContainer.style.top = state.qrPositions.qrCode.y + 'px';
          qrContainer.style.bottom = 'auto';
          qrContainer.style.position = 'absolute';
        }
      }
      
      if (state.qrPositions.qrLabel) {
        window.qrLabelPosition = state.qrPositions.qrLabel;
      }
    }
    
    // Apply all updates immediately
    if(typeof updatePreview === 'function') {
      console.log('Triggering preview update');
      updatePreview();
      
      // Regenerate QR code to apply all settings
      if(typeof window.generateQRCode === 'function') {
        window.generateQRCode();
      }
    }
    
    // Schedule a final update to catch any edge cases
    setTimeout(() => {
      if(typeof updatePreview === 'function') updatePreview();
      console.log('State application complete');
    }, 200);
  }
  // Save poster configuration to JSON file
  function savePosterConfig() {
    try {
      console.log('savePosterConfig called');
      const state = collectState();
      const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
      const a = document.createElement('a');
      const url = URL.createObjectURL(blob);
      a.href = url;
      a.download = 'poster_config.json';
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }, 100);
      return true;
    } catch (error) {
      console.error('Error saving poster configuration:', error);
      alert('Failed to save poster configuration. Please try again.');
      return false;
    }
  }
  
  // Expose savePosterConfig to the global scope
  window.savePosterConfig = savePosterConfig;

  window.loadPosterConfig = function(file) {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        console.log('Loading poster configuration...');
        const state = JSON.parse(reader.result);
        applyState(state);
        console.log('Poster configuration loaded successfully');
      } catch(e) {
        console.error('Error loading poster configuration:', e);
        alert('Invalid config file: ' + e.message);
      }
    };
    reader.readAsText(file);
  };

  // Helper functions for direct CSS application
  function applyFontSizesToCSS(fontSizes) {
    const fontSizeMap = {
      'mainFindingFontSize': '--main-finding-font-size',
      'posterTitleFontSize': '--poster-title-font-size',
      'sectionHeaderFontSize': '--section-header-font-size',
      'bodyTextFontSize': '--body-text-font-size',
      'subheaderFontSize': '--subheader-font-size',
      'authorsFontSize': '--authors-font-size',
      'affiliationFontSize': '--affiliation-font-size',
      'listItemFontSize': '--list-item-font-size',
      'figureCaptionFontSize': '--figure-caption-font-size'
    };
    
    Object.entries(fontSizes).forEach(([id, value]) => {
      const cssVar = fontSizeMap[id];
      if (cssVar) {
        document.documentElement.style.setProperty(cssVar, value + 'rem');
        console.log(`Applied font size: ${cssVar} = ${value}rem`);
      }
    });
  }
  
  function applyTextColorsToCSS(textColors) {
    const colorMap = {
      'mainFindingColor': '--main-finding-color',
      'posterTitleColor': '--poster-title-color',
      'sectionHeaderColor': '--section-header-color',
      'bodyTextColor': '--body-text-color',
      'subheaderColor': '--subheader-color',
      'authorsColor': '--authors-color',
      'affiliationColor': '--affiliation-color',
      'listItemColor': '--list-item-color',
      'figureCaptionColor': '--figure-caption-color'
    };
    
    Object.entries(textColors).forEach(([id, value]) => {
      const cssVar = colorMap[id];
      if (cssVar) {
        document.documentElement.style.setProperty(cssVar, value);
        console.log(`Applied text color: ${cssVar} = ${value}`);
      }
    });
  }
  
  function applyBackgroundToCSS(state) {
    const middlePanel = document.getElementById('middlePanel');
    if (!middlePanel) return;
    
    const bgType = state.controls && state.controls.bgType;
    
    if (bgType === 'gradient' && state.gradientStops && state.gradientStops.length >= 2) {
      const type = state.gradientType || 'linear';
      const angle = state.gradAngle || 135;
      const stops = state.gradientStops;
      const gradient = type === 'linear'
        ? `linear-gradient(${angle}deg, ${stops.join(', ')})`
        : `radial-gradient(circle at center, ${stops.join(', ')})`;
      
      middlePanel.style.background = gradient;
      document.documentElement.style.setProperty('--primary-color', stops[0]);
      console.log(`Applied gradient background: ${gradient}`);
    } 
    else if (bgType === 'color') {
      const bgColor = state.controls.bgColor || '#000000';
      const bgOpacity = state.bgOpacity || 1;
      
      const r = parseInt(bgColor.slice(1,3), 16);
      const g = parseInt(bgColor.slice(3,5), 16);
      const b = parseInt(bgColor.slice(5,7), 16);
      const rgba = `rgba(${r},${g},${b},${bgOpacity})`;
      
      middlePanel.style.background = rgba;
      document.documentElement.style.setProperty('--primary-color', rgba);
      console.log(`Applied color background: ${rgba}`);
    }
  }
  
  // Set up event listeners when DOM is loaded
  function initConfigManager() {
    console.log('configManager: binding save/load buttons');
    const saveBtn = document.getElementById('saveJSON');
    if (saveBtn) {
      saveBtn.addEventListener('click', savePosterConfig);
      console.log('Save button listener attached');
    } else {
      console.warn('configManager: saveJSON button not found');
    }
    
    const loadInput = document.getElementById('loadJSON');
    if (loadInput) {
      loadInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) window.loadPosterConfig(file);
      });
      console.log('Load input listener attached');
    } else {
      console.warn('configManager: loadJSON input not found');
    }
  }
  
  // Run setup when DOM is loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initConfigManager);
  } else {
    initConfigManager();
  }
})();
