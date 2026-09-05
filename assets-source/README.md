Full-resolution originals, kept out of `public/` so they are not deployed.

`pfp-original.png` (2268x4032, 7 MB) is the source for the portrait. The
derivatives actually served live at `public/profile/pfp-{480,720,1080}.jpg`
and are referenced through a `srcset`. Regenerate them with:

    for w in 480 720 1080; do
      cp assets-source/pfp-original.png "t$w.png"
      sips --resampleWidth $w "t$w.png" >/dev/null
      sips -s format jpeg -s formatOptions 80 "t$w.png" --out "public/profile/pfp-$w.jpg" >/dev/null
      rm -f "t$w.png"
    done

## Favicon and OG image

`favicon-generator.swift` and `og-image-generator.swift` draw both directly
with AppKit/Core Graphics — a bold "wk" wordmark set in Helvetica Neue Bold,
rather than a hand-drawn glyph, so it stays legible at 16px. Both scripts hard-
code the same palette as `src/styles/index.css`; if that palette changes,
update the RGB triples here too and regenerate:

    swift assets-source/favicon-generator.swift public/
    # then move the outputs it writes into public/ under their final names
    # (favicon-{16,32,48,192,512}.png, favicon-{16,32,48}-dark.png,
    # apple-touch-icon.png), and rebuild favicon.ico:

    python3 -c "
    import struct
    png = open('public/favicon-32.png','rb').read()
    with open('public/favicon.ico','wb') as f:
        f.write(struct.pack('<HHH', 0, 1, 1))
        f.write(struct.pack('<BBBBHHII', 32, 32, 0, 0, 1, 32, len(png), 22))
        f.write(png)
    "

    swift assets-source/og-image-generator.swift public/og-image.png
