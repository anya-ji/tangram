'''
Initialize the database with files.
Run in venv: source venv/bin/activate
'''
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
from os import listdir
from os.path import isfile, join
import datetime

cred = credentials.Certificate("./tangram-c997f-firebase-adminsdk-uub5z-bb85bd2526.json")
firebase_admin.initialize_app(cred)

db = firestore.client()

mypath = '../public/assets/'

files = [f for f in listdir(mypath) if isfile(join(mypath, f))]
# print(files)

# initial_files = {}
i=0

for f in files:
  # initial_files[f.strip('.svg')] = 0
  if f != 'check.py':
    db.collection(u'files').document(f).set({
      'name': f.strip('.svg'),
      'count': 0,
      'available': True,
      'lastClaimed': datetime.datetime.now(),
      # 'completedWorkers': []
    })
    print(i,":",f)
    i+=1
    if i>20:
      break