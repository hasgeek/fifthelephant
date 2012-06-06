#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
Website for The Fifth Elephant.
"""

from flask import Flask, render_template, redirect, url_for
from flask.ext.assets import Environment, Bundle
from baseframe import baseframe, baseframe_js, baseframe_css
from coaster.app import configure

app = Flask(__name__, instance_relative_config=True)
configure(app, 'FIFTHELEPHANT_ENV')

app.register_blueprint(baseframe)
assets = Environment(app)
js = Bundle(
    Bundle(baseframe_js, 'js/jquery.smooth-scroll.min.js', 'js/app.js',
        filters='jsmin', output='js/packed.js'),
    'js/leaflet/leaflet.js')
css = Bundle(Bundle(baseframe_css, 'css/app.css', filters='cssmin', output='css/packed.css', debug=True),
    'js/leaflet/leaflet.css')
assets.register('js_all', js)
assets.register('css_all', css)


@app.route('/')
def index():
    return redirect(url_for('index2012'), code=302)


@app.route('/2012/')
def index2012():
    return render_template('index.html')
