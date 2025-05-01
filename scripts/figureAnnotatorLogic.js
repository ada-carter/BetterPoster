// Logic for Figure Annotator integration and right panel preview
(function(){
  const fileInput = document.getElementById('annotatorFigureInput');
  const openBtn = document.getElementById('openAnnotatorBtn');
  const previewImg = document.getElementById('annotatorFigurePreview');
  const displayImg = document.getElementById('annotatedFigureDisplay');
  const titleInput = document.getElementById('annotatorFigureTitle');
  const captionInput = document.getElementById('annotatorFigureCaption');
  const displayTitle = document.getElementById('annotatedFigureTitle');
  const displayCaption = document.getElementById('annotatedFigureCaption');
  const figuresSection = document.getElementById('figuresSection');

  let annotatedDataUrl = '';

  // Enable annotator when image is loaded
  fileInput.addEventListener('change', function(){
    const file = fileInput.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e){
      previewImg.src = e.target.result;
      previewImg.style.display = 'block';
      openBtn.disabled = false;
      annotatedDataUrl = e.target.result;
      updateFigurePreview();
    };
    reader.readAsDataURL(file);
  });

  openBtn.addEventListener('click', function(){
    if (!annotatedDataUrl) return;
    window.openFigureAnnotator(annotatedDataUrl, function(annotatedUrl){
      annotatedDataUrl = annotatedUrl;
      updateFigurePreview();
    });
  });

  titleInput.addEventListener('input', updateFigurePreview);
  captionInput.addEventListener('input', updateFigurePreview);

  function updateFigurePreview(){
    if (annotatedDataUrl) {
      displayImg.src = annotatedDataUrl;
      figuresSection.style.display = 'block';
    } else {
      displayImg.src = '';
      figuresSection.style.display = 'none';
    }
    displayTitle.textContent = titleInput.value;
    displayCaption.textContent = captionInput.value;
    if (typeof window.updatePreview === 'function') window.updatePreview();
  }
})();
