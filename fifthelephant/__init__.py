#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
Website server for fifthelephant.
"""

from flask import Flask
from flask.ext.assets import Environment, Bundle
from baseframe import baseframe, baseframe_js, baseframe_css
#from os import environ
from coaster.app import configure

# First, make an app and config it

app = Flask(__name__, instance_relative_config=True)
configure(app, 'FIFTHELEPHANT_ENV')

app.register_blueprint(baseframe)
assets = Environment(app)
js = Bundle(Bundle(baseframe_js, 'js/jquery.smooth-scroll.min.js', 'js/fifthelephant.js', filters='jsmin', output='js/fifthelephant-packed.js'))
css = Bundle(Bundle(baseframe_css, 'css/fifthelephant.css', filters='cssmin', output='css/fifthelephant-packed.css'))
assets.register('js_all', js)
assets.register('css_all', css)

import fifthelephant.views
#if environ.get('FIFTHELEPHANT_ENV') == 'prod':
#    import fifthelephant.loghandler
	