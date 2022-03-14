from bs4 import BeautifulSoup
from bs4.element import Comment
import requests
from flask_restful import Resource, reqparse

THRESHOLD = 20

class Search(Resource):
    
    def getText(self, ch):
        result = ""
        for child in ch:
            try:
                res = child.content[0] if typeof(child.content[0]) == 'string' else ""
                if len(res) >= THRESHOLD: result += res
            except: continue
        return result
    
    def processText(self, soup, tag):
        pList = soup.find_all(tag)
        res = ""
        if pList:
            for pElement in pList:
                res += pElement.contents[0]
                if pElement.find_all(tag):
                    children = pElement.find_all(tag)
                    return (res if len(res) >= THRESHOLD else "") + self.getText(children)
                return res if len(res) >= THRESHOLD else ""
        return ""
    
    def getText(self, soup):
        res = ""
        tags = ['p', 'h1', 'h2', 'h3', 'h4', 'h5']
        for tag in tags:
            text = self.processText(soup, tag)
            if text != "":
                res += f"\t{tag}: {text}\n\n"
        
        return res
    

    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('url', type=str)
        args = parser.parse_args()
        fullUrl = args['url']
        url = 'https://' + ('' if 'www.' in fullUrl else 'www.') +\
            fullUrl.split('//')[len(fullUrl.split('//')) - 1]
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
        
        #! Text parser
        pageText = self.getText(soup)
        
        finalResult = {
            "url": url,
            "images": imageCounter,
            "paragraphs": leafCounter,
            "src" : imageSrc, 
            "text": pageText,
        }
        data = finalResult
        return data

    