from datetime import datetime
from flask import Blueprint, jsonify, request, current_app
from sqlite3 import OperationalError
from flask_login import login_required, current_user
from app.models import db, Order, OrderItem, MenuItem, Payment
from ..forms import PaymentForm
from ..helper_functions import normalize_data, is_valid_payment_data

payment_routes = Blueprint('payments', __name__)

# Define a standardized response format
def api_response(data=None, status_code=200, error=None):
    response = {
        "data": data,
        "error": error
    }
    return jsonify(response), status_code

# ***************************************************************
# Endpoint to Get All Payments
# ***************************************************************
@payment_routes.route('/', methods=['GET'])
def get_all_payments():
    """
    Fetches and returns all payment records from the database.

    Returns:
        Response: A list of all payment records, or an error message if any issues arise.
    """
    try:
        payments = Payment.query.all()
        payment_dicts = [payment.to_dict() for payment in payments]
        return api_response(data=payment_dicts)
    except Exception as e:
        return api_response(error=str(e), status_code=500)

# ***************************************************************
# Endpoint to Get Payment by ID
# ***************************************************************
@payment_routes.route('/<int:id>')
def get_payment(id):
    """
    Fetches a specific payment record using its ID.

    Args:
        id (int): The ID of the payment record to retrieve.

    Returns:
        Response: The requested payment record or an error message if not found.
    """
    try:
        payment = Payment.query.get(id)
        if payment:
            return api_response(data=payment.to_dict())
        else:
            return api_response(error="Payment not found", status_code=404)
    except Exception as e:
        return api_response(error=str(e), status_code=500)

# ***************************************************************
# Endpoint to Create a Payment
# ***************************************************************
@login_required
@payment_routes.route('', methods=['POST'])
def create_payment():
    """
    Creates a new payment record in the database.

    Returns:
        Response: The newly created payment record or an error message if validation fails.
    """
    try:
        print("CSRF Token from headers:", request.headers.get("X-CSRFToken"))
        data = request.get_json()
        if not data:
            current_app.logger.error("No data provided")
            return api_response(error="Invalid data", status_code=400)

        form = PaymentForm(data=data)
        # form.csrf_token.data = request.cookies.get('csrf_token')

        if form.validate():
            gateway = form.gateway.data
            current_app.logger.info(f"Using payment gateway: {gateway}")

            if gateway not in ["Stripe", "PayPal", "Credit Card"]:
                raise ValueError(f"Invalid payment gateway: {gateway}")

            # Create a dictionary with only the fields needed for the Payment model
            payment_data = {
                # "order_id": order_id,
                "gateway": form.gateway.data,
                "amount": form.amount.data,
                "status": form.status.data,
            }

            # Include additional fields for credit card payments
            if gateway == 'Credit Card':
                payment_data.update({
                    "cardholder_name": form.cardholder_name.data,
                    "card_number": form.card_number.data,
                    "card_expiry_month": form.card_expiry_month.data,
                    "card_expiry_year": form.card_expiry_year.data,
                    "card_cvc": form.card_cvc.data,
                    "postal_code": form.postal_code.data
                })

            # Instantiate and add the Payment record to the database session
            payment = Payment(**payment_data)
            db.session.add(payment)
            db.session.commit()
            return api_response(data=payment.to_dict(), status_code=201)

        else:
            current_app.logger.error(f"Form validation errors: {form.errors}")
            return api_response(error=form.errors, status_code=400)
        
    except ValueError as ve:
        current_app.logger.error(f"Validation Error: {str(ve)}")
        return api_response(error=str(ve), status_code=400)

    except Exception as e:
        current_app.logger.error(f"Error creating payment record: {str(e)}")
        current_app.logger.error("Session state before rollback: %s", db.session.dirty)
        db.session.rollback()
        return api_response(error=str(e), status_code=500)


# ***************************************************************
# Endpoint to Update a Payment
# ***************************************************************
@login_required
@payment_routes.route('/<int:id>', methods=['PUT'])
def update_payment(id):
    """
    Updates an existing payment record in the database.

    Args:
        id (int): The ID of the payment record to update.

    Returns:
        Response: The updated payment record or an error message if validation fails or record is not found.
    """
    try:
        payment = Payment.query.get(id)
        if not payment:
            return api_response(error="Payment not found", status_code=404)

        data = request.get_json()
        if not data:
            return api_response(error="Invalid data", status_code=400)

        # Validate data and update payment if the status is not "Completed"
        if payment.status != "Completed":
            payment.gateway = data.get('gateway', payment.gateway)
            payment.amount = data.get('amount', payment.amount)
            payment.status = data.get('status', payment.status)
            db.session.commit()
            return api_response(data=payment.to_dict())
        else:
            return api_response(error="Payment status is 'Completed'", status_code=400)
    except Exception as e:
        db.session.rollback()
        return api_response(error=str(e), status_code=500)

# ***************************************************************
# Endpoint to Delete a Payment
# ***************************************************************
@login_required
@payment_routes.route('/<int:id>', methods=['DELETE'])
def delete_payment(id):
    """
    Deletes a specific payment record using its ID.

    Args:
        id (int): The ID of the payment record to delete.

    Returns:
        Response: A success message if deletion is successful, or an error message if the record is not found.
    """
    try:
        payment = Payment.query.get(id)
        if payment:
            db.session.delete(payment)
            db.session.commit()
            return api_response(data=f"Deleted payment with id {id}")
        else:
            return api_response(error="Payment not found", status_code=404)
    except Exception as e:
        db.session.rollback()
        return api_response(error=str(e), status_code=500)
