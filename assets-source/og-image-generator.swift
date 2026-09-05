import AppKit

// Minimal OG card: solid ground, one hairline rule, nothing decorative.
// Same palette as the site's dark mode so a shared link matches the page
// it opens into.

let W: CGFloat = 1200
let H: CGFloat = 630

let img = NSImage(size: NSSize(width: W, height: H))
img.lockFocus()

let ink = NSColor(red: 23/255, green: 22/255, blue: 19/255, alpha: 1)     // bg
let bone = NSColor(red: 237/255, green: 234/255, blue: 226/255, alpha: 1) // primary text
let muted = NSColor(red: 174/255, green: 168/255, blue: 157/255, alpha: 1)
let faint = NSColor(red: 144/255, green: 138/255, blue: 128/255, alpha: 1)
let line = NSColor(red: 237/255, green: 234/255, blue: 226/255, alpha: 0.12)

ink.setFill()
NSRect(x: 0, y: 0, width: W, height: H).fill()

let marginX: CGFloat = 100

// "wk" mark, top-left.
let markFont = NSFont(name: "HelveticaNeue-Bold", size: 26) ?? NSFont.boldSystemFont(ofSize: 26)
NSAttributedString(
    string: "wk",
    attributes: [.font: markFont, .foregroundColor: faint, .kern: -0.6]
).draw(at: CGPoint(x: marginX, y: H - 92))

// Availability, top-right — a quiet dot + label, mirroring the site's chip.
let availFont = NSFont(name: "HelveticaNeue-Medium", size: 20) ?? NSFont.systemFont(ofSize: 20, weight: .medium)
let availStr = "AVAILABLE FOR WORK"
let availAttrs: [NSAttributedString.Key: Any] = [.font: availFont, .foregroundColor: faint, .kern: 1.6]
let availSize = NSAttributedString(string: availStr, attributes: availAttrs).size()
let availY = H - 84
NSAttributedString(string: availStr, attributes: availAttrs)
    .draw(at: CGPoint(x: W - marginX - availSize.width, y: availY))
let dotR: CGFloat = 4
let dotPath = NSBezierPath(ovalIn: NSRect(
    x: W - marginX - availSize.width - 16 - dotR * 2, y: availY + 6, width: dotR * 2, height: dotR * 2
))
NSColor(red: 122/255, green: 178/255, blue: 214/255, alpha: 1).setFill() // sky accent
dotPath.fill()

// Eyebrow — small, tracked, sits just above the name.
let eyebrowFont = NSFont(name: "HelveticaNeue-Medium", size: 22) ?? NSFont.systemFont(ofSize: 22, weight: .medium)
let eyebrowAttrs: [NSAttributedString.Key: Any] = [.font: eyebrowFont, .foregroundColor: faint, .kern: 2.2]
let nameY: CGFloat = H / 2 - 6
NSAttributedString(string: "NAIROBI, KENYA", attributes: eyebrowAttrs)
    .draw(at: CGPoint(x: marginX, y: nameY + 118))

// Name — large, bold, tight tracking.
let nameFont = NSFont(name: "HelveticaNeue-Bold", size: 100) ?? NSFont.boldSystemFont(ofSize: 100)
let nameAttrs: [NSAttributedString.Key: Any] = [.font: nameFont, .foregroundColor: bone, .kern: -3.5]
NSAttributedString(string: "Wayne Kiprotich", attributes: nameAttrs)
    .draw(at: CGPoint(x: marginX, y: nameY))

// Role line.
let roleFont = NSFont(name: "HelveticaNeue-Medium", size: 32) ?? NSFont.systemFont(ofSize: 32, weight: .medium)
let roleAttrs: [NSAttributedString.Key: Any] = [.font: roleFont, .foregroundColor: muted, .kern: -0.3]
NSAttributedString(string: "Full-Stack Software Engineer", attributes: roleAttrs)
    .draw(at: CGPoint(x: marginX, y: nameY - 60))

// One hairline rule, then the URL below it — the only structure in the
// lower third, kept deliberately quiet.
let ruleY: CGFloat = 118
let rule = NSBezierPath()
rule.move(to: CGPoint(x: marginX, y: ruleY))
rule.line(to: CGPoint(x: W - marginX, y: ruleY))
rule.lineWidth = 1
line.setStroke()
rule.stroke()

let urlFont = NSFont(name: "HelveticaNeue-Medium", size: 22) ?? NSFont.systemFont(ofSize: 22, weight: .medium)
let urlAttrs: [NSAttributedString.Key: Any] = [.font: urlFont, .foregroundColor: faint, .kern: 1.2]
NSAttributedString(string: "WAYNEKIPROTICH.ONLINE", attributes: urlAttrs)
    .draw(at: CGPoint(x: marginX, y: ruleY - 46))

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
