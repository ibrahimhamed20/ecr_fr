export function downloadFile(blob: Blob, fileName: string): void {
  const reader = new FileReader();
  reader.onload = (event: any) => {
    const csvContent = event.target.result;
    console.log('CSV Data:', csvContent);

    const a = document.createElement('a');
    const objectUrl = URL.createObjectURL(blob);
    a.href = objectUrl;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(objectUrl);
  };
  reader.readAsText(blob);
}

// Helper method to build query parameters

// Main method that uses the helper method

export function buildQueryParams(params: { [key: string]: any }): string {
  return Object.entries(params)
    .filter(([_, value]) => value !== undefined && value !== null)
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
    )
    .join('&');
}
