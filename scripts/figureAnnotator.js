// Figure Annotator: Allows drawing, arrows, text, and highlights on uploaded images
(function(){
  // HTML for annotator modal
  const annotatorHTML = `
    <style>
      .figure-annotator-modal { position: fixed; top:0; left:0; width:100vw; height:100vh; z-index:9999; display:none; align-items:center; justify-content:center; }
      .annotator-backdrop { position: absolute; top:0; left:0; width:100vw; height:100vh; background:rgba(0,0,0,0.3); z-index:0; }
      .annotator-content { position: relative; background: #fff; border-radius: 8px; box-shadow: 0 4px 32px #0005; padding: 24px; z-index:1; min-width: 350px; min-height: 350px; }
      .annotator-toolbar { margin-bottom: 10px; display: flex; gap: 8px; align-items: center; }
      .annotator-canvas-wrap { text-align: center; }
      #annotatorCanvas { border: 1px solid #888; background: #fff; max-width: 100%; max-height: 60vh; }
    </style>
    <div id="figureAnnotatorModal" class="figure-annotator-modal" style="display:none;">
      <div class="annotator-backdrop"></div>
      <div class="annotator-content">
        <div class="annotator-toolbar">
          <button data-tool="draw">✏️ Draw</button>
          <button data-tool="arrow">➡️ Arrow</button>
          <button data-tool="text">🔤 Text</button>
          <button data-tool="highlight">🖍️ Highlight</button>
          <input type="color" id="annotatorColor" value="#ff0000" title="Color" />
          <input type="range" id="annotatorSize" min="1" max="16" value="3" title="Size" />
          <button id="annotatorDone">Done</button>
          <button id="annotatorCancel">Cancel</button>
        </div>
        <div class="annotator-canvas-wrap">
          <canvas id="annotatorCanvas"></canvas>
        </div>
      </div>
    </div>`;
  document.body.insertAdjacentHTML('beforeend', annotatorHTML);

  // State
  let currentTool = 'draw', drawing = false, startX = 0, startY = 0, lastX = 0, lastY = 0, textInput = null, img = null;
  let figureCallback = null;
  const modal = document.getElementById('figureAnnotatorModal');
  const canvas = document.getElementById('annotatorCanvas');
  const ctx = canvas.getContext('2d');
  const colorInput = document.getElementById('annotatorColor');
  const sizeInput = document.getElementById('annotatorSize');

  // Toolbar tool selection
  modal.querySelectorAll('.annotator-toolbar button[data-tool]').forEach(btn => {
    btn.addEventListener('click', () => {
      currentTool = btn.dataset.tool;
    });
  });

  // Done/Cancel
  document.getElementById('annotatorDone').onclick = () => {
    modal.style.display = 'none';
    if (figureCallback) figureCallback(canvas.toDataURL());
  };
  document.getElementById('annotatorCancel').onclick = () => {
    modal.style.display = 'none';
  };
  modal.querySelector('.annotator-backdrop').onclick = () => {
    modal.style.display = 'none';
  };

  // Drawing logic
  function setCanvasImage(imageDataURL) {
    img = new window.Image();
    img.onload = function() {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.clearRect(0,0,canvas.width,canvas.height);
      ctx.drawImage(img,0,0);
    };
    img.src = imageDataURL;
    // Remove any stray text input
    if (textInput) { textInput.remove(); textInput = null; }
  
  }
  canvas.onmousedown = function(e) {
    if(currentTool==="text") return;
    drawing = true;
    [startX, startY] = [e.offsetX, e.offsetY];
    [lastX, lastY] = [e.offsetX, e.offsetY];
    ctx.strokeStyle = colorInput.value;
    ctx.lineWidth = sizeInput.value;
    if(currentTool==="highlight") ctx.globalAlpha = 0.3;
    else ctx.globalAlpha = 1.0;
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
  };
  canvas.onmousemove = function(e) {
    if(!drawing) return;
    if(currentTool==="draw"||currentTool==="highlight"){
      ctx.lineTo(e.offsetX, e.offsetY);
      ctx.stroke();
      [lastX, lastY] = [e.offsetX, e.offsetY];
    }
  };
  canvas.onmouseup = function(e) {
    if(!drawing) return;
    drawing = false;
    if(currentTool==="arrow"){
      ctx.globalAlpha = 1.0;
      drawArrow(startX, startY, e.offsetX, e.offsetY, ctx.strokeStyle, ctx.lineWidth);
    }
  };
  canvas.onclick = function(e) {
    if(currentTool==="text"){
      if(textInput) textInput.remove();
      textInput = document.createElement('input');
      textInput.type = 'text';
      textInput.style.position = 'absolute';
      // Place input inside modal for proper overlay
      const rect = canvas.getBoundingClientRect();
      textInput.style.left = (e.offsetX - 2) + 'px';
      textInput.style.top = (e.offsetY - 10) + 'px';
      textInput.style.zIndex = 1001;
      textInput.style.font = `${sizeInput.value*5}px sans-serif`;
      textInput.style.color = colorInput.value;
      textInput.style.background = '#fff';
      textInput.style.border = '1px solid #888';
      textInput.style.padding = '2px 4px';
      textInput.onblur = function(){
        ctx.font = `${sizeInput.value*5}px sans-serif`;
        ctx.fillStyle = colorInput.value;
        ctx.globalAlpha = 1.0;
        ctx.fillText(textInput.value, e.offsetX, e.offsetY+parseInt(sizeInput.value)*2);
        textInput.remove();
        textInput = null;
      };
      // Insert into modal, not document.body
      modal.querySelector('.annotator-content').appendChild(textInput);
      textInput.focus();
    }
  };

  function drawArrow(x1, y1, x2, y2, color, width) {
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    // Arrowhead
    const angle = Math.atan2(y2-y1, x2-x1);
    const headlen = 10+width*2;
    ctx.beginPath();
    ctx.moveTo(x2, y2);
    ctx.lineTo(x2-headlen*Math.cos(angle-Math.PI/6), y2-headlen*Math.sin(angle-Math.PI/6));
    ctx.moveTo(x2, y2);
    ctx.lineTo(x2-headlen*Math.cos(angle+Math.PI/6), y2-headlen*Math.sin(angle+Math.PI/6));
    ctx.stroke();
    ctx.restore();
  }

  // Public API
  window.openFigureAnnotator = function(imageDataURL, callback) {
    setCanvasImage(imageDataURL);
    figureCallback = callback;
    modal.style.display = 'flex';
  };
})();
