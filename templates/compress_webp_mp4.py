import os
from PIL import Image
from tqdm import tqdm
import subprocess

# Adjust these compression settings
WEBP_QUALITY = 80  # 0-100, lower = more compression
MP4_CRF = 35       # Constant Rate Factor, 0=lossless, 51=max compression

def compress_webp(file_path):
    try:
        img = Image.open(file_path)
        img.save(file_path, "WEBP", quality=WEBP_QUALITY)
    except Exception as e:
        print(f"Failed to compress {file_path}: {e}")

def compress_mp4(file_path):
    temp_file = file_path + ".tmp.mp4"
    cmd = [
        "ffmpeg",
        "-i", file_path,
        "-vcodec", "libx264",
        "-crf", str(MP4_CRF),
        "-preset", "slow",
        "-acodec", "aac",
        "-b:a", "128k",
        "-y",
        temp_file
    ]
    try:
        subprocess.run(cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        os.replace(temp_file, file_path)
    except Exception as e:
        print(f"Failed to compress {file_path}: {e}")
        if os.path.exists(temp_file):
            os.remove(temp_file)

def compress_folder(folder_path):
    for root, dirs, files in os.walk(folder_path):
        for f in tqdm(files, desc=root):
            full_path = os.path.join(root, f)
            if f.lower().endswith((".webp", ".png", ".jpg", ".jpeg", ".gif")):
                compress_webp(full_path)
            elif f.lower().endswith(".mp4"):
                compress_mp4(full_path)

if __name__ == "__main__":
    folder_to_compress = "/Users/haripriyakrishnan/Downloads/Python/taekookuniverse/static/images/letters"  # <-- change this
    compress_folder(folder_to_compress)
    print("Compression completed!")
