from flask import Blueprint, render_template, request
from models import Banner, Fanbase, Discography, Vote, Radio, Promotion, Event
from helpers import get_page_music, get_banners


support_bp = Blueprint("support", __name__)


@support_bp.route('/guide')
def guide():
    return render_template("07.guide.html")


@support_bp.route('/donations')
def donations():
    banners = get_banners('07.01.donations')
    return render_template("07.01.donations.html", banners=banners)


@support_bp.route('/fanbases')
def fanbases():
    fanbases = Fanbase.query.all()
    banners = get_banners('07.02.fanbases')
    return render_template("07.02.fanbases.html", fanbases=fanbases, banners=banners)


@support_bp.route('/streaming')
def streaming():
    trending_tracks = Discography.query.filter_by(popular=1).all()
    banners = get_banners('07.03.streaming')
    return render_template("07.03.streaming.html", trending_tracks=trending_tracks,banners=banners)


@support_bp.route('/buying')
def buying():
    banners = get_banners('07.04.buying')
    return render_template("07.04.buying.html", banners=banners)


@support_bp.route('/voting')
def voting():
    banners = get_banners('07.05.voting')
    vote_apps = Vote.query.all()

    return render_template(
        "07.05.voting.html",
        banners=banners,
        vote_apps=vote_apps
    )


@support_bp.route('/radio')
def radio():
    radio_stations = Radio.query.all()
    banners = get_banners('07.06.radio')

    return render_template("07.06.radio.html", radio_stations=radio_stations, banners=banners)

@support_bp.route('/shazam')
def shazam():
    banners = get_banners('07.07.shazam')
    return render_template("07.07.shazam.html", banners=banners)


@support_bp.route('/brandreputation')
def brandreputation():
    banners = get_banners('07.08.brand_reputation').all()
    return render_template("07.08.brand_reputation.html", banners=banners)


@support_bp.route('/promotions')
def promotions():
    ads = Promotion.query.order_by(Promotion.year.desc()).all()
    banners = get_banners('07.09.promotions')
    return render_template("07.09.promotions.html", ads=ads, banners=banners)


@support_bp.route('/endorsements')
def endorsements():
    banners = get_banners('07.09.endorsements')
    return render_template("07.09.endorsements.html", banners=banners)


@support_bp.route('/events')
def events():
    page = request.args.get('page', 1, type=int)
    pagination = Event.query.paginate(page=page, per_page=8, error_out=False)
    banners = get_banners('07.10.events')
    song_file, song_name = get_page_music("events")
    return render_template("07.10.events.html", events=pagination.items, pagination=pagination, endpoint="support.events", banners=banners, song_file=song_file, song_name=song_name)


@support_bp.route('/reporting')
def reporting():
    banners = get_banners('07.11.reporting')
    return render_template("07.11.reporting.html", banners=banners)


@support_bp.route('/demo')
def demo():
    trending_tracks = Discography.query.filter_by(popular=1).all()
    banners = get_banners('07.03.streaming')
    return render_template("Demo.html", trending_tracks=trending_tracks, banners=banners)
