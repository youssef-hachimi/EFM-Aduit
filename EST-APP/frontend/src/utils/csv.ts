/**
 * Download a CSV by fetching it with Authorization header,
 * then creating a blob URL.
 */
export async function downloadCsvWithAuth(opts: {
  url: string;
  token: string;
  filename: string;
}) {
  const res = await fetch(opts.url, {
    headers: { Authorization: `Bearer ${opts.token}` }
  });

  if (!res.ok) throw new Error("Failed to export CSV");

  const blob = await res.blob();
  const a = document.createElement("a");
  const href = URL.createObjectURL(blob);
  a.href = href;
  a.download = opts.filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(href);
}