#-*- coding: utf-8 -*-
import requests
import urllib.request
from bs4 import BeautifulSoup

import pymysql.cursors
from json import dumps

def tokenize (itemp2,itemp3):
     itemp3=" ".join(itemp2)
     itemp2=itemp3.split('.')
     itemp3=" ".join(itemp2)
     itemp2=itemp3.split('/')
     itemp3=" ".join(itemp2)
     itemp2=itemp3.split('년')
     itemp3=" ".join(itemp2)
     itemp2=itemp3.split('월')
     itemp3=" ".join(itemp2)
     itemp2=itemp3.split('일')
     itemp3=" ".join(itemp2)
     itemp2=itemp3.split('~')
     itemp3=" ".join(itemp2)
     itemp2=itemp3.split('(')
     itemp3=" ".join(itemp2)
     itemp2=itemp3.split(')')
     itemp3=" ".join(itemp2)
     itemp2=itemp3.split('\r')
     itemp3=" ".join(itemp2)
     itemp2=itemp3.split('\t')
     itemp3=" ".join(itemp2)
     itemp2=itemp3.split('\n')
     itemp3=" ".join(itemp2)
     itemp2=itemp3.split(' ')
     
     
     return itemp2
#토큰함수 정의
     
d1={}
d2={}
d3={}
d4={}
count1=0
count2=0
count3=0
count4=0

for w in range(1,13):#12달에 대해 돌림 
    num=1

    while 1:
        try:
            req=urllib.request.Request('http://mcst.go.kr/web/s_culture/festival/festivalList.jsp?pMenuCD=&pCurrentPage='+'%d'%num+'&pSearchType=A.FESTIVAL_KORNM&pSearchWord=&pSeq=&pSeason='+'%d'%w+'&pSido=&pOrder=1')
        except requests.exceptions.ConnectionError:
            print ("An error occured...")
        
        
        data=urllib.request.urlopen(req).read()
        bs=BeautifulSoup(data,'html.parser')
        title=bs.find_all('h5',{"class":"tit01"})
        item=bs.find_all('ul',{"class":"item"})
        if len(title)==0 :
            break
        for m in title:
            d1[count1]=m.get_text()
            count1=count1+1
                 
        for m in item:
            itemp=m.get_text()
        
            for c in range(len(itemp)-3):
                if itemp[c]=='기':
                    if itemp[c+1]=='간' :
                        if itemp[c+3]==':':
                           itemp3=itemp[c+5:]
                           itemp2=itemp3.split('~')
                           itemp2=tokenize(itemp2,itemp3)#함수 호출
                           if len(itemp2[0])==0:
                                d2[count2]==''
                           else:
                                dcount=0
                                for i in itemp2:
                                    if dcount==6 :
                                        break
                                    if len(i)!=0:

                                        if dcount==0:
                                            d2[count2]=i
                                            dcount+=1
                                        else:
                                            if dcount<3:
                                                d2[count2]=d2[count2]+i
                                                dcount+=1
                                            else:
                                                if dcount==3 :
                                                    d3[count3]=i
                                                    dcount+=1
                                                else:
                                                    d3[count3]=d3[count3]+i
                                                    dcount+=1
                           count2=count2+1
                           count3=count3+1
                if itemp[c]=='장':
                    if itemp[c+1]=='소' :
                        if itemp[c+3]==':':
                            itemp2=itemp[c+5:].split()
                            if itemp2[1] != '문의':
                                d4[count4]=itemp2[0]+' '+itemp2[1]
                            else:
                                d4[count4]=itemp2[0]
                            count4=count4+1
        num+=1              

connection = pymysql.connect(host = 'localhost', user = 'root', password = 'qwe123', db='capestone2', charset='utf8')
try:
	with connection.cursor() as cursor:	
		for e in d1.keys():
			if d2[e].isdigit() == False:
				print("11",d2[e])
				continue
			if d2[e].find('2017') == -1:
				print("22",d2[e])
				continue
			if(len(d2[e]) != 8):
				year = d2[e][:4]
				month = d2[e][4:8]
				if month[:1] != '0' or month[:1] != 1:
					month = '0' + month
				if len(month) != 4:
					month = month[:2] + '0' + month[2:]
				d2[e] = year + month
				
			if year != '2017' or int(month[:2]) > 12 or int(month[2:]) > 31:
				print(33,year,month)
				continue
			if(len(d3[e]) != 8) or d3[e].find('2017') == -1:
				d3[e] = d2[e]
			
			sql = 'insert into festival(f_name, start_date, end_date, f_city) values(%s,%s,%s,%s);'
		
#			sql = 'insert into festival(f_name, start_date, end_date, f_city) values({0},{1},{2},{3});'.format(d1[e],d2[e],d3[e],d4[e])
			print(d1[e],d2[e],d3[e],d4[e])
			cursor.execute(sql, (d1[e],d2[e],d3[e],d4[e]))
	connection.commit()
	with connection.cursor() as cursor:
		sql = 'select * from festival;'
		cursor.execute(sql)
		result = cursor.fetchone()
	print(result)
finally:
	connection.close()

'''    
print(d1)
print("--------------------------------------------")
print(d2)
print("--------------------------------------------")
print(d3)
print("--------------------------------------------")
print(d4)
'''
