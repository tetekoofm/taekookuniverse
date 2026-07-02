from flask import Flask, render_template, request, Response, redirect, session, url_for, jsonify, current_app, send_from_directory, send_file
import os, secrets, random, calendar, subprocess, base64, requests, json
from models import db, TKURadio, BackgroundMusic, Upcoming, Highlights, Recap, Memory, InTheNews, Discography, MusicVideo, Vote, Radio, SpotifyStats, YoutubeStats, ShazamStats, Fanbase, Banner, Project, Event, Promotion, FanLetter
from collections import defaultdict
from datetime import datetime
from flask_wtf import CSRFProtect

# Initialize the Flask app
app = Flask(__name__)

csrf = CSRFProtect(app)

# Set a secret key for session management
app.secret_key = secrets.token_hex(16)

# Update the database URI to point to taekook.db inside the 'instance' folder
project_dir = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{os.path.join(project_dir, 'instance', 'taekook.db')}"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize the SQLAlchemy with the app
db.init_app(app)


@app.before_request
def force_https():
    if not current_app.debug and not request.is_secure:
        url = request.url.replace("http://", "https://", 1)
        return redirect(url, code=301)

@app.route('/favicon.png')
def favicon():
    return send_from_directory('static', 'favicon.png', mimetype='image/png')

@app.route('/robots.txt')
def robots():
    return send_from_directory(app.static_folder, 'robots.txt')

@app.route('/sitemap.xml')
def sitemap():
    return send_file(os.path.join(app.root_path, 'static', 'sitemap.xml'), mimetype='application/xml')

## HELPER ###########################################################################################################################
from urllib.parse import urlparse, parse_qs

def extract_youtube_id(url):
    if not url:
        return None

    if "youtu.be" in url:
        return url.split("/")[-1].split("?")[0]

    if "youtube.com" in url:
        # handle watch?v=
        if "v=" in url:
            return url.split("v=")[1].split("&")[0]

        # handle embed/videoseries/shorts
        if "/embed/" in url:
            return url.split("/embed/")[1].split("?")[0]
        if "/shorts/" in url:
            return url.split("/shorts/")[1].split("?")[0]

        # fallback safe parsing
        query = parse_qs(urlparse(url).query)
        return query.get("v", [None])[0]

    return None

## HELPER ###########################################################################################################################

@app.route('/home_soon')
def home_soon():
    image_folder = os.path.join(app.static_folder, 'images/home')
    images = [f for f in os.listdir(image_folder) if f.endswith(('jpg', 'jpeg', 'png', 'gif', 'webp', '.mp4'))]
    music = BackgroundMusic.query.filter_by(page_name='home').first()
    song_file = music.file_name if music else "your_eyes_tell.mp3"
    song_name = music.song_name if music else "Default Song"
    return render_template('01.home_soon.html', song_file=song_file, song_name=song_name, images=images)

@app.route('/')
def home():
    image_folder = os.path.join(app.static_folder, 'images/home/pictureoftheday')
    images = [f for f in os.listdir(image_folder) if f.lower().endswith(('jpg', 'jpeg', 'png', 'gif', 'webp', 'mp4'))]
    random.shuffle(images)
    # selected_media = images[:6]  # ✅ correct list slicing
    music = BackgroundMusic.query.filter_by(page_name='home').first()
    song_file = music.file_name if music else "your_eyes_tell.mp3"
    song_name = music.song_name if music else "Your Eyes Tell"
    return render_template('01.home.html', song_file=song_file, song_name=song_name, images=images)

@app.route('/meet-tae')
def meet_tae():
    music = BackgroundMusic.query.filter_by(page_name='meet tae').first()
    song_file = music.file_name if music else "default.mp3"
    song_name = music.song_name if music else "Default Song"
    return render_template("10.01.meettae.html", song_file=song_file, song_name=song_name)

