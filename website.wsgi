import sys
import os, os.path
sys.path.insert(0, os.path.dirname(__file__))
os.environ['FIFTHELEPHANT_ENV'] = 'production'
from fifthelephant import app as application
