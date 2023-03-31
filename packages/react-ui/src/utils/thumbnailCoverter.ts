export function pdfToPng(url) {
  const pdfjsLib = require('pdfjs-dist/webpack');
  return new Promise(function (resolve, reject) {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      // Load the PDF file
      pdfjsLib
        .getDocument(url)
        .promise.then((pdf) => {
          // Get the first page of the PDF
          return pdf.getPage(1);
        })
        .then((page) => {
          // Set the canvas dimensions to match the PDF page dimensions
          const viewport = page.getViewport({scale: 1});
          canvas.width = viewport.width;
          canvas.height = viewport.height;

          // Render the PDF page onto the canvas
          const renderContext = {
            canvasContext: ctx,
            viewport: viewport
          };
          return page.render(renderContext).promise;
        })
        .then(() => {
          // Convert the canvas to an image
          const thumbnailUrl = canvas.toDataURL('image/jpeg', 1);
          // Resolve the Promise with the generated value
          resolve(thumbnailUrl);
        });
    } catch (e) {
      reject(e);
      console.log(e);
    }
  });
}

export function createThumbnail(image) {
  return new Promise(function (resolve, reject) {
    try {
      const img = new Image();
      img.src = image;
      img.onload = function () {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        // Get the current viewport dimensions
        let viewportWidth = window.innerWidth || document.documentElement.clientWidth;
        let viewportHeight = window.innerHeight || document.documentElement.clientHeight;
        // Set the canvas width and height to match the viewport
        canvas.width = viewportWidth;
        canvas.height = viewportHeight;
        // Draw the canvas
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const thumbnailData = canvas.toDataURL('image/jpeg', 0.5);
        // Resolve the Promise with the generated value
        resolve(thumbnailData);
      };
      img.crossOrigin = '*';
    } catch (e) {
      reject(e);
      console.log(e);
    }
  });
}

export function createVideoThumbnail(file) {
  return new Promise(function (resolve, reject) {
    try {
      const video = document.createElement('video');
      video.src = file;
      video.crossOrigin = '*';
      video.load();
      video.addEventListener('loadeddata', function () {
        const canvas = document.createElement('canvas');
        // Get the current viewport dimensions
        let viewportWidth = window.innerWidth || document.documentElement.clientWidth;
        let viewportHeight = window.innerHeight || document.documentElement.clientHeight;
        // Set the canvas width and height to match the viewport
        canvas.width = viewportWidth;
        canvas.height = viewportHeight;
        const ctx = canvas.getContext('2d');
        // Draw the canvas
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const thumbnailUrl = canvas.toDataURL('image/jpeg', 0.5);
        // Resolve the Promise with the generated value
        resolve(thumbnailUrl);
      });
    } catch (e) {
      reject(e);
      console.log(e);
    }
  });
}

export function dataURLtoFile(dataUrl, fileName) {
  let arr = dataUrl.split(','),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);
  const _fileName = fileName.endsWith('.pdf') ? fileName.replace(/\.pdf$/, '.jpeg') : fileName;

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], _fileName, {type: mime});
}
