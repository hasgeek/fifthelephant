#!/usr/bin/env python

from os import environ
environ['FIFTHELEPHANT_ENV'] = 'development'

from fifthelephant import app
app.run('0.0.0.0', 6300, debug=True)
