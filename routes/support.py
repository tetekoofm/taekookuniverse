from flask import Blueprint, render_template, request
from models import Banner, Fanbase, Discography, Vote, Radio, Promotion, Event
from helpers import get_page_music, get_banners

support_bp = Blueprint("support", __name__)


@support_bp.route('/guide')
def guide():
    return render_template("guide.html")


@support_bp.route('/donations')
def donations():
    banners = get_banners('donations')
    return render_template("donations.html", banners=banners)


@support_bp.route('/fanbases')
def fanbases():
    fanbases = Fanbase.query.all()
    banners = get_banners('fanbases')
    return render_template("fanbases.html", fanbases=fanbases, banners=banners)


@support_bp.route('/streaming')
def streaming():
    trending_tracks = Discography.query.filter_by(popular=1).all()
    banners = get_banners('streaming')
    return render_template("streaming.html", trending_tracks=trending_tracks,banners=banners)


@support_bp.route('/buying')
def buying():
    banners = get_banners('buying')
    return render_template("buying.html", banners=banners)


@support_bp.route('/voting')
def voting():
    banners = get_banners('voting')
    vote_apps = Vote.query.all()
    return render_template("voting.html", banners=banners, vote_apps=vote_apps)


@support_bp.route('/radio')
def radio():
    radio_stations = Radio.query.all()
    banners = get_banners('radio')
    return render_template("radio.html", radio_stations=radio_stations, banners=banners)

@support_bp.route('/shazam')
def shazam():
    banners = get_banners('shazam')
    return render_template("shazam.html", banners=banners)


@support_bp.route('/brandreputation')
def brandreputation():
    banners = get_banners('brand_reputation').all()
    return render_template("brand_reputation.html", banners=banners)


@support_bp.route('/promotions')
def promotions():
    ads = Promotion.query.order_by(Promotion.year.desc()).all()
    banners = get_banners('promotions')
    return render_template("promotions.html", ads=ads, banners=banners)


@support_bp.route('/endorsements')
def endorsements():
    banners = get_banners('endorsements')
    return render_template("endorsements.html", banners=banners)


@support_bp.route('/events')
def events():
    page = request.args.get('page', 1, type=int)
    query = Event.query
    pagination = query.order_by(Event.date.desc()).paginate(page=page, per_page=8, error_out=False)
    banners = get_banners('events')
    song_file, song_name = get_page_music("events")
    return render_template("events.html", events=pagination.items, pagination=pagination, endpoint="support.events", banners=banners, song_file=song_file, song_name=song_name)

@support_bp.route('/reporting')
def reporting():
    banners = get_banners('reporting')
    return render_template("reporting.html", banners=banners)

