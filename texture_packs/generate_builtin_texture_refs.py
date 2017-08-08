import os

def nonDirectory(f):
	if exclude(f):
		return True
	if os.path.splitext(filename)[1]:
		return True
	return False

def exclude(f):
	if f==".DS_Store":
		return True

	return False;

def trim(x):
	return x[0:11] + ('...' if len(x) > 11 else '');

for filename in os.listdir(os.getcwd()):
	if not nonDirectory(filename):
		print "\n--- " + filename + " ---"

		for texturename in os.listdir(os.path.join(os.getcwd(), filename)):
			if not exclude(texturename):
				noExtName = os.path.splitext(texturename)[0]
				noExtNameFriendly = trim(noExtName)

				#<div class="img-holder"><img src="/texture_packs/shapes/circle.png"><p>circle</p></div>
				print '<div class="img-holder"><img src="/texture_packs/' + filename + '/' + texturename + '"><p>' + noExtNameFriendly + '</p></div>'