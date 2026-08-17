from flask import Blueprint, render_template, request
import random
from models import Project, BrandAmbassador, FanLetter, Event, Banner, BackgroundMusic
from helpers import get_page_music, get_banners


projects_bp = Blueprint("projects", __name__)


@projects_bp.route('/projects')
def projects():
    projects = Project.query.all()
    song_file, song_name = get_page_music("projects")
    return render_template("06.projects.html", projects=projects, song_file=song_file, song_name=song_name)


@projects_bp.route('/brandambassador')
def brandambassador():
    artist = request.args.get('artist')
    query = BrandAmbassador.query
    if artist:
        query = query.filter(
            BrandAmbassador.artist == artist)
    brands = query.order_by(BrandAmbassador.year.desc()).all()
    return render_template("08.brandambassadorship.html", endpoint="projects.brandambassador", brands=brands)


@projects_bp.route('/fanletters-old')
def fan_letters():
    page = request.args.get('page', 1, type=int)
    pagination = FanLetter.query.paginate(page=page, per_page=8, error_out=False)
    song_file, song_name = get_page_music("fan letters")
    return render_template("09.fanletters_old.html", fan_letters=pagination.items, pagination=pagination, endpoint="projects.fan_letters", song_file=song_file, song_name=song_name)


@projects_bp.route('/fanletters')
def fan_letters_demo():
    page = request.args.get('page', 1, type=int)
    pagination = FanLetter.query.paginate(page=page, per_page=8, error_out=False)
    all_letters = FanLetter.query.all()
    featured_letters = random.sample(all_letters, min(5, len(all_letters)))
    song_file, song_name = get_page_music("fan letters")
    return render_template("09.fanletters.html", 
        fan_letters=pagination.items, 
        featured_letters=featured_letters,
        pagination=pagination,
        endpoint="projects.fan_letters_demo",
        song_file=song_file,
        song_name=song_name
    )