@app.route('/meet-koo')
def meet_koo():
    music = BackgroundMusic.query.filter_by(page_name='meet koo').first()
    song_file = music.file_name if music else "default.mp3"
    song_name = music.song_name if music else "Default Song"
    return render_template("10.02.meetkoo.html", song_file=song_file, song_name=song_name)

@app.route('/termsandconditions')
def termsandconditions():
    return render_template("10.03.termsandconditions.html")

@app.route('/upcoming')
def upcoming():
    upcoming_events = Upcoming.query.all()
    music = BackgroundMusic.query.filter_by(page_name='upcoming').first()
    song_file = music.file_name if music else "default.mp3"
    song_name = music.song_name if music else "Default Song"
    for event in upcoming_events:
        if isinstance(event.date, str): 
            event.date = datetime.strptime(event.date, '%Y-%m-%d') 
    return render_template("02.01.upcoming.html", upcoming=upcoming_events, song_file=song_file, song_name=song_name)

@app.route('/highlights')
def highlights():
    highlights_events = Highlights.query.all()
    music = BackgroundMusic.query.filter_by(page_name='highlights').first()
    song_file = music.file_name if music else "default.mp3"
    song_name = music.song_name if music else "Default Song"
    for event in highlights_events:
        if isinstance(event.date, str): 
            event.date = datetime.strptime(event.date, '%Y-%m-%d') 
    return render_template("02.02.highlights.html", highlights=highlights_events, song_file=song_file, song_name=song_name)

@app.route('/recap')
def recap():
    recaps = Recap.query.order_by(Recap.date.desc()).all()
    music = BackgroundMusic.query.filter_by(page_name='highlights').first()
    song_file = music.file_name if music else "default.mp3"
    song_name = music.song_name if music else "Default Song"
    return render_template("02.03.recap.html", recaps=recaps, song_file=song_file, song_name=song_name)

@app.route('/memories')
def memories():
    memories_data = Memory.query.all()
    music = BackgroundMusic.query.filter_by(page_name='memories').first()
    song_file = music.file_name if music else "default.mp3"
    song_name = music.song_name if music else "Default Song"
    timeline_data = defaultdict(lambda: defaultdict(list))

    for memory in memories_data:
        year, month, day = map(int, memory.date.split('-'))  
        timeline_data[year][month].append({
            'id': memory.id,
            'title': memory.title,
            'date': f'{year}-{month:02}-{day:02}',  
            'description': memory.description,
        })

    for year in range(2013, 2025):  
        if year not in timeline_data:
            timeline_data[year] = {}
        for month in range(1, 13): 
            timeline_data[year].setdefault(month, [])

        # Sort months chronologically
        timeline_data[year] = {
            month: timeline_data[year][month]
            for month in sorted(timeline_data[year])
        }

    formatted_years = {year: str(year)[-2:] for year in timeline_data.keys()}

    return render_template('03.memories_soon.html', song_file=song_file, song_name=song_name)

@app.route('/memories_galaxy')
def memories_galaxy():
    memories_data = Memory.query.all()

    music = BackgroundMusic.query.filter_by(page_name='memories').first()
    song_file = music.file_name if music else "default.mp3"
    song_name = music.song_name if music else "Default Song"

    events = []
    for memory in memories_data:
        year, month, day = map(int, memory.date.split('-'))

        events.append({
            "year": year,
            "month": memory.date.split('-')[1],
            "title": memory.title,
            "image": memory.image,
            "description": memory.description,
            "artist": memory.artist,
            "date": memory.date,
        })

    return render_template(
        '03.memories.html',
        events=events,
        song_file=song_file,
        song_name=song_name
    )
@app.route('/get-event-details/<int:event_id>', methods=['GET'])
def get_event_details(event_id):
    event = Memory.query.get(event_id)
    if event:
        return jsonify({
            'title': event.title,
            'image': url_for('static', filename=f'images/{event.image}'),
            'description': event.description,
            'date': event.date
        })
    else:
        return jsonify({'error': 'Event not found'}), 404

