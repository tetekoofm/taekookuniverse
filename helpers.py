from urllib.parse import urlparse, parse_qs
from models import BackgroundMusic, Banner


def extract_youtube_id(url):
    if not url:
        return None

    if "youtu.be" in url:
        return url.split("/")[-1].split("?")[0]

    if "youtube.com" in url:
        if "v=" in url:
            return url.split("v=")[1].split("&")[0]

        if "/embed/" in url:
            return url.split("/embed/")[1].split("?")[0]

        if "/shorts/" in url:
            return url.split("/shorts/")[1].split("?")[0]

        query = parse_qs(urlparse(url).query)
        return query.get("v", [None])[0]

    return None


def get_page_music(page_name):
    music = BackgroundMusic.query.filter_by(
        page_name=page_name
    ).first()

    return (
        music.file_name if music else "default.mp3",
        music.song_name if music else "Default Song"
    )


def get_banners(subpage):
    return Banner.query.filter_by(
        subpage=subpage
    ).all()