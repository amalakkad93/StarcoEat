from flask import Blueprint, jsonify, request,redirect, url_for, abort
import app
from flask_login import current_user, login_user, logout_user, login_required
from app.models import User, Restaurant, Review, db, MenuItem,MenuItemImg
from sqlalchemy import func, distinct, or_, desc

import json

shopping_cart_item_routes = Blueprint('shopping_cart_item', __name__)