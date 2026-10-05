Add-Type -AssemblyName System.Drawing

function CompressImage($src, $dst, $width, $height, $quality) {
    $img = [System.Drawing.Image]::FromFile($src)
    $bmp = New-Object System.Drawing.Bitmap $width, $height
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.DrawImage($img, 0, 0, $width, $height)
    $img.Dispose()
    $g.Dispose()

    if ($dst.EndsWith(".jpg")) {
        $encoder = [System.Drawing.Imaging.Encoder]::Quality
        $encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
        $encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter($encoder, [long]$quality)
        $codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq "image/jpeg" }
        $bmp.Save($dst, $codec, $encoderParams)
    } else {
        $bmp.Save($dst, [System.Drawing.Imaging.ImageFormat]::Png)
    }
    $bmp.Dispose()
}

CompressImage "public/seal-70.png" "public/seal-70.png" 400 400 85
CompressImage "public/seal-70.png" "public/seal-70.jpg" 400 400 85
CompressImage "public/seal-70.png" "public/og-image.png" 600 600 85
CompressImage "public/seal-70.png" "public/og-image.jpg" 600 600 85

CompressImage "public/seal-70.png" "src/app/icon.png" 192 192 85
CompressImage "public/seal-70.png" "src/app/apple-icon.png" 180 180 85
CompressImage "public/seal-70.png" "src/app/opengraph-image.png" 600 600 85

Write-Host "Compression completed successfully!"
