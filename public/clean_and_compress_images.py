import os
import re
from pathlib import Path
from PIL import Image

# Configuration
image_extensions = {".jpg", ".jpeg", ".png", ".gif", ".webp"}
code_extensions = {".html", ".css", ".js"}
max_image_size_mb = 1  # Target max file size in MB for compression

def find_referenced_images(base_path):
    referenced = set()
    pattern = re.compile(r'["\'\(](.*?\.(?:jpg|jpeg|png|gif|webp))["\'\)]', re.IGNORECASE)

    for ext in code_extensions:
        for file in Path(base_path).rglob(f"*{ext}"):
            content = file.read_text(errors='ignore')
            matches = pattern.findall(content)
            for match in matches:
                referenced.add(os.path.basename(match))
    return referenced

def compress_jpg(path, target_size_mb=1):
    original_size = os.path.getsize(path) / (1024 * 1024)
    if original_size <= target_size_mb:
        return

    try:
        img = Image.open(path)
        img = img.convert('RGB')  # Ensure compatibility
        quality = 85
        while original_size > target_size_mb and quality > 10:
            img.save(path, "JPEG", optimize=True, quality=quality)
            original_size = os.path.getsize(path) / (1024 * 1024)
            quality -= 5
        print(f"Compressed: {path} to ~{original_size:.2f}MB")
    except Exception as e:
        print(f"Error compressing {path}: {e}")

def clean_and_optimize(base_dir):
    base_dir = Path(base_dir)
    referenced = find_referenced_images(base_dir)
    print(f"Referenced images found: {len(referenced)}")

    deleted = 0
    compressed = 0

    for image in base_dir.rglob("*"):
        if image.suffix.lower() in image_extensions:
            if image.name not in referenced:
                print(f"Deleting unused image: {image}")
                image.unlink()
                deleted += 1
            elif image.suffix.lower() in {".jpg", ".jpeg"}:
                compress_jpg(image, max_image_size_mb)
                compressed += 1

    print(f"\nSummary:\nDeleted: {deleted} unused images\nCompressed: {compressed} JPEGs")

# Run this by replacing '.' with your project path
if __name__ == "__main__":
    clean_and_optimize(".")
