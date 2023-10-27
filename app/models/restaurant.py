from sqlalchemy import func, select
from sqlalchemy.ext.hybrid import hybrid_property, hybrid_method
from .db import db, environment, SCHEMA, add_prefix_for_prod
from .review import Review
from .menu_item import MenuItem

class Restaurant(db.Model):
    __tablename__ = 'restaurants'

    def add_prefix_for_prod(attr):
        if environment == "production":
            return f"{SCHEMA}.{attr}"
        else:
            return attr

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    google_place_id = db.Column(db.String(255), nullable=True, unique=True)
    ubereats_store_id = db.Column(db.String(255), nullable=True, unique=True)
    owner_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')))
    banner_image_path = db.Column(db.String(500))
    street_address = db.Column(db.String(255))
    city = db.Column(db.String(100))
    state = db.Column(db.String(100))
    postal_code = db.Column(db.String(20))
    country = db.Column(db.String(100))
    latitude = db.Column(db.Float, nullable=True)
    longitude = db.Column(db.Float, nullable=True)
    name = db.Column(db.String(100))
    description = db.Column(db.Text)
    opening_time = db.Column(db.Time)
    closing_time = db.Column(db.Time)
    food_type = db.Column(db.String(100))

    menu_items = db.relationship('MenuItem', backref='restaurant', lazy=True, cascade="all, delete-orphan")
    reviews = db.relationship('Review', backref='restaurant', lazy=True)

    @hybrid_property
    def average_rating(self):
        avg_rating = (
            db.session.query(func.round(func.avg(Review.stars), 1))
            .filter(Review.restaurant_id == self.id)
            .scalar()
        )
        return avg_rating or 0

    @average_rating.expression
    def average_rating(cls):
        return (
            select([func.round(func.avg(Review.stars), 1)])
            .where(Review.restaurant_id == cls.id)
            .label("average_rating")
        )
    def get_num_reviews(self):
        # Calculate and return the number of reviews for this restaurant
        num_reviews = (
            db.session.query(func.count(Review.id))
            .filter(Review.restaurant_id == self.id)
            .scalar()
        )
        return num_reviews or 0

    def to_dict(self):
        return {
            'id': self.id,
            'google_place_id': self.google_place_id,
            'ubereats_store_id': self.ubereats_store_id,
            'owner_id': self.owner_id,
            'name': self.name,
            'description': self.description,
            'banner_image_path': self.banner_image_path,
            'street_address': self.street_address,
            'city': self.city,
            'state': self.state,
            'country': self.country,
            'latitude': self.latitude,
            'longitude': self.longitude,
            'postal_code': self.postal_code,
            'opening_time': self.opening_time.strftime('%I:%M %p'),
            'closing_time': self.closing_time.strftime('%I:%M %p'),
            'food_type': self.food_type,
            'average_rating': self.average_rating,
            'num_reviews': self.get_num_reviews()
        }


# from datetime import datetime
# from werkzeug.security import generate_password_hash, check_password_hash
# from flask_login import UserMixin
# from sqlalchemy import func, select
# from sqlalchemy.sql.expression import func
# from sqlalchemy.ext.hybrid import hybrid_property
# from .db import db, environment, SCHEMA, add_prefix_for_prod
# from .review import Review
# from .menu_item import MenuItem

# class Restaurant(db.Model):

#     __tablename__ = 'restaurants'
#     def add_prefix_for_prod(attr):
#         if environment == "production":
#             return f"{SCHEMA}.{attr}"
#         else:
#             return attr
#     if environment == "production":
#         __table_args__ = {'schema': SCHEMA}

#     id = db.Column(db.Integer, primary_key=True)
#     owner_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')))
#     banner_image_path = db.Column(db.String(500))
#     street_address = db.Column(db.String(255))
#     city = db.Column(db.String(100))
#     state = db.Column(db.String(100))
#     postal_code = db.Column(db.String(20))
#     country = db.Column(db.String(100))
#     name = db.Column(db.String(100))
#     description = db.Column(db.Text)


#     opening_time = db.Column(db.Time)
#     closing_time = db.Column(db.Time)

#     menu_items = db.relationship('MenuItem', backref='restaurant', lazy=True, cascade="all, delete-orphan")
#     reviews = db.relationship('Review', backref='restaurant', lazy=True)

#     # @property
#     @hybrid_property
#     def average_rating(self):
#         # avg_rating = db.session.query(func.avg(Review.stars)).filter(Review.restaurant_id == self.id).scalar()
#         # return round(avg_rating, 1) if avg_rating is not None else 0
#         return round(self._average_rating, 1) if self._average_rating is not None else 0

#     @average_rating.expression
#     def average_rating(cls):
#         subquery = (
#             select([func.avg(Review.stars).label("avg_stars")])
#             .where(Review.restaurant_id == cls.id)
#             .as_scalar()
#         )

#         return subquery

#     def to_dict(self):
#         return {
#             'id': self.id,
#             'owner_id': self.owner_id,
#             'name': self.name,
#             'description': self.description,
#             'banner_image_path': self.banner_image_path,
#             'street_address': self.street_address,
#             'city': self.city,
#             'state': self.state,
#             'country': self.country,
#             'postal_code': self.postal_code,
#             'opening_time': self.opening_time.strftime('%H:%M'),
#             'closing_time': self.closing_time.strftime('%H:%M'),
#             'average_rating': self.average_rating
#         }

# # Another way to write avg_rating property:
#     # @property
#     # def avg_rating(self):
#     #     total_stars = 0
#     #     all_reviews = db.session.query(Review).filter(Review.restaurant_id == self.id).all()
#     #     for review in all_reviews:
#     #         total_stars += review.stars
#     #     average_rating = round(total_stars / len(all_reviews), 1) if all_reviews else 0
#     #     return average_rating
