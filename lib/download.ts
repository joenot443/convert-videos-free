/** Saves a blob through the browser's normal download flow. */
export function saveBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  // Safari and Firefox start the download asynchronously, so an immediate
  // revoke can cancel it.
  setTimeout(() => URL.revokeObjectURL(url), 60_000);
}
