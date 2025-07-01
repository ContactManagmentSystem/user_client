// utils/convertImage.js

export const convertImageToFormat = async (file, format = 'image/jpeg') => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    const url = URL.createObjectURL(file);

    image.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      // Set canvas size to the image size
      canvas.width = image.width;
      canvas.height = image.height;

      // Draw image to canvas
      ctx.drawImage(image, 0, 0);

      // Convert to the requested format (JPEG or PNG)
      const convertedImage = canvas.toDataURL(format); // 'image/jpeg' or 'image/png'

      // Convert base64 data URL to a Blob (file object)
      fetch(convertedImage)
        .then(res => res.blob())
        .then(blob => {
          const newImageFile = new File([blob], file.name, { type: format });
          resolve(newImageFile); // Resolve the promise with the new image file
        })
        .catch(err => reject(err));
    };

    image.onerror = (error) => reject(error);
    image.src = url;
  });
};
