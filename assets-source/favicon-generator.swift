import AppKit

// Editorial "wk" monogram: bold lowercase wordmark on a rounded ink square,
// matching the site's bold-sans, no-decoration identity. Rendered once per
// exact target size (not downscaled from one master) so small sizes stay
// crisp, and once per theme so the browser-tab icon can follow the OS/browser
// dark-mode setting the same way the site itself does.

func makeIcon(size: CGFloat, cornerRadius: CGFloat, dark: Bool) -> NSImage {
    let img = NSImage(size: NSSize(width: size, height: size))
    img.lockFocus()

    let bg = dark
        ? NSColor(red: 237/255, green: 234/255, blue: 226/255, alpha: 1) // dark-mode "ink" token
        : NSColor(red: 26/255, green: 25/255, blue: 23/255, alpha: 1)    // light-mode ink
    let fg = dark
        ? NSColor(red: 23/255, green: 22/255, blue: 19/255, alpha: 1)    // dark-mode bone
        : NSColor(red: 239/255, green: 236/255, blue: 229/255, alpha: 1) // light-mode bone

    let rect = CGRect(x: 0, y: 0, width: size, height: size)
    if cornerRadius > 0 {
        NSBezierPath(roundedRect: rect, xRadius: cornerRadius, yRadius: cornerRadius).setClip()
    }
    bg.setFill()
    rect.fill()

    let fontSize = size * 0.56
    let font = NSFont(name: "HelveticaNeue-Bold", size: fontSize) ?? NSFont.boldSystemFont(ofSize: fontSize)
    let paragraph = NSMutableParagraphStyle()
    paragraph.alignment = .center
    let attrs: [NSAttributedString.Key: Any] = [
        .font: font,
        .foregroundColor: fg,
        .kern: -fontSize * 0.03,
        .paragraphStyle: paragraph,
    ]
    let attr = NSAttributedString(string: "wk", attributes: attrs)
    let lineSize = attr.size()
    let x = (size - lineSize.width) / 2
    let y = (size - lineSize.height) / 2 + size * 0.03 // optical centering
    attr.draw(at: CGPoint(x: x, y: y))

    img.unlockFocus()
    return img
}

func writePNG(_ image: NSImage, to path: String, size: Int) {
    let rep = NSBitmapImageRep(
        bitmapDataPlanes: nil, pixelsWide: size, pixelsHigh: size,
        bitsPerSample: 8, samplesPerPixel: 4, hasAlpha: true, isPlanar: false,
        colorSpaceName: .deviceRGB, bytesPerRow: 0, bitsPerPixel: 0
    )!
    rep.size = NSSize(width: size, height: size)
    NSGraphicsContext.saveGraphicsState()
    NSGraphicsContext.current = NSGraphicsContext(bitmapImageRep: rep)
    image.draw(in: NSRect(x: 0, y: 0, width: size, height: size))
    NSGraphicsContext.restoreGraphicsState()
    let data = rep.representation(using: .png, properties: [:])!
    try? data.write(to: URL(fileURLWithPath: path))
}

let outDir = CommandLine.arguments[1]

// Light set — the default, used as the no-media-query fallback everywhere.
for s in [16, 32, 48, 192, 512] {
    writePNG(makeIcon(size: CGFloat(s), cornerRadius: CGFloat(s) * 0.22, dark: false), to: "\(outDir)/favicon-\(s).png", size: s)
}
// Dark set — served only via `media="(prefers-color-scheme: dark)"` link tags.
for s in [16, 32, 48] {
    writePNG(makeIcon(size: CGFloat(s), cornerRadius: CGFloat(s) * 0.22, dark: true), to: "\(outDir)/favicon-\(s)-dark.png", size: s)
}
// Apple touch icon: square, no radius (iOS applies its own mask), fixed light.
writePNG(makeIcon(size: 180, cornerRadius: 0, dark: false), to: "\(outDir)/apple-touch-icon.png", size: 180)

print("done")