@app.route('/inthenews')
def inthenews():
    inthenews = InTheNews.query.order_by(InTheNews.date.desc()).all()
    music = BackgroundMusic.query.filter_by(page_name='inthenews').first()
    song_file = music.file_name if music else "default.mp3"
    song_name = music.song_name if music else "Default Song"
    return render_template("04.inthenews.html", song_file=song_file, song_name=song_name, inthenews=inthenews)

@app.route('/vibe')
def vibe():
    song_names = [song.song_name for song in Discography.query.all() if song.song_name]
    taehyung_videos = db.session.query(MusicVideo).filter(MusicVideo.artist == 'Taehyung').all()
    jungkook_videos = db.session.query(MusicVideo).filter(MusicVideo.artist == 'Jungkook').all()

    for v in taehyung_videos:
        v.youtube_id = extract_youtube_id(v.youtube_url)

    for v in jungkook_videos:
        v.youtube_id = extract_youtube_id(v.youtube_url)

    random.shuffle(taehyung_videos)
    random.shuffle(jungkook_videos)

    music = BackgroundMusic.query.filter_by(page_name='vibe').first()
    song_file = music.file_name if music else "default.mp3"
    song_name = music.song_name if music else "Default Song"
    return render_template("05.vibe.html", song_names=song_names, song_file=song_file, song_name=song_name, taehyung_videos=taehyung_videos, jungkook_videos=jungkook_videos)

@app.route('/projects')
def projects():
    projects = Project.query.all()  
    music = BackgroundMusic.query.filter_by(page_name='projects').first()
    song_file = music.file_name if music else "default.mp3"
    song_name = music.song_name if music else "Default Song"
    return render_template("06.projects.html", song_file=song_file, song_name=song_name, projects=projects)

@app.route('/pride')
def pride():
    return render_template("11.pride.html")

@app.route('/guide')
def guide():
    return render_template("07.guide.html")

@app.route('/donating')
def donating():
    banners = Banner.query.filter_by(subpage='07.01.donating').all()
    return render_template('07.01.donating.html', banners=banners)

@app.route('/fanbases')
def fanbases():
    fanbases = Fanbase.query.all()
    banners = Banner.query.filter_by(subpage='07.02.fanbases').all()
    for fanbase in fanbases:
        print(fanbase.fb_name, fanbase.x, fanbase.instagram, fanbase.facebook)
    return render_template("07.02.fanbases.html", fanbases=fanbases, banners=banners)

@app.route('/streaming')
def streaming():
    trending_tracks = Discography.query.filter_by(popular=1).all()
    banners = Banner.query.filter_by(subpage='07.03.streaming').all()
    return render_template('07.03.streaming.html', trending_tracks=trending_tracks, banners=banners)

@app.route('/buying')
def buying():
    banners = Banner.query.filter_by(subpage='07.04.buying').all()
    return render_template('07.04.buying.html', banners=banners)

@app.route('/voting')
def voting():
    banners = Banner.query.filter_by(subpage='07.05.voting').all()
    vote_apps = Vote.query.all()  # Fetch all voting apps
    return render_template('07.05.voting.html', banners=banners, vote_apps=vote_apps)

@app.route('/radio')
def radio():
    radio_stations = Radio.query.all() 
    banners = Banner.query.filter_by(subpage='07.06.radio').all()
    return render_template('07.06.radio.html', radio_stations=radio_stations, banners=banners)

@app.route('/shazam')
def shazam():
    banners = Banner.query.filter_by(subpage='07.07.shazam').all()
    return render_template('07.07.shazam.html', banners=banners)

@app.route('/brandreputation')
def brandreputation():
    banners = Banner.query.filter_by(subpage='07.08.brand_reputation').all()
    return render_template('07.08.brand_reputation.html', banners=banners)

@app.route('/promotions')
def promotions():
    ads = Promotion.query.order_by(Promotion.year.desc()).all()
    banners = Banner.query.filter_by(subpage='07.09.promotions').all()
    return render_template('07.09.promotions.html', ads=ads)

