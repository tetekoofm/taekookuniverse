from flask import Flask
from extensions import db, csrf
import os


def create_app():
    app = Flask(__name__)
    app.secret_key = os.environ.get(
        "SECRET_KEY",
        "dev-secret"
    )
    project_dir = os.path.abspath(os.path.dirname(__file__))
    app.config['SQLALCHEMY_DATABASE_URI'] = (
        f"sqlite:///{os.path.join(project_dir, 'instance', 'taekook.db')}"
    )
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False


    # Initialize extensions
    db.init_app(app)
    csrf.init_app(app)


    # Register blueprints
    from routes.main import main_bp
    app.register_blueprint(main_bp)

    from routes.updates import updates_bp
    app.register_blueprint(updates_bp)

    from routes.media import media_bp
    app.register_blueprint(media_bp)

    from routes.support import support_bp
    app.register_blueprint(support_bp)

    from routes.projects import projects_bp
    app.register_blueprint(projects_bp)

    from routes.brand import brand_bp
    app.register_blueprint(brand_bp)

    from routes.games import games_bp
    app.register_blueprint(games_bp)

    return app

app = create_app()


if __name__ == "__main__":
    app.run(
        debug=True,
        host="0.0.0.0",
        port=8888
    )