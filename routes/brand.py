from flask import Blueprint, render_template, request
from models import Promotion
from helpers import get_page_music, get_banners


brand_bp = Blueprint("brand", __name__)


@brand_bp.route('/brandreputation')
def brandreputation():
    banners = get_banners('brand_reputation')
    return render_template("brandreputation.html", banners=banners)


@brand_bp.route('/promotions')
def promotions():
    ads = Promotion.query.order_by(Promotion.year.desc()).all()
    banners = get_banners('promotions')
    return render_template("promotions.html", ads=ads, banners=banners)