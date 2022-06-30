import SparkMD5 from 'spark-md5';

export const md5 = (file, chunkSize, callback) => {
  chunkSize = chunkSize || 2097152; // Read in chunks of 2MB
  // eslint-disable-next-line @typescript-eslint/unbound-method
  let blobSlice = File.prototype.slice || File.prototype['mozSlice'] || File.prototype['webkitSlice'],
    chunks = Math.ceil(file.size / chunkSize),
    currentChunk = 0,
    spark = new SparkMD5.ArrayBuffer(),
    fileReader = new FileReader();

  fileReader.onload = function (e) {
    // console.log('read chunk nr', currentChunk + 1, 'of', chunks);
    spark.append(e.target.result); // Append array buffer
    currentChunk++;

    if (currentChunk < chunks) {
      loadNext();
    } else {
      callback(spark.end());
    }
  };

  fileReader.onerror = function () {
    console.warn('oops, something went wrong.');
  };

  function loadNext() {
    let start = currentChunk * chunkSize,
      end = start + chunkSize >= file.size ? file.size : start + chunkSize;

    fileReader.readAsArrayBuffer(blobSlice.call(file, start, end));
  }

  loadNext();
};
