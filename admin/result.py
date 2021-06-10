'''
Pull database results.
Run in venv: source venv/bin/activate
'''
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
from os import listdir
from os.path import isfile, join
import datetime
import matplotlib.pyplot as plt
import collections
from collections import defaultdict

cred = credentials.Certificate("./tangram-c997f-firebase-adminsdk-uub5z-bb85bd2526.json")
firebase_admin.initialize_app(cred)

db = firestore.client()

docs = db.collection(u'assignments').stream()

rs = {}
for doc in docs:
  d = doc.to_dict()
  if d['workerId'] == '5b9be1c7f533204ca1164ae9bc9e2283':
    rs[d['file']] = d['lastClaimed']


doc = db.collection(u'users').document('5b9be1c7f533204ca1164ae9bc9e2283').get()
d = doc.to_dict()
for k,v in d.items():
  if k+'.svg' in rs:
    print(k)
    print()
    rs[k+'.svg']= (v['timestamp']-rs[k+'.svg']).seconds

print(rs)

inv = defaultdict(int)
for k,v in rs.items():
  if v < 250:
    inv[v] += 1

plt.bar(*zip(*inv.items()))
plt.show()
