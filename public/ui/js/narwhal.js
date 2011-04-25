var last_tagline = 0,
	update_freq = 5000,
	tag_lines =  [
		"Om nom nom",  
		"Crunchy",
		"Tastes like chicken",
		"Narwhal approved",
		"I'll be back",
		"Wooooooooo",
		"Get your music on!",
		"Soylent Green is people!",
		"Don't give me that look",
		"Bond. James Bond",
		"Gulp",
		"Buuuuuurp",
		"Say hello to my little friend!",
		"Yummy",
		"MMMMMMMMMMMMMM",
		"Toto, I've a feeling we're not in Kansas anymore",
		"Better than chicken tacos",
		"Like ham on a biscuit",
		"Shaken, not stirred",
		"Yo dawg...",
		"You've just been erased!",
		"Hungry yet?",
		"You can't handle the truth!",
		"Taco Bell should be paying us for this",
		"I like turtles",
		"These beats are tasty",
		"May the Force be with you",
		"I like you, John",
		"99% of this site's development was creating witty messages",
		"Put that cookie down, NOW!",
		"You're hot stuff",
		">:3",
		"^:) <-- Narwhal",
		"You're awesome",
		"Awesomesause",
		"Open the pod bay doors, HAL",
		"Badger badger badger badger...",
		"Houston, we have a problem",
		"Mushroom mushroom!!!",
		"This is SPARTA!",
		"I'm gonna make him an offer he can't refuse",
		"90% Javascript. 10% Pepsi",
		"Probably in beta",
		"NO U!",
		"Hi Reddit",
		"Just like old times",
		"Now with more awesome",
		"You know you can do other things while listening?",
		"I should wash my car",
		"Noooooooooooooooo",
		"And my axe!",
		"FFFFFFFUUUUUUUUUUUU"
	];
	
function update_tagline(){	
	do {
		var rand_n = Math.floor(Math.random()*tag_lines.length);
	} while(last_tagline==rand_n);
	last_tagline = rand_n;
	var tag_line = tag_lines[rand_n];
	$('#tagline').fadeOut('',function(){$('#tagline').html(tag_line).fadeIn()});
}
var tagTime = setInterval("update_tagline()",update_freq);


/* 
	Rdio stuff
*/
var player;
var rdioListener = {
	ready: function() {
		player = document.getElementById("CTplayer");
		player.rdio_play(songs[0].key)
	}
};
var flashvars = {
	playbackToken: playbackToken,
	domain: 'http://'+document.location.host,
	listener: 'rdioListener'
};
var params = {
	'allowScriptAccess': 'always'
};
swfobject.embedSWF("http://www.rdio.com/api/swf/", "CTplayer", "1", "1", "9.0.0","", flashvars, params);
