# -*- coding: utf-8 -*-

from flask.ext.sqlalchemy import SQLAlchemy
from fifthelephant import app
from coaster.sqlalchemy import BaseMixin, BaseNameMixin
from flask.ext.lastuser.sqlalchemy import UserBase

db = SQLAlchemy(app)


class User(UserBase, db.Model):
    __tablename__ = 'user'
