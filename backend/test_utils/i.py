import json
import requests as R
import argparse

parser = argparse.ArgumentParser("simple_example")
parser.add_argument("N", help="0 for consultant, 1 for umkm", type=int)
args = parser.parse_args()

# self.token = ""
URL = "http://0.0.0.0:3030"
USERNAME = "U1"
EMAIL = "E1"
PHONE = "N1"
PASSWORD = "P1"
TYP = "C"
ADDRESS = "A1"
TITLE = "T1"
CATEGORY = "C1"
DESCRIPTION = "D1"
NOMINAL = 1
DURATION = 3600
FORUM_ID = 1
MESSAGE = "M1"
KONSULTASI_ID = 1
CONSULTANT = 1
CATEGORY = "V1"

if args.N == 1:
    USERNAME = "U2"
    EMAIL = "E2"
    PHONE = "N2"
    PASSWORD = "P2"
    TYP = "U"
    ADDRESS = "A2"
    TITLE = "T2"
    CATEGORY = "C2"
    DESCRIPTION = "D2"
    NOMINAL = 2
    DURATION = 3600
    FORUM_ID = 2
    MESSAGE = "M2"
    KONSULTASI_ID = 2
    CONSULTANT = 2
    CATEGORY = "V2"


class User:
    def __init__(
        self,
        username=USERNAME,
        email=EMAIL,
        phone=PHONE,
        password=PASSWORD,
        typ=TYP,
        address=ADDRESS,
        title=TITLE,
        category=CATEGORY,
        description=DESCRIPTION,
        nominal=NOMINAL,
        duration=DURATION,
        forum_id=FORUM_ID,
        message=MESSAGE,
        konsultasi_id=KONSULTASI_ID,
        consultant=CONSULTANT,
    ) -> None:
        self.username = username
        self.email = email
        self.phone = phone
        self.password = password
        self.typ = typ
        self.address = address
        self.title = title
        self.category = category
        self.description = description
        self.nominal = nominal
        self.duration = duration
        self.token = ""
        self.forum_id = forum_id
        self.message = message
        self.konsultasi_id = konsultasi_id
        self.consultant = consultant

    def register(self):
        return R.post(
            URL+"/register",
            headers={
                "Content-Type": "application/json",
            }.copy(),
            json={
                "username": self.username,
                "email":    self.email,
                "phone":    self.phone,
                "password": self.password,
                "typ":      self.typ,
                "address":  self.address
            }.copy()
        )

    def login(self):
        j = R.post(
            URL+"/login",
            headers={
                "Content-Type": "application/json",
            }.copy(),
            json={
                "email":    self.email,
                "password": self.password,
            }.copy()
        )
        if j.status_code == 200:
            self.token = json.loads(j.content).get('token', "")
        return j

    def delete(self,):
        return R.delete(
            URL+"/delete",
            headers={
                "Content-Type": "application/json",
                "Authorization": "Bearer "+self.token
            }.copy(),
        )

    def list_forums(self,):
        return R.get(URL+"/list_forums")

    def write_forums(self,):
        
        
        return R.post(
            URL+"/write_forum",
            json={
                "forum_id": self.forum_id,
                "message": self.message
            }.copy(),
            headers={
                "Content-Type": "application/json",
                "Authorization": "Bearer "+self.token
            }.copy(),
        )

    def load_forum(self,):
        return R.get(
            URL+f"/load_forum/{int(self.forum_id)}",
        )

    def list_konsultan(self,):
        return R.get(
            URL+"/list_konsultan",
        )

    def list_konsultasi(self,):
        return R.get(
            URL+"/list_konsultasi",
            headers={
                "Content-Type": "application/json",
                "Authorization": "Bearer "+self.token
            }.copy(),
        )

    def write_konsultasi(self,):
        return R.post(
            URL+"/write_konsultasi",
            json={
                "konsultasi_id": self.konsultasi_id,
                "message":      self.message
            }.copy(),
            headers={
                "Content-Type": "application/json",
                "Authorization": "Bearer "+self.token
            }.copy(),
        )

    def load_konsultasi(self,):
        return R.get(
            URL+f"/load_konsultasi/{int(self.konsultasi_id)}",
            headers={
                "Content-Type": "application/json",
                "Authorization": "Bearer "+self.token
            }.copy(),
        )

    def accept_consultationoffer(self,):
        return R.post(
            URL+"/accept_consultationoffer",
            headers={
                "Content-Type": "application/json",
                "Authorization": "Bearer "+self.token
            }.copy(),
            json={
                "consultant": self.consultant,
                "category": self.category
            }.copy()
        )

    def create_consultationoffer(self,):
        return R.post(
            URL+"/create_consultationoffer",
            headers={
                "Content-Type": "application/json",
                "Authorization": "Bearer "+self.token
            }.copy(),
            json={
                "description": self.description,
                "title":      self.title,
                "category":   self.category,
                "nominal":    self.nominal,
                "duration":   self.duration,
            }.copy()
        )

    def delete_consultationoffer(self,):
        return R.delete(
            URL+f"/delete_consultationoffer?category={self.category}",
            headers={
                "Content-Type": "application/json",
                "Authorization": "Bearer "+self.token
            }.copy(),
        )

u=User()
