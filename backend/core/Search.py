from mimetypes import init
from msilib import add_data
import plistlib
from turtle import width
from bs4 import BeautifulSoup
from bs4.element import Comment
import requests, string, os
import sqlite3
from flask_restful import Resource, reqparse
from PIL import Image
from core import database
import re, html, cgi

class Search(Resource):

    def __init__(self, THRESHOLD="", fullUrl="", width="", height=""):

        self.THRESHOLD = THRESHOLD
        self.fullUrl = fullUrl
        self.height = height
        self.width = width
        
        

    def getText(self, ch):
        result = ""
        for child in ch:
            try:
                res = child.content[0] if type(child.content[0]) == 'string' else ""
                if len(res) >= self.THRESHOLD: result += res
            except: continue
        return result
    


    def processText(self, soup):
        pList = soup.find_all("p")
        res = ""
        if pList:
            for pElement in pList:
                # print (pElement.contents)
                # print('\n')
                tmp = ""
                for i in pElement.contents:
                    clean = re.compile('<.*?>')
                    tmp += re.sub(clean,'', str(i))
                res += tmp
                if pElement.find_all("p"):
                    children = pElement.find_all("p")
                    return (res if len(res) >= self.THRESHOLD else "") + self.getText(children)
                return res if len(res) >= self.THRESHOLD else ""
        return ""

    # def processText(self, soup, tag):
    #     pList = soup.find_all(tag)
    #     res = ""
    #     if pList:
    #         for pElement in pList:
    #             res += pElement.contents[0]
    #             if pElement.find_all(tag):
    #                 children = pElement.find_all(tag)
    #                 return (res if len(res) >= THRESHOLD else "") + self.getText(children)
    #             return res if len(res) >= THRESHOLD else ""
    #     return ""
    
    # def getText(self, soup):
    #     res = ""
    #     tags = ['p', 'h1', 'h2', 'h3', 'h4', 'h5']
    #     for tag in tags:
    #         text = self.processText(soup, tag)
    #         if text != "":
    #             res += f"\t{tag}: {text}\n\n"
    #     return res


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

            #print(img[img.rfind("/"):])
            if filename.endswith(('jpeg', 'jpg','img')):
                with open(filename, 'wb') as file:
                    src = requests.get(img)
                    file.write(image)
      

        for img in os.listdir(path):
            # print(path + "\\" + img)
            im = Image.open(path+ "\\" + img)
            im1 = im.resize((self.width,self.height))
            im1.save(path + "\\" + img)
            # print(im1.size)

        return ""


    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('url', type=str)
        parser.add_argument('threshold', type=int, default= 20)
        parser.add_argument('width', type=int, default= 120)
        parser.add_argument('height', type=int, default= 120)
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
        

        # ! Text parser
        text = self.processText(soup)
        pageText = text.translate(str.maketrans('','',string.punctuation))
        print(pageText)
       

        #add database
        database.addParagraphs([url,pageText])
        
        finalResult = {
            "url": url,
            "images": imageCounter,
            "paragraphs": leafCounter,
             "src" : imageSrc, 
             "text": pageText,
        }
        data = finalResult
        return data

    