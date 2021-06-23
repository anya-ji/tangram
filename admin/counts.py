'''
Test.
Run in venv: source venv/bin/activate
'''
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
from os import listdir
from os.path import isfile, join
from datetime import datetime, timezone
from collections import defaultdict
import csv 

cred = credentials.Certificate("./tangram-c997f-firebase-adminsdk-uub5z-bb85bd2526.json")
firebase_admin.initialize_app(cred)

db = firestore.client()

docs = db.collection(u'files').stream()

rs={}
for doc in docs:
  c = doc.to_dict()['count']
  n = doc.to_dict()['name']
  rs[n] = c

print(rs)

db.collection(u'counts').document(u'counts').set(rs)


