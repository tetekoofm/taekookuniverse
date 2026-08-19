from flask import Blueprint, render_template, request
from models import BackgroundMusic, Upcoming, Highlights, Recap, InTheNews
from datetime import datetime
from helpers import get_page_music


updates_bp = Blueprint("updates", __name__)


@updates_bp.route('/upcoming')
def upcoming():
    upcoming_events = Upcoming.query.all()
    song_file, song_name = get_page_music("upcoming")
    for event in upcoming_events:
        if isinstance(event.date, str): event.date = datetime.strptime(event.date, '%Y-%m-%d')
    return render_template("upcoming.html", upcoming=upcoming_events, song_file=song_file, song_name=song_name)


@updates_bp.route('/highlights')
def highlights():
    page = request.args.get('page', 1, type=int)
    artist = request.args.get('artist')
    query = Highlights.query
    if artist: query = query.filter((Highlights.artist == artist) | (Highlights.artist == "TaeKook"))
    pagination = query.order_by(Highlights.date.desc()).paginate(page=page, per_page=8, error_out=False)
    song_file, song_name = get_page_music("highlights")
    for event in pagination.items:
        if isinstance(event.date, str): event.date = datetime.strptime(event.date, '%Y-%m-%d')
    return render_template("highlights.html", highlights=pagination.items, pagination=pagination, endpoint="updates.highlights", song_file=song_file, song_name=song_name)


@updates_bp.route('/recap')
def recap():
    page = request.args.get('page', 1, type=int)
    query = Recap.query
    pagination = Recap.query.order_by(Recap.date.desc()).paginate(page=page, per_page=8, error_out=False)
    song_file, song_name = get_page_music("recap")
    return render_template("recap.html", recaps=pagination.items, pagination=pagination, endpoint="updates.recap", song_file=song_file, song_name=song_name)


@updates_bp.route('/inthenews')
def inthenews():
    page = request.args.get('page', 1, type=int)
    artist = request.args.get('artist')
    query = InTheNews.query
    if artist: query = query.filter((InTheNews.artist == artist) | (InTheNews.artist == "TaeKook"))
    pagination = query.order_by(InTheNews.date.desc()).paginate(page=page, per_page=8, error_out=False)
    song_file, song_name = get_page_music("inthenews")
    return render_template("inthenews.html", inthenews=pagination.items, pagination=pagination, endpoint="updates.inthenews", song_file=song_file, song_name=song_name)
