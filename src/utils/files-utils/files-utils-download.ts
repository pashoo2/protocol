export const downloadFile = (file: File): void => {
  const url = window.URL.createObjectURL(file);
  const anchor = document.createElement('a');

  anchor.download = file.name || url;
  anchor.href = url;
  anchor.click();
  window.URL.revokeObjectURL(url);
};
