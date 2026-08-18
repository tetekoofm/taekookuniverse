from flask import Blueprint, render_template, jsonify, url_for, request
from collections import defaultdict
from datetime import datetime
import random

from models import db, Memory, Discography, Lyrics, MusicVideo, BackgroundMusic, TKURadio
from helpers import extract_youtube_id, get_page_music

media_bp = Blueprint("media", __name__)


@media_bp.route('/memories')
def memories():
    memories_data = Memory.query.all()
    song_file, song_name = get_page_music("memories")
    timeline_data = defaultdict(lambda: defaultdict(list))
    for memory in memories_data:
        year, month, day = map(int, memory.date.split('-'))
        timeline_data[year][month].append({'id': memory.id, 'title': memory.title, 'date': f'{year}-{month:02}-{day:02}', 'description': memory.description})
    for year in range(2013, 2025):
        timeline_data.setdefault(year, {})
        for month in range(1, 13):
            timeline_data[year].setdefault(month, [])
        timeline_data[year] = {month: timeline_data[year][month] for month in sorted(timeline_data[year])}
    formatted_years = {year: str(year)[-2:] for year in timeline_data.keys()}
    return render_template("memories_soon.html", song_file=song_file, song_name=song_name)
    

@media_bp.route('/memories_galaxy')
def memories_galaxy():
    memories_data = Memory.query.all()
    song_file, song_name = get_page_music("memories")
    events = []
    for memory in memories_data:
        year, month, day = map(int, memory.date.split('-'))
        events.append({"year": year, "month": memory.date.split('-')[1], "title": memory.title, "image": memory.image, "description": memory.description, "artist": memory.artist, "date": memory.date})
    return render_template("memories.html", events=events, song_file=song_file, song_name=song_name)


@media_bp.route('/get-event-details/<int:event_id>')
def get_event_details(event_id):
    event = Memory.query.get(event_id)
    if event:
        return jsonify({'title': event.title, 'image': url_for('static', filename=f'images/{event.image}'), 'description': event.description, 'date': event.date})
    return jsonify({'error': 'Event not found'}), 404


@media_bp.route('/discography')
def discography():
    song_names = [song.song_name for song in Discography.query.all() if song.song_name]
    taehyung_videos = MusicVideo.query.filter_by(artist='Taehyung').all()
    jungkook_videos = MusicVideo.query.filter_by(artist='Jungkook').all()
    for video in taehyung_videos:
        video.youtube_id = extract_youtube_id(video.youtube_url)
    for video in jungkook_videos:
        video.youtube_id = extract_youtube_id(video.youtube_url)

    random.shuffle(taehyung_videos)
    random.shuffle(jungkook_videos)

    song_file, song_name = get_page_music("discography")
    return render_template("discography.html", song_names=song_names, taehyung_videos=taehyung_videos, jungkook_videos=jungkook_videos, song_file=song_file, song_name=song_name)

@media_bp.route("/learnthelyrics")
@media_bp.route("/learnthelyrics/<song_name>")
def learn_the_lyrics(song_name=None):
    if song_name:
        song = Lyrics.query.filter_by(song=song_name).first_or_404()
        vocabulary = []
        current_section = "Vocabulary"
        if song.vocabulary:
            current_section = "Vocabulary"
            for line in song.vocabulary.splitlines():
                line = line.strip()
                if not line:
                    continue
                if line.startswith("#"):
                    current_section = line.replace("#", "").strip()
                    continue
                if "|" in line:
                    parts = line.split("|")
                    if len(parts) == 3:
                        vocabulary.append({
                            "section": current_section,
                            "korean": parts[0].strip(),
                            "romanization": parts[1].strip(),
                            "meaning": parts[2].strip()
                        })
        song.vocabulary = vocabulary
        return render_template("learnthelyrics.html",song=song,endpoint="media.learn_the_lyrics")

    artist = request.args.get("artist")
    if artist:lyrics = Lyrics.query.filter_by(artist=artist).all()
    else:lyrics = Lyrics.query.all()
    return render_template("learnthelyrics.html",lyrics=lyrics,endpoint="media.learn_the_lyrics")

@media_bp.route('/tkuradio')
def tku_radio():
    songs = TKURadio.query.filter_by(published=True).all()
    playlists = set()
    for song in songs:
        for playlist in song.playlist_group.split(","):
            playlists.add(playlist.strip())
    priority_playlists = [
        "TKU_LIBRARY",
        "LAYOVER_ALBUM",
        "GOLDEN_ALBUM",
        "TETE_VIBES",
        "KOOKIE_VIBES"
    ]
    playlists = (
        [p for p in priority_playlists if p in playlists] +
        sorted([p for p in playlists if p not in priority_playlists])
    )
    return render_template("tkuradio.html",songs=songs,playlists=playlists)