/** Copy text via the Clipboard API when available; otherwise open a dialog so the user can copy manually. */
export async function copyTextToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    window.prompt('Copy this link:', text)
    return false
  }
}
