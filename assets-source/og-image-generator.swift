import AppKit

let W: CGFloat = 1200
let H: CGFloat = 630

let img = NSImage(size: NSSize(width: W, height: H))
img.lockFocus()

let ink = NSColor(red: 23/255, green: 22/255, blue: 19/255, alpha: 1)   // dark-mode bone (bg)
let bone = NSColor(red: 237/255, green: 234/255, blue: 226/255, alpha: 1) // dark-mode ink (text)
let muted = NSColor(red: 174/255, green: 168/255, blue: 157/255, alpha: 1)
let faint = NSColor(red: 100/255, green: 96/255, blue: 88/255, alpha: 1)

ink.setFill()
NSRect(x: 0, y: 0, width: W, height: H).fill()

// Faint grid, echoing the site's editorial atmosphere without a raster texture.
let grid = NSColor(white: 1, alpha: 0.035)
grid.setStroke()
let step: CGFloat = 60
var x: CGFloat = 0
while x <= W { let p = NSBezierPath(); p.move(to: NSPoint(x: x, y: 0)); p.line(to: NSPoint(x: x, y: H)); p.lineWidth = 1; p.stroke(); x += step }
var y: CGFloat = 0
while y <= H { let p = NSBezierPath(); p.move(to: NSPoint(x: 0, y: y)); p.line(to: NSPoint(x: W, y: y)); p.lineWidth = 1; p.stroke(); y += step }

let marginX: CGFloat = 96

// Small "wk" mark, top-left — matches the nav-dock brand mark.
let markFont = NSFont(name: "HelveticaNeue-Bold", size: 28) ?? NSFont.boldSystemFont(ofSize: 28)
let markAttrs: [NSAttributedString.Key: Any] = [.font: markFont, .foregroundColor: faint, .kern: -0.8]
NSAttributedString(string: "wk", attributes: markAttrs).draw(at: CGPoint(x: marginX, y: H - 96))

// Name — large, bold, tight tracking, left-aligned (matches the hero).
let nameFont = NSFont(name: "HelveticaNeue-Bold", size: 96) ?? NSFont.boldSystemFont(ofSize: 96)
let nameAttrs: [NSAttributedString.Key: Any] = [.font: nameFont, .foregroundColor: bone, .kern: -3.5]
let nameStr = NSAttributedString(string: "Wayne Kiprotich", attributes: nameAttrs)
let nameY = H / 2 - 10
nameStr.draw(at: CGPoint(x: marginX, y: nameY))

// Role line.
let roleFont = NSFont(name: "HelveticaNeue-Medium", size: 34) ?? NSFont.systemFont(ofSize: 34, weight: .medium)
let roleAttrs: [NSAttributedString.Key: Any] = [.font: roleFont, .foregroundColor: muted, .kern: -0.4]
NSAttributedString(string: "Full-Stack Software Engineer", attributes: roleAttrs)
    .draw(at: CGPoint(x: marginX, y: nameY - 62))

// URL, bottom-left, de-emphasized.
let urlFont = NSFont(name: "HelveticaNeue-Medium", size: 22) ?? NSFont.systemFont(ofSize: 22, weight: .medium)
let urlAttrs: [NSAttributedString.Key: Any] = [.font: urlFont, .foregroundColor: faint, .kern: 1.2]
NSAttributedString(string: "WAYNEKIPROTICH.ONLINE", attributes: urlAttrs)
    .draw(at: CGPoint(x: marginX, y: 72))

img.unlockFocus()

let rep = NSBitmapImageRep(
    bitmapDataPlanes: nil, pixelsWide: Int(W), pixelsHigh: Int(H),
    bitsPerSample: 8, samplesPerPixel: 4, hasAlpha: true, isPlanar: false,
    colorSpaceName: .deviceRGB, bytesPerRow: 0, bitsPerPixel: 0
)!
rep.size = NSSize(width: W, height: H)
NSGraphicsContext.saveGraphicsState()
NSGraphicsContext.current = NSGraphicsContext(bitmapImageRep: rep)
img.draw(in: NSRect(x: 0, y: 0, width: W, height: H))
NSGraphicsContext.restoreGraphicsState()
let data = rep.representation(using: .png, properties: [:])!
try? data.write(to: URL(fileURLWithPath: CommandLine.arguments[1]))
print("done")
