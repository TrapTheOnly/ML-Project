from bs4 import BeautifulSoup
import requests
from flask_restful import Resource, reqparse

class Search(Resource):
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('url', type=str)
        args = parser.parse_args()
        fullUrl = args['url']
        url = 'https://' + ('' if 'www' in fullUrl else 'www') +\
            fullUrl.split('//')[len(fullUrl.split('//')) - 1]
        content = requests.get(url).content
        soup = BeautifulSoup(content, "html.parser")
        soup.prettify()
        pList = soup.find_all("p")
        leafCounter = 0
        for pElement in pList:
            if not pElement.find_all("p"):
                leafCounter += 1
        imageCounter = len(soup.find_all("img"))
        images = soup.find_all("img", src=True)
        imageSrc = [f"{'' if '://' in image['src'] else url}{image['src']}" for image in images]
        finalResult = {
            "url": url,
            "images": imageCounter,
            "paragraphs": leafCounter,
            "src" : imageSrc, 
        }
        data = finalResult
        return data