# Scrapes and Displays Monash unit information

unit = "fit1049"

from selenium import webdriver
from bs4 import BeautifulSoup as bs
from textwrap3 import wrap
import re
driver = webdriver.PhantomJS()
driver.get(
    f"https://monash.edu/pubs/2017handbooks/units/{unit.upper()}.html"
  )
soup = bs(driver.page_source, "html.parser")
unitFullname = soup.find("h1", class_="banner_it").text
dirtyinfo = soup.find("div", id="content_container_").text
dirtyinfo = str(dirtyinfo.replace("\n", "***").replace("\t", "==="))
info = re.findall(re.compile("(Synopsis.*)Chief examiner", re.M), dirtyinfo)[0]
cleaninfo = info.replace("***", "\n").replace("===", "\t")
nprint(unitFullname)
nprint(cleaninfo)