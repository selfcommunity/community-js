import {SCMessageFileType} from '@selfcommunity/types';

export const pdfImagePlaceholder =
  'data:image/png;base64,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';
export const videoPlaceholder =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAYAAADimHc4AAAACXBIWXMAAAsTAAALEwEAmpwYAAACYUlEQVR4nO3cvWoUURjG8T/YrGAROzFi5Q1oa+Fd2Jp02tiGpPcCvAE/+mxAvIpEsfILBat0ogtJsBKfsDA2h4zuTDL7vjvn+cHTHrLPO3POptgDZmZmZmZmZmZmZmZmZmZpXAU2gT3gM3ACaEVy0vzN0+YzrLFCLgM7wCxBkbqgzD/LNjAhuevAQYLCNFDeATdJ6gZwmKAkDZzD5rOm23beJihHS8pBtu1oJ0EpWnLmZ8J53AOeAx+bvATu9P22M6YDVwtm1nz2Li4B94E3LWv+Bh51HcBmgjIUlI0FO7oCPAa+LbDmfAh3uwxgL0ERCsruf7q5BjwBfnRc91WXAXxNUISCMv9n7Sy3gKfAr57rfu8ygOMERSgoR2f08Rr4cwFrL0yVpzTUuq1UeUoeAB5A+FMpvwHxxchbUHw58hkw/pSGWreVKk/JA8ADCH8q5Tcgvhh5C4ovRz4Dxp/SUOu2UuUpeQB4AOFPpfwGxBcjb0Hx5chnwPhTGmrdVqo8JQ8ADyD8qZTfgPhi5C0ovhz5DBh/SkOt20qVp+QB4AGEP5XyGxBfjLwFxZcjnwHjT2modVup8pQ8ADyA8KdSfgPii5G3oPhyVMMZcJSgBNX8I70vCYpQUD5l+JnqNEERqvmH2hsJilBQHmS4qqDWyzp+9rjKbJHLOh7Sw3aCQrTkbHH+62qeAe+BD8AL4HbfxSYjv6pMRfazXdg0t17RlWXrJL60bz9BSarx0r6/Js2ZMBvZgbuVcdv5l7XmK+q0+Ydlla61OW7+5t3mq+ZKXdxqZmZmZmZmZmZmZmZmZkZ3p+uwFZYL7fr1AAAAAElFTkSuQmCC';
export const documentPlaceholder =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAuUlEQVR4nO3WQQpCMRRD0axCxP0vSRRXExE6EMHBl5e09uVCcSiHBi2Q/isKzw3AeQcIATwAXJyQ6uwYiiH3t0/pzNSQE4Cr42YohsCFoQFiwdAEkWNohLySYdwQGWYGRIKZBSnHOP7Zj7zNtoCw4gtnx0BGuZHimGl1mxaLz7cCaTctVwyk241Q9Cv1WSDtpuWKgXS7EeathbUeja4YyCg3UhwzrVGmVRwzrVGmteq0uMj5uW0gCeaeAHHCuEhTlUIAAAAASUVORK5CYII=';

export const audioPlaceHolder =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAABVElEQVR4nO3Xu0rEUBDG8b8PoJUXrAT3EWxsrOztLHwISwtRK1sVS7e1tbQWLBWs3EJ8BhsFr4WMBKaQRV3WnJlkwnwwBAI5OT/OJSeQiRUxqjtgvgsQ8caIlkWbrhgxhAy+XWcLv8MVMgPceo2MGELwxIgxxA0jDhAXjDhBzDHiCKlihvGGmGGagJhgmoIUx1gfUcapQYmXlkydg2arII30QxLSwRFZB/rAAbAJzEWFPAwt2BdgH5iMBnn8ZQd6Ba6A5egQ0TrsCuQoEuQZWAE2gFPgIyrkaejeArAHnAOrkSHjRhKiyRHRTABvXZhaa/p8KMgisAWcAGfANfAZDbIEvP/x0at2Lo9+1G5gd8TXu/rnDgHZHgE5jgLp6Tr4CXEPTEda7D09yV4CN8AFsANM1elAW7bfUpGEaHJECkdyamlyahWO5NTSSMvq3+kMJINzvgAzxLJFazyrgQAAAABJRU5ErkJggg==';

const MAX_WIDTH = 1920;

export function isSupportedVideoFormat(filename) {
  const extension = filename.split('.').pop().toLowerCase();
  const supportedFormats = ['mp4', 'webm', 'ogv', 'mp3', 'm3u8', 'mpd'];
  return supportedFormats.includes(extension);
}

function dataURLtoFile(dataUrl, file) {
  let arr = dataUrl.split(','),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);
  const _fileName = file.file && file.file.type.startsWith(SCMessageFileType.DOCUMENT) ? file.file.name.replace(/(\.[^.]+)$/, '.jpeg') : file.name;
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], _fileName, {type: mime});
}

export function createAudioThumbnail(file) {
  return new Promise(function (resolve, reject) {
    try {
      resolve(dataURLtoFile(audioPlaceHolder, file));
    } catch (e) {
      reject(e);
      console.log(e);
    }
  });
}

export function createDocumentThumbnail(url, file) {
  const pdfjsLib = require('pdfjs-dist/webpack');
  return new Promise(function (resolve, reject) {
    try {
      if (!file.file.name.endsWith('.pdf')) {
        resolve(dataURLtoFile(documentPlaceholder, file));
      } else {
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
            resolve(dataURLtoFile(thumbnailUrl, file));
          })
          .catch((error) => {
            console.error('Error converting PDF to JPEG:', error);
            reject(error);
            return Promise.reject(error);
          });
      }
    } catch (e) {
      reject(e);
      console.log(e);
    }
  });
}

export function createThumbnail(file) {
  return new Promise(function (resolve, reject) {
    try {
      const reader = new FileReader();
      reader.onload = (event) => {
        let img = new Image();
        img.onload = function () {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          canvas.width = MAX_WIDTH;
          //to keep aspect ratio
          const scaleSize = MAX_WIDTH / img.width;
          canvas.height = img.height * scaleSize;
          // Draw the canvas
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          const thumbnailData = canvas.toDataURL('image/jpeg', 0.5);
          // Resolve the Promise with the generated value
          resolve(dataURLtoFile(thumbnailData, file));
        };
        img.src = event.target.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    } catch (e) {
      reject(e);
      console.log(e);
    }
  });
}

export function createVideoThumbnail(fileUrl, file) {
  return new Promise(function (resolve, reject) {
    try {
      const video = document.createElement('video');
      video.src = fileUrl;
      video.crossOrigin = '*';
      if (!isSupportedVideoFormat(file.file.name)) {
        resolve(dataURLtoFile(videoPlaceholder, file));
      } else {
        video.addEventListener('seeked', function () {
          const canvas = document.createElement('canvas');
          canvas.width = MAX_WIDTH;
          //to keep aspect ratio
          const scaleSize = MAX_WIDTH / video.videoWidth;
          canvas.height = video.videoHeight * scaleSize;
          const ctx = canvas.getContext('2d');
          // Draw the canvas
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const thumbnailUrl = canvas.toDataURL('image/jpeg', 0.5);
          // Resolve the Promise with the generated value
          resolve(dataURLtoFile(thumbnailUrl, file));
        });
      }
      video.currentTime = 1;
    } catch (e) {
      reject(e);
      console.log(e);
    }
  });
}
