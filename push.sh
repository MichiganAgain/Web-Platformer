git add pom.xml push.sh resources/myDatabase2.db resources/website/Audio/* resources/website/CSS/* resources/website/Images/* resources/website/JS/* src/main/java/Controllers/* src/main/java/Server/*

if (($? == 0))
then
	echo 'added file(s)'
	git commit -m "$1"
	if (($? == 0))
	then
		echo 'commited file(s)'
		git push -u origin test_branch
		if (($? == 0))
		then
			echo 'pushed file(s)'
		else
			echo 'failed to push file(s)'
		fi
	else
		echo 'failed to commit'
	fi
else
	echo 'failed to add file(s)'
fi
