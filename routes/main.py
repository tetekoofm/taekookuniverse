from flask import Blueprint, render_template, send_from_directory, send_file, current_app
from models import BackgroundMusic
import os
import random
from helpers import get_page_music


main_bp = Blueprint("main", __name__)


@main_bp.route('/favicon.png')
def favicon():
    return send_from_directory('static', 'favicon.png', mimetype='image/png')


@main_bp.route('/robots.txt')
def robots():
    return send_from_directory('static', 'robots.txt')


@main_bp.route('/sitemap.xml')
def sitemap():
    return send_file(os.path.join(os.path.dirname(__file__), '..', 'static', 'sitemap.xml'), mimetype='application/xml')


@main_bp.route('/home_soon')
def home_soon():
    image_folder = os.path.join(current_app.static_folder, 'images/home')
    images = [f for f in os.listdir(image_folder) if f.lower().endswith(('jpg','jpeg','png','gif','webp','mp4'))]
    song_file, song_name = get_page_music("home")
    return render_template('01.home_soon.html', song_file=song_file, song_name=song_name, images=images)


@main_bp.route('/')
def home():
    image_folder = os.path.join(current_app.static_folder, 'images/home/pictureoftheday')
    images = [f for f in os.listdir(image_folder) if f.lower().endswith(('jpg','jpeg','png','gif','webp','mp4'))]
    random.shuffle(images)
    song_file, song_name = get_page_music("home")
    return render_template('01.home.html', song_file=song_file, song_name=song_name, images=images)


@main_bp.route('/meet-tae')
def meet_tae():
    song_file, song_name = get_page_music("meet tae")
    return render_template("10.01.meettae.html", song_file=song_file, song_name=song_name)


@main_bp.route('/meet-koo')
def meet_koo():
    song_file, song_name = get_page_music("meet koo")
    return render_template("10.02.meetkoo.html", song_file=song_file, song_name=song_name)


@main_bp.route('/termsandconditions')
def termsandconditions():
    return render_template("10.03.termsandconditions.html")


@main_bp.route('/pride')
def pride():
    return render_template("11.pride.html")

# @main_bp.route('/demo')
# def demo():
#     return render_template("Demo.html")