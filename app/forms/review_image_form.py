from flask_wtf import FlaskForm
from wtforms import FileField, IntegerField, StringField, SubmitField
from wtforms.validators import DataRequired, URL, Optional, Length, ValidationError

class ReviewImgForm(FlaskForm):
    image = FileField("Upload Image")
    image_url = StringField('Image URL', validators=[Optional(), URL(), Length(max=500)])
    submit = SubmitField("Submit")

    def validate_image(self, field):
        if not self.image.data and not self.image_url.data:
            raise ValidationError('Either upload an image or provide an image URL')




    # image = FileField("Image File", validators=[FileRequired(), FileAllowed(list(ALLOWED_EXTENSIONS))])
