from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from extensions import db

class TKURadio(db.Model):
    __tablename__ = 'tkuradio'
    id = db.Column(db.Integer, primary_key=True)
    song_id = db.Column(db.Integer, unique=True, nullable=False)
    song_title = db.Column(db.String(300), nullable=False)
    youtube_url = db.Column(db.String(500))
    youtube_id = db.Column(db.String(100), nullable=False)
    artist = db.Column(db.String(100))
    album = db.Column(db.String(200))
    playlist_group = db.Column(db.String(100))
    track_type = db.Column(db.String(100))
    cover_image = db.Column(db.String(300))
    description = db.Column(db.Text)
    published = db.Column(db.Boolean, default=True)
    notes = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class BackgroundMusic(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    page_name = db.Column(db.String(255), unique=True, nullable=False)
    song_name = db.Column(db.String(255), nullable=True)
    file_name = db.Column(db.String(255), nullable=True)

    def __repr__(self):
        return f"<BackgroundMusic {self.page_name} - {self.song_name}>"

class Upcoming(db.Model):
    __tablename__ = 'upcoming'
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.String(20), nullable=False)
    artist = db.Column(db.String(100), nullable=False)
    title = db.Column(db.String(200), nullable=False)
    folder = db.Column(db.String(100), nullable=True) 
    image = db.Column(db.String(300), nullable=True)
    description = db.Column(db.Text, nullable=True)

class Highlights(db.Model):
    __tablename__ = 'highlights'
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.String(20), nullable=False)
    artist = db.Column(db.String(100), nullable=False)
    title = db.Column(db.String(200), nullable=False)
    folder = db.Column(db.String(100), nullable=True) 
    image = db.Column(db.String(300), nullable=True)
    description = db.Column(db.Text, nullable=True)

class Recap(db.Model):
    __tablename__ = 'recap'

    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.String(20), nullable=False)
    title = db.Column(db.String(200), nullable=False)
    caption = db.Column(db.Text, nullable=True)
    video = db.Column(db.String(300), nullable=False) 

class Memory(db.Model):
    __tablename__ = 'memory'

    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.String(50), nullable=False)
    artist = db.Column(db.String(100), nullable=False)
    title = db.Column(db.String(200), nullable=False)
    image = db.Column(db.String(500), nullable=True)
    description = db.Column(db.Text, nullable=False)

    def __repr__(self):
        return f'<Memory {self.title}>'
  
class InTheNews(db.Model):
    __tablename__ = 'inthenews'

    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.String(50), nullable=False)
    artist = db.Column(db.String(100), nullable=False)
    title = db.Column(db.String(200), nullable=False)
    image = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=True)
    link = db.Column(db.String(255), nullable=True) 

    def __repr__(self):
        return f'<InTheNews {self.title}>'

class Discography(db.Model):
    __tablename__ = 'discography'

    id = db.Column(db.Integer, primary_key=True)
    artist = db.Column(db.String(100), nullable=False)
    image = db.Column(db.String(255), nullable=False) 
    album_name = db.Column(db.String(200), nullable=False)
    song_name = db.Column(db.String(200), nullable=False)
    release_date = db.Column(db.Date, nullable=False)
    duration = db.Column(db.String(10), nullable=False)
    popular = db.Column(db.Boolean, default=False)
    spotify_url = db.Column(db.String(255), nullable=True)
    apple_music_url = db.Column(db.String(255), nullable=True)
    youtube_url = db.Column(db.String(255), nullable=True)
    shazam_url = db.Column(db.String(255), nullable=True)
    pandora_url = db.Column(db.String(255), nullable=True)
    tidal_url = db.Column(db.String(255), nullable=True)

    def __repr__(self):
        return f'<Discography {self.song_name}>'

class MusicVideo(db.Model):
    __tablename__ = 'musicvideo'

    id = db.Column(db.Integer, primary_key=True)
    artist = db.Column(db.String(100), nullable=False)
    video_name = db.Column(db.String(255), nullable=False)
    youtube_url = db.Column(db.String(255), nullable=False)

    def __repr__(self):
        return f'<MusicVideo {self.name}>'

