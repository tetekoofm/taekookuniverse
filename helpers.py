from urllib.parse import urlparse, parse_qs
from models import BackgroundMusic, Banner
from datetime import date, datetime, timedelta
from zoneinfo import ZoneInfo

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


def get_ordinal(number):
    if 10 <= number % 100 <= 20:
        suffix = "TH"
    else:
        suffix = {
            1: "ST",
            2: "ND",
            3: "RD"
        }.get(number % 10, "TH")

    return f"{number}{suffix}"


def get_celebration_display(celebration, now=None):
    """
    Returns celebration data when the celebration is either:
    - tomorrow (countdown)
    - today (celebration)

    All celebration timing is based on US Eastern Time.
    Returns None on all other days.
    """

    if not celebration:
        return None

    # ---------------------------------------------
    # EASTERN TIME
    # ---------------------------------------------

    eastern = ZoneInfo("America/New_York")

    if now is None:
        now = datetime.now(eastern)
    elif now.tzinfo is None:
        now = now.replace(tzinfo=eastern)
    else:
        now = now.astimezone(eastern)

    today = now.date()

    # ---------------------------------------------
    # THIS YEAR'S CELEBRATION DATE
    # ---------------------------------------------

    celebration_date = date(
        today.year,
        celebration.date.month,
        celebration.date.day
    )

    # If this year's celebration has already passed,
    # use next year's occurrence.
    if celebration_date < today:
        celebration_date = date(
            today.year + 1,
            celebration.date.month,
            celebration.date.day
        )

    day_before = celebration_date - timedelta(days=1)

    # ---------------------------------------------
    # CALCULATE YEARS
    # ---------------------------------------------

    celebration_year = celebration_date.year
    years = celebration_year - celebration.date.year
    ordinal = get_ordinal(years)

    celebration_type = celebration.type.lower()

    # Default values
    title = celebration.title
    title_first = None
    title_second = None

    # ---------------------------------------------
    # BIRTHDAY
    # ---------------------------------------------

    if celebration_type == "birthday":

        title = celebration.title.replace(
            "Happy Birthday,",
            f"Happy {ordinal} Birthday,"
        ).upper()

        # Split into two intentional lines:
        # HAPPY 29TH BIRTHDAY,
        # JUNG KOOK!
        title_first, title_second = title.rsplit(",", 1)

        title_first = title_first + ","
        title_second = title_second.strip()

        if not title_second.endswith("!"):
            title_second += "!"

    # ---------------------------------------------
    # ANNIVERSARY
    # ---------------------------------------------

    elif celebration_type == "anniversary":

        title = f"✦ HAPPY {ordinal} ANNIVERSARY, TETEKOOFM! ✦"

    # ---------------------------------------------
    # DAY BEFORE — COUNTDOWN TO MIDNIGHT
    # EASTERN TIME
    # ---------------------------------------------

    if today == day_before:

        countdown_end = datetime.combine(
            celebration_date,
            datetime.min.time(),
            tzinfo=eastern
        )

        return {
            "status": "countdown",
            "title": title,
            "title_first": title_first,
            "title_second": title_second,
            "message": celebration.message,
            "image_key": celebration.image,
            "confetti": celebration.confetti,
            "type": celebration.type,
            "target": countdown_end.isoformat()
        }

    # ---------------------------------------------
    # CELEBRATION DAY
    # UNTIL MIDNIGHT EASTERN TIME
    # ---------------------------------------------

    if today == celebration_date:

        celebration_end = datetime.combine(
            celebration_date + timedelta(days=1),
            datetime.min.time(),
            tzinfo=eastern
        )

        return {
            "status": "celebration",
            "title": title,
            "title_first": title_first,
            "title_second": title_second,
            "message": celebration.message,
            "image_key": celebration.image,
            "confetti": celebration.confetti,
            "type": celebration.type,
            "target": celebration_end.isoformat()
        }

    # ---------------------------------------------
    # NOT A CELEBRATION / COUNTDOWN DAY
    # ---------------------------------------------

    return None