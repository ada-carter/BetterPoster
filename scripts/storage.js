document.addEventListener('DOMContentLoaded', () => {
  const saveBtn = document.getElementById('saveJSON');
  const loadInput = document.getElementById('loadJSON');

  // Get visibility checkboxes
  const visibilityControls = [
    'showPosterTitle', 'showIntroduction', 'showObjective', 'showMethodology',
    'showAnalysis', 'showResults', 'showFigures', 'showConclusion',
    'showAcknowledgements', 'showReferences'
  ];

  const saveJSON = () => {
    // Collect all form control values
    const state = {
      controls: {},
      customSections: [],
      sectionVisibility: {}
    };

    // Save all form controls
    document.querySelectorAll('.controls input, .controls textarea, .controls select').forEach(el => {
      if (el.type === 'file') return; // Skip file inputs
      if (el.type === 'checkbox' || el.type === 'radio') {
        state.controls[el.id] = el.checked;
      } else {
        state.controls[el.id] = el.value;
      }
    });

    // Save section visibility states
    visibilityControls.forEach(id => {
      const checkbox = document.getElementById(id);
      if (checkbox) {
        state.sectionVisibility[id] = checkbox.checked;
      }
    });

    // Save custom sections
    const customSections = document.querySelectorAll('.custom-section-control');
    customSections.forEach(section => {
      const id = section.dataset.id;
      const title = section.querySelector(`#customTitle_${id}`).value;
      const content = section.querySelector(`#customContent_${id}`).value;
      state.customSections.push({ title, content });
    });

    // Create and trigger download
    const dataStr = JSON.stringify(state, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'poster_config.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const loadJSON = (file) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const state = JSON.parse(reader.result);
        
        // Clear existing custom sections
        const customSectionsContainer = document.getElementById('customSections');
        customSectionsContainer.innerHTML = '';
        
        // Apply form control values
        if (state.controls) {
          Object.entries(state.controls).forEach(([id, value]) => {
            const el = document.getElementById(id);
            if (!el) return;
            if (el.type === 'checkbox' || el.type === 'radio') {
              el.checked = value;
            } else {
              el.value = value;
            }
          });
        }

        // Restore section visibility
        if (state.sectionVisibility) {
          Object.entries(state.sectionVisibility).forEach(([id, visible]) => {
            const checkbox = document.getElementById(id);
            if (checkbox) {
              checkbox.checked = visible;
              // Trigger the change event to update visibility
              const event = new Event('change');
              checkbox.dispatchEvent(event);
            }
          });
        }

        // Recreate custom sections
        if (state.customSections && Array.isArray(state.customSections)) {
          state.customSections.forEach(section => {
            // Use the global counter from scripts.js
            const id = ++window.customSectionCount;
            if (typeof createCustomSectionControl === 'function') {
              createCustomSectionControl(id, section.title, section.content);
            }
          });
        }

        // Update preview
        if (typeof updatePreview === 'function') {
          updatePreview();
        }
      } catch (err) {
        console.error('Failed to load poster configuration:', err);
        alert('Error: Invalid poster configuration file. Please check the file format.');
      }
    };
    reader.readAsText(file);
  };

  // Event listeners
  saveBtn.addEventListener('click', saveJSON);
  loadInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      loadJSON(file);
    }
  });
});