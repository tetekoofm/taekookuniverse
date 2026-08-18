from flask import Blueprint, render_template, request, jsonify, current_app
import os, json, random
from models import db, Recipe
from extensions import csrf

games_bp = Blueprint("games", __name__)

LEADERBOARD_FILE = "leaderboard.json"


@games_bp.route('/games')
def games():
    return render_template('games/games.html', themepark=True)

@games_bp.route("/themepark")
def themepark():
    return render_template('games/themepark.html', themepark=True)

@games_bp.route('/food-zone')
def food_zone():
    return render_template("games/zones/food_zone/food_zone.html", themepark=True)

@games_bp.route('/music-zone')
def music_zone():
    return render_template("games/zones/music_zone/music_zone.html", themepark=True)

@games_bp.route('/mystery-zone')
def mystery_zone():
    return render_template("games/zones/mystery_zone/mystery_zone.html", themepark=True)

@games_bp.route('/seasonal-zone')
def seasonal_zone():
    return render_template("games/zones/seasonal_zone/seasonal_zone.html", themepark=True)

@games_bp.route('/challenge-zone')
def challenge_zone():
    return render_template("games/zones/challenge_zone/challenge_zone.html", themepark=True)


#=============================== FOOD ====================================
@games_bp.route('/cookwithtaekook')
def cook_with_taekook():
    return render_template('games/zones/food_zone/cook_with_taekook.html')

@games_bp.route('/kookies-golden-kitchen')
def kookies_golden_kitchen():
    recipes = Recipe.query.filter_by(published=True).all()
    print("COUNT:", len(recipes))
    for r in recipes:
        if r.date:
            r.date = r.date.strftime("%b %d, %Y")
        print(r.recipe_name, r.published, type(r.published))
    return render_template(
        "games/zones/food_zone/kookies_golden_kitchen.html", recipes=recipes, 
        themepark=True
    )

#=============================== MYSTERY ====================================
@games_bp.route('/halloween-hunt')
def halloween_hunt():
    return render_template('games/zones/mystery_zone/halloween_hunt.html')

@games_bp.route('/halloween-special')
def halloween_special():
    return render_template('games/zones/mystery_zone/halloween_special.html')

@games_bp.app_context_processor
def inject_halloween_flag():
    return {
        "halloween_hunt_active": (
            request.path == "/halloween-hunt" or
            request.cookies.get("halloween_hunt_active") == "true"
        )
    }

@games_bp.route('/tofindyou')
def tofindyou():
    return render_template('games/mystery_zone/to_find_you.html')

#=============================== MUSIC ====================================
@games_bp.route('/guesswithemoji')
def guess_song_emoji():
    return render_template('games/zones/music_zone/guess_song_emoji.html')

@games_bp.route('/guesswithlyrics')
def guess_song_lyrics():
    return render_template('games/zones/music_zone/guess_song_lyrics.html')

@games_bp.route('/guesswithscrambled')
def guess_song_scrambled():
    return render_template('games/zones/music_zone/guess_song_scrambled.html')

#====== CHALLENGE ========
@games_bp.route('/taekooktrivia')
def taekooktrivia():
    return render_template('games/zones/challenge_zone/taekook_trivia.html')

@games_bp.route('/whosaidit')
def whosaidit():
    return render_template('games/zones/challenge_zone/whosaidit.html')

@games_bp.route('/memorygame')
def memory_game():
    folders = ["images/home/pictureoftheday", "images/brandambassador"]
    images = []
    for folder in folders:
        image_folder = os.path.join(current_app.static_folder, folder)
        if os.path.exists(image_folder):
            for file in os.listdir(image_folder):
                if file.lower().endswith((".jpg", ".jpeg", ".png", ".webp")):
                    images.append("/static/" + folder + "/" + file)
    print("Memory images:", len(images))
    return render_template('games/zones/challenge_zone/memory_game.html', images=images)

@games_bp.route('/puzzle')
def puzzle():
    folders=["images/home/pictureoftheday","images/brandambassador"]
    images=[]

    for folder in folders:
        image_folder=os.path.join(current_app.static_folder,folder)

        if os.path.exists(image_folder):
            for file in os.listdir(image_folder):
                if file.lower().endswith((".jpg",".jpeg",".png",".webp")):
                    images.append("/static/"+folder+"/"+file)

    random.shuffle(images)

    return render_template("games/zones/challenge_zone/puzzle.html",images=images)

#====== SEASONAL ========
@games_bp.route('/santas_delivery_dash')
def santas_delivery_dash():
    return render_template('games/zones/seasonal_zone/santas_delivery_dash.html')



#====== LEADERBOARD ========
def load_leaderboard():
    if not os.path.exists(LEADERBOARD_FILE):
        return {}
    with open(LEADERBOARD_FILE, 'r') as f:
        return json.load(f)

def save_leaderboard(data):
    with open(LEADERBOARD_FILE, 'w') as f:
        json.dump(data, f, indent=2)

@games_bp.route('/submit_score', methods=['POST'])
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

    data = load_leaderboard()

    if game not in data:
        data[game] = []

    data[game].append({
        "username": username,
        "score": score
    })

    data[game] = sorted(
        data[game],
        key=lambda x: x['score'],
        reverse=True
    )[:10]

    save_leaderboard(data)

    return jsonify({
        "success": True,
        "leaderboard": data[game]
    })

@games_bp.route('/leaderboard/<game_name>')
def get_leaderboard(game_name):
    data = load_leaderboard()
    return jsonify(data.get(game_name, []))