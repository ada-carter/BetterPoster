document.addEventListener('DOMContentLoaded', () => {
  // Create font controls fieldset
  const fontSizeFieldset = document.createElement('fieldset');
  fontSizeFieldset.innerHTML = `
    <legend>Text Controls</legend>
    <details open>
      <summary>Main Text Elements</summary>
      <div style="display:flex;align-items:center;margin-bottom:8px;">
        <label style="margin-right:10px;flex:1;">Main Finding:</label>
        <input type="range" id="mainFindingFontSize" min="1.5" max="4" step="0.1" value="1.6" style="width:50%">
        <span id="mainFindingFontSizeValue" style="width:15%;text-align:center;">1.6rem</span>
        <input type="color" id="mainFindingColor" value="#ffffff" title="Text color">
      </div>
      <div style="display:flex;align-items:center;margin-bottom:8px;">
        <label style="margin-right:10px;flex:1;">Poster Title:</label>
        <input type="range" id="posterTitleFontSize" min="1" max="2.5" step="0.1" value="1" style="width:50%">
        <span id="posterTitleFontSizeValue" style="width:15%;text-align:center;">1rem</span>
        <input type="color" id="posterTitleColor" value="#000000" title="Text color">
      </div>
      <div style="display:flex;align-items:center;margin-bottom:8px;">
        <label style="margin-right:10px;flex:1;">Section Headers:</label>
        <input type="range" id="sectionHeaderFontSize" min="0.8" max="1.8" step="0.1" value="1" style="width:50%">
        <span id="sectionHeaderFontSizeValue" style="width:15%;text-align:center;">1rem</span>
        <input type="color" id="sectionHeaderColor" value="#000000" title="Text color">
      </div>
    </details>
    <details>
      <summary>Body & Subheaders</summary>
      <div style="display:flex;align-items:center;margin-bottom:8px;">
        <label style="margin-right:10px;flex:1;">Body Text:</label>
        <input type="range" id="bodyTextFontSize" min="0.6" max="1.2" step="0.05" value="0.6" style="width:50%">
        <span id="bodyTextFontSizeValue" style="width:15%;text-align:center;">0.6rem</span>
        <input type="color" id="bodyTextColor" value="#000000" title="Text color">
      </div>
      <div style="display:flex;align-items:center;margin-bottom:8px;">
        <label style="margin-right:10px;flex:1;">Subheaders:</label>
        <input type="range" id="subheaderFontSize" min="0.5" max="1.5" step="0.05" value="0.5" style="width:50%">
        <span id="subheaderFontSizeValue" style="width:15%;text-align:center;">0.5rem</span>
        <input type="color" id="subheaderColor" value="#000000" title="Text color">
      </div>
    </details>
    <details>
      <summary>Other Elements</summary>
      <div style="display:flex;align-items:center;margin-bottom:8px;">
        <label style="margin-right:10px;flex:1;">Authors:</label>
        <input type="range" id="authorsFontSize" min="0.6" max="1.5" step="0.05" value="0.6" style="width:50%">
        <span id="authorsFontSizeValue" style="width:15%;text-align:center;">0.6rem</span>
        <input type="color" id="authorsColor" value="#000000" title="Text color">
      </div>
      <div style="display:flex;align-items:center;margin-bottom:8px;">
        <label style="margin-right:10px;flex:1;">Affiliations:</label>
        <input type="range" id="affiliationFontSize" min="0.6" max="1.5" step="0.05" value="0.6" style="width:50%">
        <span id="affiliationFontSizeValue" style="width:15%;text-align:center;">0.6rem</span>
        <input type="color" id="affiliationColor" value="#000000" title="Text color">
      </div>
      <div style="display:flex;align-items:center;margin-bottom:8px;">
        <label style="margin-right:10px;flex:1;">List Items:</label>
        <input type="range" id="listItemFontSize" min="0.6" max="1.2" step="0.05" value="0.6" style="width:50%">
        <span id="listItemFontSizeValue" style="width:15%;text-align:center;">0.6rem</span>
        <input type="color" id="listItemColor" value="#000000" title="Text color">
      </div>
      <div style="display:flex;align-items:center;margin-bottom:8px;">
        <label style="margin-right:10px;flex:1;">Figure Captions:</label>
        <input type="range" id="figureCaptionFontSize" min="0.6" max="1.2" step="0.05" value="0.6" style="width:50%">
        <span id="figureCaptionFontSizeValue" style="width:15%;text-align:center;">0.6rem</span>
        <input type="color" id="figureCaptionColor" value="#000000" title="Text color">
      </div>
      <div style="display:flex;align-items:center;margin-bottom:8px;">
        <label style="margin-right:10px;flex:1;">QR Label:</label>
        <input type="range" id="qrLabelFontSize" min="0.5" max="1" step="0.05" value="0.5" style="width:50%">
        <span id="qrLabelFontSizeValue" style="width:15%;text-align:center;">0.5rem</span>
        <input type="color" id="qrLabelColor" value="#ffffff" title="Text color">
      </div>
    </details>
  `;

  // Insert at the top of controls
  const firstFieldset = document.querySelector('.controls fieldset');
  if (firstFieldset && firstFieldset.parentNode) {
    firstFieldset.parentNode.insertBefore(fontSizeFieldset, firstFieldset);
  }

  // Add event listeners for font controls
  document.getElementById('mainFindingFontSize').addEventListener('input', e => {
    const v = e.target.value;
    document.getElementById('mainFindingFontSizeValue').textContent = v + 'rem';
    document.documentElement.style.setProperty('--main-finding-font-size', v + 'rem');
    window.updatePreview();
  });
  document.getElementById('mainFindingColor').addEventListener('input', e => {
    document.documentElement.style.setProperty('--main-finding-color', e.target.value);
    window.updatePreview();
  });

  document.getElementById('posterTitleFontSize').addEventListener('input', e => {
    const v = e.target.value;
    document.getElementById('posterTitleFontSizeValue').textContent = v + 'rem';
    document.documentElement.style.setProperty('--poster-title-font-size', v + 'rem');
    window.updatePreview();
  });
  document.getElementById('posterTitleColor').addEventListener('input', e => {
    document.documentElement.style.setProperty('--poster-title-color', e.target.value);
    window.updatePreview();
  });

  document.getElementById('sectionHeaderFontSize').addEventListener('input', e => {
    const v = e.target.value;
    document.getElementById('sectionHeaderFontSizeValue').textContent = v + 'rem';
    document.documentElement.style.setProperty('--section-header-font-size', v + 'rem');
    window.updatePreview();
  });
  document.getElementById('sectionHeaderColor').addEventListener('input', e => {
    document.documentElement.style.setProperty('--section-header-color', e.target.value);
    window.updatePreview();
  });

  document.getElementById('bodyTextFontSize').addEventListener('input', e => {
    const v = e.target.value;
    document.getElementById('bodyTextFontSizeValue').textContent = v + 'rem';
    document.documentElement.style.setProperty('--body-text-font-size', v + 'rem');
    window.updatePreview();
  });
  document.getElementById('bodyTextColor').addEventListener('input', e => {
    document.documentElement.style.setProperty('--body-text-color', e.target.value);
    window.updatePreview();
  });

  document.getElementById('subheaderFontSize').addEventListener('input', e => {
    const v = e.target.value;
    document.getElementById('subheaderFontSizeValue').textContent = v + 'rem';
    document.documentElement.style.setProperty('--subheader-font-size', v + 'rem');
    window.updatePreview();
  });
  document.getElementById('subheaderColor').addEventListener('input', e => {
    document.documentElement.style.setProperty('--subheader-color', e.target.value);
    window.updatePreview();
  });

  document.getElementById('authorsFontSize').addEventListener('input', e => {
    const v = e.target.value;
    document.getElementById('authorsFontSizeValue').textContent = v + 'rem';
    document.documentElement.style.setProperty('--authors-font-size', v + 'rem');
    window.updatePreview();
  });
  document.getElementById('authorsColor').addEventListener('input', e => {
    document.documentElement.style.setProperty('--authors-color', e.target.value);
    window.updatePreview();
  });

  document.getElementById('affiliationFontSize').addEventListener('input', e => {
    const v = e.target.value;
    document.getElementById('affiliationFontSizeValue').textContent = v + 'rem';
    document.documentElement.style.setProperty('--affiliation-font-size', v + 'rem');
    window.updatePreview();
  });
  document.getElementById('affiliationColor').addEventListener('input', e => {
    document.documentElement.style.setProperty('--affiliation-color', e.target.value);
    window.updatePreview();
  });

  document.getElementById('listItemFontSize').addEventListener('input', e => {
    const v = e.target.value;
    document.getElementById('listItemFontSizeValue').textContent = v + 'rem';
    document.documentElement.style.setProperty('--list-item-font-size', v + 'rem');
    window.updatePreview();
  });
  document.getElementById('listItemColor').addEventListener('input', e => {
    document.documentElement.style.setProperty('--list-item-color', e.target.value);
    window.updatePreview();
  });

  document.getElementById('figureCaptionFontSize').addEventListener('input', e => {
    const v = e.target.value;
    document.getElementById('figureCaptionFontSizeValue').textContent = v + 'rem';
    document.documentElement.style.setProperty('--figure-caption-font-size', v + 'rem');
    window.updatePreview();
  });
  document.getElementById('figureCaptionColor').addEventListener('input', e => {
    document.documentElement.style.setProperty('--figure-caption-color', e.target.value);
    window.updatePreview();
  });

  document.getElementById('qrLabelFontSize').addEventListener('input', e => {
    const v = e.target.value;
    document.getElementById('qrLabelFontSizeValue').textContent = v + 'rem';
    document.documentElement.style.setProperty('--qr-label-font-size', v + 'rem');
    window.updatePreview();
  });
  document.getElementById('qrLabelColor').addEventListener('input', e => {
    document.documentElement.style.setProperty('--qr-label-color', e.target.value);
    window.updatePreview();
  });
});
