import path from 'path';

export const getFilenameByUrl = (url: string) => {
  if (url.startsWith('data:')) {
    return undefined;
  }
  return (
    path.basename(url) ||
    (url.split('/').pop() || '').split('#')[0].split('?')[0] ||
    undefined
  );
};

export const downloadFileByUrl = (url: string, filename: string = '') => {
  const anchor = document.createElement('a');

  anchor.download = filename || getFilenameByUrl(url) || 'unknown';
  anchor.href = url;
  anchor.target = '_blank';
  document.body.appendChild(anchor);
  anchor.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(anchor);
};

export const downloadFile = (file: File): void => {
  const url = window.URL.createObjectURL(file);

  downloadFileByUrl(url, file.name || url);
};
