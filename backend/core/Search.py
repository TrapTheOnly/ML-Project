from ast import Str
from mimetypes import init
from msilib import add_data
from bs4 import BeautifulSoup
from bs4 import NavigableString, Comment
import requests, string, os
from flask_restful import Resource, reqparse
from PIL import Image
from core import database
import re 

class Search(Resource):
    def __init__(self, THRESHOLD="", fullUrl="", width="", height=""):
        self.THRESHOLD = THRESHOLD
        self.fullUrl = fullUrl
        self.height = height
        self.width = width

    def resizeImage(self, imageSrc):
        dir = "Images"
        parentdir = os.path.dirname(os.path.realpath(__file__))
        path = os.path.join(parentdir, dir)
        try:
            os.mkdir(path)
        except:
            pass
        for img in imageSrc:
            image = requests.get(img).content
            filename = path + img[img.rfind("/"):]
            if filename.endswith(('jpeg', 'jpg','img', 'png')):
                with open(filename, 'wb') as file:
                    file.write(image)
        for img in os.listdir(path):
            im = Image.open(path+ "\\" + img)
            im1 = im.resize((self.width,self.height))
            im1.save(path + "\\" + img)
        return ""

    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('url', type=str)
        parser.add_argument('threshold', type=int, default=20)
        parser.add_argument('width', type=int, default=120)
        parser.add_argument('height', type=int, default=120)
        args = parser.parse_args()
        self.THRESHOLD = args['threshold']
        self.fullUrl = args['url']
        self.width = args['width']
        self.height = args['height']

        url = 'https://' + ('' if 'www.' in
        self.fullUrl else 'www.') +\
            self.fullUrl.split('//')[len(self.fullUrl.split('//')) - 1]
        content = requests.get(url).content
        soup = BeautifulSoup(content, "html.parser")
        soup.prettify()
        

        #! Leafs count
        pList = soup.find_all("p")
        leafCounter = 0
        for pElement in pList:
            if not pElement.find_all("p"):
                leafCounter += 1
                

        #! Images count
        imageCounter = len(soup.find_all("img"))
        

        #! Images sources
        images = soup.find_all("img", src=True)
        imageSrc = [f"{'' if '://' in image['src'] else url}{image['src']}" for image in images]


        #! Download resized Image
        self.resizeImage(imageSrc)        
        

        #! Text parser
        texts = soup.get_text().split('\n')
        tmp = ""
        for text in texts:
            if(len(text) < self.THRESHOLD): continue
            tmp += re.sub('[^A-Za-z0-9 ]+', '', str(text))
        text = tmp

        #! Add to DB
        database.addParagraphs([url,text])
        
        
        #! Send response
        finalResult = {
            "url": url,
            "images": imageCounter,
            "paragraphs": leafCounter,
            "src" : imageSrc, 
            "text": text,
            "width": self.width,
            "height": self.height, 
            "threshold": self.THRESHOLD
        }
        data = finalResult
        return data