#!/usr/bin/env python

from os import environ
environ['FIFTHELEPHANT_ENV'] = 'development'

from fifthelephant import app
from fifthelephant.models import db

db.create_all()
app.run('0.0.0.0', 6200, debug=True)
