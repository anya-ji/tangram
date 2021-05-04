import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
from os import listdir
from os.path import isfile, join

cred = credentials.Certificate("./tangram-c997f-firebase-adminsdk-uub5z-bb85bd2526.json")
firebase_admin.initialize_app(cred)

db = firestore.client()

mypath = '../public/assets/'

files = [f for f in listdir(mypath) if isfile(join(mypath, f))]
# print(files)

initial_files = {}
for f in files:
  initial_files[f] = 0

doc_ref = db.collection(u'files').document(u'files')
doc_ref.set(initial_files)