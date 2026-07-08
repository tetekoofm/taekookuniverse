from flask import Blueprint, render_template, request
from models import Promotion
from helpers import get_page_music, get_banners


brand_bp = Blueprint("brand", __name__)


@brand_bp.route('/brandreputation')
def brandreputation():
    banners = get_banners('07.08.brand_reputation')
    return render_template("07.08.brand_reputation.html", banners=banners)


@brand_bp.route('/promotions')
def promotions():
    ads = Promotion.query.order_by(Promotion.year.desc()).all()
    banners = get_banners('07.09.promotions')
    return render_template("07.09.promotions.html", ads=ads, banners=banners)