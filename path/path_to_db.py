#-*- coding: utf8 -*-
import pymysql.cursors
from json import dumps
pathlist = list()
mylist = list()
data = open('dustmq.txt', 'r').readlines()
index = 0
j=0

path_dic = {}
def analysis(url):
	str2 = url.split("!3d")
	str3 = str2[1].split("!4d")

	dnleh = float(str3[0])
	rudeh = float(str3[1])

	return [dnleh, rudeh]
for datum in data:
	mylist.insert(0,datum)
	if(len(mylist) == 6):
		mydict = {}
		mylist.pop()
		mydict['지역'] = mylist.pop()
		mydict['길 이름'] = mylist.pop()
		start = analysis(mylist.pop())
		mydict['시작 위도'] = float(start[0])
		mydict['시작 경도'] = float(start[1])
		end = analysis(mylist.pop())
		mydict['끝 위도'] = float(end[0])
		mydict['끝 경도'] = float(end[1])
#print(mydict)
		pathlist.append(mydict)
		mylist = []

for e in pathlist:
	print(dumps(e,ensure_ascii=False))

connection = pymysql.connect(host = 'localhost', user = 'root', password='qwe123', db='capestone2',charset='utf8')

try:
	with connection.cursor() as cursor:
		for e in pathlist:
			sql = 'insert into path(p_city, p_name, start_Lat, start_Lng, end_Lat, end_Lng, good, bad) values(%s,%s,%s,%s,%s,%s,0,0);'
			cursor.execute(sql, (e['지역'],e['길 이름'],e['시작 위도'],e['시작 경도'],e['끝 위도'],e['끝 경도']))
	connection.commit()

	with connection.cursor() as cursor:
		sql = 'Select * from path'
		cursor.execute(sql)
	result = cursor.fetchone()
	print(result)
finally:
	connection.close()
