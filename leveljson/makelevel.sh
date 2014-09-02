#!/bin/bash

FILECOUNT=`find . -name "$1*.json" | wc -l`
rm -rf ../levels/$1level.js
touch ../levels/$1level.js

echo "building new level $1level.js with $((FILECOUNT)) screens."
echo "var $1HalfwayPoint = $((FILECOUNT - 7));" >> ../levels/$1level.js
echo "var $1BossPoint = $((FILECOUNT - 2));" >> ../levels/$1level.js
echo "var $1maps = [];" >> ../levels/$1level.js
echo "" >> ../levels/$1level.js

for i in `seq 1 $((FILECOUNT))`
do
	echo `echo $1maps[$((i - 1))] = ;cat $1$i.json; echo ";"` >> ../levels/$1level.js
done