class Vote(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    app_logo = db.Column(db.String(255), nullable=False)
    app_name = db.Column(db.String(100), nullable=False, unique=True)
    android_link = db.Column(db.String(255), nullable=True)
    ios_link = db.Column(db.String(255), nullable=True)
    web_link = db.Column(db.String(255), nullable=True)

    def __repr__(self):
        return f"<Vote {self.app_name}>"
    
class Radio(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    station_logo = db.Column(db.String(255), nullable=True) 
    station_name = db.Column(db.String(100), nullable=False)
    location = db.Column(db.String(100), nullable=False) 
    station_link = db.Column(db.String(255), nullable=False) 
    request_link = db.Column(db.String(255), nullable=True) 
    description = db.Column(db.Text, nullable=True)

    def __repr__(self):
        return f'<Radio {self.station_name}>'
      
class Fanbase(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    logo = db.Column(db.String(255), nullable=True)
    fb_name = db.Column(db.String(255), nullable=False)
    location = db.Column(db.String(255), nullable=True)
    focus = db.Column(db.String(255), nullable=True)
    description = db.Column(db.Text, nullable=True)
    x = db.Column(db.String(255), nullable=True)
    instagram = db.Column(db.String(255), nullable=True)
    tiktok = db.Column(db.String(255), nullable=True)
    facebook = db.Column(db.String(255), nullable=True)
    bluesky = db.Column(db.String(255), nullable=True)
    threads = db.Column(db.String(255), nullable=True)
    spotify = db.Column(db.String(255), nullable=True)
    applemusic = db.Column(db.String(255), nullable=True)

    def __repr__(self):
        return f"<Fanbase {self.fb_name}>"

class Project(db.Model):
    __tablename__ = 'projects'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    date = db.Column(db.String(50), nullable=False)
    location = db.Column(db.String(100), nullable=False)
    image = db.Column(db.String(255), nullable=True)
    description = db.Column(db.Text, nullable=True)
    link = db.Column(db.String(255), nullable=True)  # Optional

    def __repr__(self):
        return f"<Project {self.title}>"

class Event(db.Model):
    __tablename__ = 'event'

    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.String(50), nullable=False)
    title = db.Column(db.String(100), nullable=False)
    image = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=False)
    trending_tags = db.Column(db.String(100), nullable=True)
    trending_position = db.Column(db.String(100), nullable=True)

    def __repr__(self):
        return f'<Event {self.title}>'

class Promotion(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    artist = db.Column(db.String(100), nullable=False) 
    brand_name = db.Column(db.String(100), nullable=False)
    campaign_title = db.Column(db.String(200), nullable=True)
    image_url = db.Column(db.String(500), nullable=False)
    video_url = db.Column(db.String(500), nullable=True)
    description = db.Column(db.Text, nullable=True)
    year = db.Column(db.Integer, nullable=False)

    def __repr__(self):
        return f'<Event {self.campaign_title}>'

class BrandAmbassador(db.Model):
    __tablename__ = "brand_ambassador"
    id = db.Column(db.Integer, primary_key=True) 
    artist = db.Column(db.String(100), nullable=False)
    brand_name = db.Column(db.String(100), nullable=False)
    folder = db.Column(db.String(100), nullable=True)
    image = db.Column(db.String(500), nullable=True)
    link = db.Column(db.String(500), nullable=True)
    year = db.Column(db.Integer, nullable=True)

class Banner(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    subpage = db.Column(db.String(50), nullable=False)
    title = db.Column(db.String(255), nullable=False)
    link = db.Column(db.String(255), nullable=True)
    date_added = db.Column(db.Date, nullable=True)

    def __repr__(self):
        return f'<Banner {self.title}>'
       
class FanLetter(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    fanname = db.Column(db.String(255), nullable=True)  # Optional if image is provided
    image = db.Column(db.String(255), nullable=True)  # Image filename (stored in static/letters/)
    description = db.Column(db.Text, nullable=True)  # Optional if image is provided

    def __init__(self, fanname=None, image=None, description=None):
        if not fanname and not image:
            raise ValueError("Either an image or a title with description must be provided.")
        self.fanname = fanname
        self.image = image
        self.description = description

class Lyrics(db.Model):
    __tablename__ = "lyrics"

    id = db.Column(db.Integer, primary_key=True)
    artist = db.Column(db.String(100))
    cover = db.Column(db.String(200))
    song = db.Column(db.String(200))
    album = db.Column(db.String(200))
    lyrics = db.Column(db.Text)
    romanization = db.Column(db.Text)
    translation = db.Column(db.Text)
    vocabulary = db.Column(db.Text)


class Recipe(db.Model):
    __tablename__ = "recipe"
    id = db.Column(db.Integer, primary_key=True)
    recipe_name = db.Column(db.String(200), nullable=False)
    category = db.Column(db.String(100), nullable=False)
    difficulty = db.Column(db.String(50))
    cook_time = db.Column(db.String(50))
    date = db.Column(db.Date)
    image = db.Column(db.String(200))
    video = db.Column(db.String(200))
    description = db.Column(db.Text)
    ingredients = db.Column(db.Text)
    steps = db.Column(db.Text)
    jk_corner = db.Column(db.Text)
    memory = db.Column(db.Text)
    notes = db.Column(db.Text)
    cultural_notes = db.Column(db.Text)
    published = db.Column(db.Boolean, default=False)