@app.route('/endorsements')
def endorsements():
    banners = Banner.query.filter_by(subpage='07.09.endorsements').all()
    return render_template('07.09.endorsements.html', banners=banners)

@app.route('/events')
def events():
    events = Event.query.all()
    banners = Banner.query.filter_by(subpage='07.10.events').all()
    return render_template('07.10.events.html', banners=banners, events=events)

@app.route('/reporting')
def reporting():
    banners = Banner.query.filter_by(subpage='07.11.reporting').all()
    return render_template('07.11.reporting.html', banners=banners)

@app.route('/fanletters')
def fan_letters_page():
    page = request.args.get('page', 1, type=int)
    per_page = 20
    fan_letters = FanLetter.query.paginate(page=page, per_page=per_page, error_out=False)
    music = BackgroundMusic.query.filter_by(page_name='fan letters').first()
    song_file = music.file_name if music else "default.mp3"
    song_name = music.song_name if music else "Default Song"
    return render_template('09.fanletters.html', song_file=song_file, song_name=song_name, fan_letters=fan_letters)

## GAMES ##########################################################################################################

@app.route('/games')
def games():
    return render_template('13.games.html')

LEADERBOARD_FILE = 'leaderboard.json'  # or full path if outside project folder


# ---------------------- HALLOWEEN HUNT ----------------------
# Required as we have if clause in base nav and sub nav remplates
@app.context_processor
def inject_halloween_flag():
    # make this True during the Halloween event
    return dict(halloween_hunt_active=True)

@app.route("/santas_delivery_dash")
def santas_delivery_dash():
    return render_template("13.01.santas_delivery_dash.html")

@app.route("/halloween-hunt")
def halloween_hunt():
    return render_template("13.01.halloween_hunt.html")

@app.route("/halloween-special")
def halloween_special():
    return render_template("13.01.halloween_special.html")

@app.route('/guesswithemoji')
def guess_song_emoji():
    return render_template('13.02.guess_song_emoji.html')

@app.route('/guesswithlyrics')
def guess_song_lyrics():
    return render_template('13.03.guess_song_lyrics.html')

@app.route('/guesswithscrambled')
def guess_song_scrambled():
    return render_template('13.04.guess_song_scrambled.html')

@app.route('/cookwithtaekook')
def cook_with_taekook():
    return render_template('13.07.cook_with_taekook.html')

@app.route('/memorygame')
def memory_game():
    return render_template('13.08.memory_game.html')

# Load leaderboard JSON
def load_leaderboard():
    if not os.path.exists(LEADERBOARD_FILE):
        return {}
    with open(LEADERBOARD_FILE, 'r') as f:
        return json.load(f)

# Save leaderboard JSON
def save_leaderboard(data):
    with open(LEADERBOARD_FILE, 'w') as f:
        json.dump(data, f, indent=2)

@app.route('/submit_score', methods=['POST'])
@csrf.exempt
def submit_score():
    payload = request.get_json()
    if not payload:
        return jsonify({"error": "No JSON received"}), 400

    game = payload.get('game')
    username = payload.get('username', 'Anonymous')
    score = payload.get('score', 0)

    if not game:
        return jsonify({"error": "Game name required"}), 400

    # Load existing data
    data = load_leaderboard()
    if game not in data:
        data[game] = []

    # Append and sort
    data[game].append({"username": username, "score": score})
    data[game] = sorted(data[game], key=lambda x: x['score'], reverse=True)[:10]

    # Save back
    save_leaderboard(data)

    return jsonify({"success": True, "leaderboard": data[game]})

# Fetch leaderboard
@app.route('/leaderboard/<game_name>')
def get_leaderboard(game_name):
    data = load_leaderboard()
    return jsonify(data.get(game_name, []))

## GAMES ############################################################################################################################

@app.after_request
def add_headers(response):
    response.headers["Permissions-Policy"] = "compute-pressure=()"
    return response

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=8888)