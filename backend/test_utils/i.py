import json
import requests as R
import argparse

parser = argparse.ArgumentParser("simple_example")
parser.add_argument("N", help="0 for consultant, 1 for umkm", type=int)
args = parser.parse_args()

# self.token = ""
URL = "http://127.0.0.1:3030"
USERNAME = "Konsultan_joko"
EMAIL = "joko@gmail.com"
PHONE = "08163781236"
PASSWORD = "jokoganteng"
TYP = "C"
ADDRESS = "rumah joko"
TITLE = "joko jago"
CATEGORY = "food-and-beverages"
DESCRIPTION = "saya jago jual minuman"
NOMINAL = 14000
DURATION = 3600
FORUM_ID = 1
MESSAGE = "ini pesan dari joko"
KONSULTASI_ID = 1
CONSULTANT = 1

if args.N == 1:
    USERNAME = "UMKM_lemonade"
    EMAIL = "lemonade@lemonade-business.com"
    PHONE = "99911112222"
    PASSWORD = "lemonade_sukses"
    TYP = "U"
    ADDRESS = "lemonade bandung"
    MESSAGE = "ini pesan dari lemonade"


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
    
    def list_consultationoffer(self,):
        return R.get(
            URL+f"/list_consultationoffer",
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
