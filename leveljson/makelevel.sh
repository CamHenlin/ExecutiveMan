#!/bin/bash

FILECOUNT=`find . -name "$1*.json" | wc -l`
rm -rf ../levels/$1level.js
touch ../levels/$1level.js

echo "building new level $1level.js with $((FILECOUNT)) screens."
echo "var $1HalfwayPoint = 0;" >> ../levels/$1level.js
echo "var $1BossPoint = 0;" >> ../levels/$1level.js
echo "var $1manmaps = [];" >> ../levels/$1level.js
echo "" >> ../levels/$1level.js

for i in `seq 1 $((FILECOUNT))`
do
	echo `echo $1maps[$((i - 1))] = ;cat $1$i.json; echo ";"` >> ../levels/$1level.js
done