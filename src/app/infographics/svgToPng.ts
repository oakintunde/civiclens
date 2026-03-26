export async function downloadSvgAsPng(
  svgMarkup: string,
  filename: string,
  pixelWidth = 720,
  pixelHeight = 920,
  scale = 2,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const blob = new Blob([svgMarkup], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = pixelWidth * scale;
        canvas.height = pixelHeight * scale;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          URL.revokeObjectURL(url);
          reject(new Error("Canvas not available"));
          return;
        }
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.scale(scale, scale);
        ctx.drawImage(img, 0, 0, pixelWidth, pixelHeight);
        canvas.toBlob((b) => {
          URL.revokeObjectURL(url);
          if (!b) {
            reject(new Error("PNG export failed"));
            return;
          }
          const a = document.createElement("a");
          a.href = URL.createObjectURL(b);
          a.download = filename;
          a.click();
          URL.revokeObjectURL(a.href);
          resolve();
        }, "image/png");
      } catch (e) {
        URL.revokeObjectURL(url);
        reject(e instanceof Error ? e : new Error(String(e)));
      }
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("SVG image load failed"));
    };
    img.src = url;
  });
}
