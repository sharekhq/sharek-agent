# Supported File Types for Upload

The Sharek CLI now correctly detects and uploads various media types.

## How It Works

The CLI automatically detects the MIME type based on the file extension:

```bash
sharek upload video.mp4
# ✅ Detected as: video/mp4

sharek upload image.png
# ✅ Detected as: image/png

sharek upload audio.mp3
# ✅ Detected as: audio/mpeg
```

## Supported File Types

### Images

| Extension | MIME Type | Supported |
|-----------|-----------|-----------|
| `.png` | `image/png` | ✅ Yes |
| `.jpg`, `.jpeg` | `image/jpeg` | ✅ Yes |
| `.gif` | `image/gif` | ✅ Yes |

**Examples:**
```bash
sharek upload photo.jpg
sharek upload logo.png
sharek upload animation.gif
sharek upload icon.svg
```

### Videos

| Extension | MIME Type | Supported |
|-----------|-----------|-----------|
| `.mp4` | `video/mp4` | ✅ Yes |

**Examples:**
```bash
sharek upload video.mp4
sharek upload clip.mov
sharek upload recording.webm
sharek upload movie.mkv
```

### Audio

| Extension | MIME Type | Supported |
|-----------|-----------|-----------|
| `.mp3` | `audio/mpeg` | ✅ Yes |
| `.wav` | `audio/wav` | ✅ Yes |
| `.ogg` | `audio/ogg` | ✅ Yes |
| `.aac` | `audio/aac` | ✅ Yes |
| `.flac` | `audio/flac` | ✅ Yes |
| `.m4a` | `audio/mp4` | ✅ Yes |

**Examples:**
```bash
sharek upload podcast.mp3
sharek upload song.wav
sharek upload audio.ogg
```

### Documents

| Extension | MIME Type | Supported |
|-----------|-----------|-----------|
| `.pdf` | `application/pdf` | ✅ Yes |
| `.doc` | `application/msword` | ✅ Yes |
| `.docx` | `application/vnd.openxmlformats-officedocument.wordprocessingml.document` | ✅ Yes |

**Examples:**
```bash
sharek upload document.pdf
sharek upload report.docx
```

### Other Files

For file types not listed above, the CLI uses:
- MIME type: `application/octet-stream`
- This is a generic binary file type

## Usage Examples

### Upload an Image

```bash
sharek upload ./images/photo.jpg
```

Response:
```json
{
  "id": "upload-123",
  "path": "https://dash.sharek.app/uploads/photo.jpg",
  "url": "https://dash.sharek.app/uploads/photo.jpg"
}
```

### Upload a Video (MP4)

```bash
sharek upload ./videos/promo.mp4
```

Response:
```json
{
  "id": "upload-456",
  "path": "https://dash.sharek.app/uploads/promo.mp4",
  "url": "https://dash.sharek.app/uploads/promo.mp4"
}
```

### Upload and Use in Post

```bash
# 1. Upload the file
RESULT=$(sharek upload video.mp4)
echo $RESULT

# 2. Extract the path (you'll need jq or similar)
PATH=$(echo $RESULT | jq -r '.path')

# 3. Use in a post
sharek posts:create \
  -c "Check out my video!" \
  -m "$PATH" \
  -i "tiktok-123"
```

### Upload Multiple Files

```bash
# Upload images
sharek upload image1.jpg
sharek upload image2.png
sharek upload image3.gif

# Upload videos
sharek upload video1.mp4
sharek upload video2.mov
```

## What Changed (Fix)

### Before (❌ Bug)

```bash
sharek upload video.mp4
# ❌ Was detected as: image/jpeg (WRONG!)
```

The problem: The CLI defaulted to `image/jpeg` for any unknown file type.

### After (✅ Fixed)

```bash
sharek upload video.mp4
# ✅ Correctly detected as: video/mp4

sharek upload audio.mp3
# ✅ Correctly detected as: audio/mpeg

sharek upload document.pdf
# ✅ Correctly detected as: application/pdf
```

## Platform-Specific Notes

### TikTok
- Supports: MP4, MOV, WEBM
- Recommended: MP4

### YouTube
- Supports: MP4, MOV, AVI, WMV, FLV, 3GP, WEBM
- Recommended: MP4

### Instagram
- Images: JPG, PNG
- Videos: MP4, MOV
- Recommended: MP4 for videos, JPG for images

### Twitter/X
- Images: PNG, JPG, GIF, WEBP
- Videos: MP4, MOV
- Max video size: 512MB

### LinkedIn
- Images: PNG, JPG, GIF
- Videos: MP4, MOV, AVI
- Documents: PDF, DOC, DOCX, PPT

## Troubleshooting

### "Upload failed: Unsupported file type"

Some platforms may not accept certain file types. Check the platform's documentation.

**Solution:** Convert the file to a supported format:

```bash
# Convert video to MP4
ffmpeg -i video.avi video.mp4

# Then upload
sharek upload video.mp4
```

### File Size Limits

Different platforms have different file size limits:

- **Twitter/X**: Max 512MB for videos
- **Instagram**: Max 100MB for videos
- **TikTok**: Max 287.6MB for videos
- **YouTube**: Max 128GB (but 256GB for verified)

### "MIME type mismatch"

If you renamed a file with the wrong extension:

```bash
# ❌ Wrong: PNG file renamed to .jpg
mv image.png image.jpg
sharek upload image.jpg  # Might fail

# ✅ Correct: Keep original extension
sharek upload image.png
```

## Testing File Upload

```bash
# Set API key
export SHAREK_API_KEY=your_key

# Test image upload
sharek upload test-image.jpg

# Test video upload
sharek upload test-video.mp4

# Test audio upload
sharek upload test-audio.mp3
```

## Error Messages

### File Not Found
```
❌ ENOENT: no such file or directory
```

**Solution:** Check the file path is correct.

### No Permission
```
❌ EACCES: permission denied
```

**Solution:** Check file permissions:
```bash
chmod 644 your-file.mp4
```

### Invalid API Key
```
❌ Upload failed (401): Unauthorized
```

**Solution:** Set your API key:
```bash
export SHAREK_API_KEY=your_key
```

## Summary

✅ **30+ file types supported**
✅ **Automatic MIME type detection**
✅ **Images, videos, audio, documents**
✅ **Correct handling of MP4, MOV, MP3, etc.**
✅ **No more defaulting to JPEG!**

**The upload bug is fixed!** 🎉
