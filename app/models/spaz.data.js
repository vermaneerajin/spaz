var Spaz; if (!Spaz) Spaz = {};

/*************
Spaz.Data
*************/
if (!Spaz.Data) Spaz.Data = {};

$.ajaxSetup(
	{
		timeout:1000*20, // 20 second timeout
		async:true,
		// type:'POST'
		// cache:false
	}
);



Spaz.Data.getBaseURL = function() {
	var base_url = Spaz.Prefs.get('twitter-api-base-url');
	if (!base_url) {
		base_url = 'https://twitter.com/';
	}
	return base_url;
}


Spaz.Data.getAPIURL = function(key) {

	var base_url = Spaz.Data.getBaseURL();

	var urls = {}

	// Timeline URLs
	urls.public_timeline	= "statuses/public_timeline.json";
	urls.friends_timeline	= "statuses/friends_timeline.json";
	urls.user_timeline		= "statuses/user_timeline.json";
	urls.replies_timeline	= "statuses/replies.json";
	urls.show				= "statuses/show.json";
	urls.favorites			= "favorites.json";
	urls.dm_timeline		= "direct_messages.json";
	urls.dm_sent			= "direct_messages/sent.json";
	urls.followerslist		= "statuses/friends.json";
	urls.followerslist		= "statuses/followers.json";
	urls.featuredlist		= "statuses/featured.json";

	// Action URLs
	urls.update				= "statuses/update.json";
	urls.destroy_status		= "statuses/destroy/{{ID}}.json";
	urls.follow				= "friendships/create/{{ID}}.json";
	urls.stop_follow		= "friendships/destroy/{{ID}}.json";
	urls.start_notifications= "notifications/follow/{{ID}}.json";
	urls.stop_notifications = "notifications/leave/{{ID}}.json";
	urls.favorites_create	= "favourings/create/{{ID}}.json";
	urls.favorites_destroy	= "favourings/destroy/{{ID}}.json";
	urls.verify_password	= "account/verify_credentials.json";
	urls.ratelimit_status	= "account/rate_limit_status.json";

	// misc
	urls.test				= "help/test.json";
	urls.downtime_schedule	= "help/downtime_schedule.json";

	if (urls[key]) {
		// sch.dump("URL:"+base_url + urls[key]);
		return base_url + urls[key];
	} else {
		return false
	}

};


Spaz.Data.url_pingfm_update	   = "http://api.ping.fm/v1/user.post";

// Ping.fm API key for Spaz
Spaz.Data.apikey_pingfm = '4f6e7a44cf584f15193e1f4c04704465';

/**
temp storage for a section's ajax queries
 */
Spaz.Data.$ajaxQueueStorage = [];

/**
Errors recorded during ajax queries
 */
Spaz.Data.$ajaxQueueErrors = [];

/**
counter for # of finished ajax queries in a section
 */
Spaz.Data.$ajaxQueueFinished = 0;




/**
 * Verifies the username and password in the prefs fields against the Twitter API
 * @returns void
 */
Spaz.Data.verifyCredentials = function() {

	var user = $('#username').val();
	var pass = $('#password').val();

	var twit = new SpazTwit(user, pass);
	twit.verifyCredentials();

	Spaz.UI.statusBar("Verifying username and password");
	Spaz.UI.showLoading();


}




/**
 * send a status update to Twitter
 * @param {String} msg the message to be posted
 * @param {String} username the username
 * @param {String} password the password
 * @returns void
 */
Spaz.Data.update = function(msg, username, password, irt_id) {
// 	var user = username;
// 	var pass = password;
// 
// 	sch.dump('user:'+user+' pass:********');
// 
// 	Spaz.UI.statusBar("Sending update");
// 	Spaz.UI.showLoading();
// 
// 	$('#entrybox').attr('disabled', true);
// 	$('#updateButton').attr('disabled', true);
// 	var oldButtonLabel = $('#updateButton').val();
// 	$('#updateButton').val('Sending...');
// 
// 	var update_data = "&source="+Spaz.Prefs.get('twitter-source')+"&status="+encodeURIComponent(msg);
// 	if (irt_id) {
// 		update_data = update_data+"&in_reply_to_status_id="+irt_id;
// 	}
// 
// 	var xhr = $.ajax({
// 		timeout:1000*40, // updates can take longer, so we double the standard timeout
// 		complete:Spaz.Data.onAjaxComplete,
// 		error:function(xhr, rstr){
// 			sch.dump("ERROR");
// 			$('#entrybox').attr('disabled', false);
// 			$('#updateButton').attr('disabled', false);
// 			$('#updateButton').val(oldButtonLabel);
// 
// 			if (xhr.readyState < 3) {
// 				sch.dump("Update ERROR: Server did not confirm update");
// 				Spaz.UI.statusBar("ERROR: Server did not confirm update")
// 				return;
// 			}
// 
// 			if (xhr.status != 200) { // sanity check
// 				sch.dump("ERROR: " + rstr);
// 				Spaz.UI.statusBar("ERROR: Server could not post update");
// 				Spaz.UI.flashStatusBar();
// 			} else {
// 
// 			}
// 		},
// 		success:function(data){
// 			sch.dump('SUCCESS:'+data);
// 			$('#entrybox').attr('disabled', false);
// 			$('#updateButton').attr('disabled', false);
// 			$('#entrybox').val('');
// 			sch.dump('Emptied #entrybox');
// 			$('#updateButton').val(oldButtonLabel);
// 			sch.dump('reset #updateButton label');
// 			if (msg.length == 140) {
// 				if (Spaz.Prefs.get('sound-enabled')) {
// 					if (Spaz.Prefs.get('wilhelm-enabled')) {
// 						Spaz.UI.doWilhelm();
// 						Spaz.UI.statusBar("Wilhelm!");
// 						Spaz.UI.playSoundWilhelm();
// 					} else {
// 						sch.dump('not doing Wilhelm because Wilhelm disabled');
// 					}
// 				} else {
// 					sch.dump('not doing Wilhelm because sound disabled');
// 				}
// 			} else {
// 				Spaz.UI.playSoundUpdate();
// 				Spaz.UI.statusBar("Update succeeded");
// 			}
// 			var entry = JSON.parse(data);
// 
// 			// We mark it as read in the db
// 			Spaz.DB.markEntryAsRead(entry.id);
// 
// 			// Prepend this to the timeline (don't scroll to top)
// 			Spaz.UI.addItemToTimeline(entry, Spaz.Section.friends, true, true);
// 
// 			/*
// 				cleanup, but suppress the notifications by passing "true" as 2nd param
// 				surpress scrollTo with 3rd param
// 				don't sort with 4th param
// 			*/
// 			Spaz.UI.cleanupTimeline(Spaz.Section.friends.timeline, true, true, true);
// 
// 			Spaz.UI.entryBox.reset();
// 			Spaz.UI.clearPostIRT();
// 			sch.dump('reset entryBox (Spry)');
// 			$('#entrybox')[0].blur();
// 			sch.dump('Blurred entryBox (DOM)');
// 
// 			if (Spaz.Prefs.get('services-pingfm-enabled')) {
// 				Spaz.Data.updatePingFM(msg);
// 			}
// 
// 			//Spaz.loadUserTimelineData('tab-user');
// 		},
// 		beforeSend:function(xhr){
// 			xhr.setRequestHeader("Authorization", "Basic " + sc.helpers.Base64.encode(user + ":" + pass));
// 			// cookies just get in the way.	 eliminate them
// 			xhr.setRequestHeader("Cookie", '');
// 			// have to kill referer header to post
// 		},
// 		processData:false,
// 		type:"POST",
// 		url:Spaz.Data.getAPIURL('update'),
// 		data:update_data,
// //		data:"&status="+encodeURIComponent(msg),
// 	});
// 
// 	// sch.dump(xhr);
}




/**
 * Deletes the given status
 * @param {Number} postid the id of the post to delete
 * @returns void
 */
Spaz.Data.destroyStatus = function(postid) {
	var user = Spaz.Prefs.getUser();
	var pass = Spaz.Prefs.getPass();

	Spaz.UI.showLoading();

	var xhr = $.ajax({
		complete:Spaz.Data.onAjaxComplete,
		error:Spaz.Data.onAjaxError,
		success:function(data){
			sch.dump(data);
			Spaz.UI.statusBar("Status deleted");
			//Spaz.Data.loadUserTimelineData('tab-user');
		},
		beforeSend:function(xhr){
			xhr.setRequestHeader("Authorization", "Basic " + sc.helpers.Base64.encode(user + ":" + pass));
			// cookies just get in the way.	 eliminate them
			xhr.setRequestHeader("Cookie", "");
			xhr.setRequestHeader("If-Modified-Since", 'Sun, 1 Jan 2007 18:54:41 GMT');
		},
		processData:false,
		type:"POST",
		data:'&id='+postid,
		url:Spaz.Data.getAPIURL('destroy_status').replace(/{{ID}}/, postid),
	});

	// sch.dump(xhr);
}



/**
 * Marks the given post as a "favorite" of the current user
 * @param {Number} postid the id of the post to favorite
 * @returns void
 */
Spaz.Data.makeFavorite = function(postid) {
	var user = Spaz.Prefs.getUser();
	var pass = Spaz.Prefs.getPass();

	Spaz.UI.statusBar('Adding fav: ' + postid);
	Spaz.UI.showLoading();

	var xhr = $.ajax({
		complete:Spaz.Data.onAjaxComplete,
		error:Spaz.Data.onAjaxError,
		success:function(data){
			var faved_element;
			sch.error(data);
			Spaz.UI.statusBar('Added fav: ' + postid);
			
			$('.timeline-entry[data-status-id='+postid+']').addClass('favorited');
			sch.error(faved_element);
			//Spaz.Data.loadUserTimelineData('tab-user');
		},
		beforeSend:function(xhr){
			xhr.setRequestHeader("Authorization", "Basic " + sc.helpers.Base64.encode(user + ":" + pass));
			// cookies just get in the way.	 eliminate them
			xhr.setRequestHeader("Cookie", "");
			xhr.setRequestHeader("If-Modified-Since", 'Sun, 1 Jan 2007 18:54:41 GMT');
		},
		processData:false,
		type:"POST",
		data:'&id='+postid,
		url:Spaz.Data.getAPIURL('favorites_create').replace(/{{ID}}/, postid),
	});
};



/**
 * Un-marks the given post as a "favorite" of the current user
 * @param {Number} postid the id of the post to un-favorite
 * @returns void
 */
Spaz.Data.makeNotFavorite = function(postid) {
	var user = Spaz.Prefs.getUser();
	var pass = Spaz.Prefs.getPass();

	Spaz.UI.statusBar('Removing fav: ' + postid);
	Spaz.UI.showLoading();

	var xhr = $.ajax({
		complete:Spaz.Data.onAjaxComplete,
		error:Spaz.Data.onAjaxError,
		success:function(data){
			var faved_element;
			sch.dump(data);
			Spaz.UI.statusBar('Removed fav: ' + postid);
			$('.timeline-entry[data-status-id='+postid+']').removeClass('favorited');
			//Spaz.Data.loadUserTimelineData('tab-user');
		},
		beforeSend:function(xhr){
			xhr.setRequestHeader("Authorization", "Basic " + sc.helpers.Base64.encode(user + ":" + pass));
			// cookies just get in the way.	 eliminate them
			xhr.setRequestHeader("Cookie", "");
			xhr.setRequestHeader("If-Modified-Since", 'Sun, 1 Jan 2007 18:54:41 GMT');
		},
		processData:false,
		type:"POST",
		data:'&id='+postid,
		url:Spaz.Data.getAPIURL('favorites_destroy').replace(/{{ID}}/, postid),
	});
};



/**
 * Follows the passed userid
 * @param {String} userid the userid to follow
 * @returns void
 */
Spaz.Data.followUser = function(userid) {
	var user = Spaz.Prefs.getUser();
	var pass = Spaz.Prefs.getPass();

	sch.dump('user:'+user+' pass:********');

	Spaz.UI.statusBar('Start following: ' + userid)
	Spaz.UI.showLoading();

	var xhr = $.ajax({
		complete:Spaz.Data.onAjaxComplete,
		error:Spaz.Data.onAjaxError,
		success:function(data){
			sch.dump(data);
			Spaz.UI.setSelectedTab(document.getElementById(Spaz.Section.friends.tab));
			Spaz.UI.reloadCurrentTab();
			Spaz.UI.statusBar("Now following " + userid);
		},
		beforeSend:function(xhr){
			xhr.setRequestHeader("Authorization", "Basic " + sc.helpers.Base64.encode(user + ":" + pass));
			// cookies just get in the way.	 eliminate them
			xhr.setRequestHeader("Cookie", "");
			xhr.setRequestHeader("If-Modified-Since", 'Sun, 1 Jan 2007 18:54:41 GMT');
		},
		processData:false,
		type:"POST",
		data:'&id='+userid,
		url:Spaz.Data.getAPIURL('follow').replace(/{{ID}}/, userid),
	});

	// sch.dump(xhr);
};


/**
 * Stop following the passed userid
 * @param {String} userid the userid to stop following
 * @returns void
 */
Spaz.Data.stopFollowingUser = function(userid) {

	var user = Spaz.Prefs.getUser();
	var pass = Spaz.Prefs.getPass();

	sch.dump('user:'+user+' pass:********');

	Spaz.UI.statusBar('Stop following: ' + userid)
	Spaz.UI.showLoading();

	var xhr = $.ajax({
		complete:Spaz.Data.onAjaxComplete,
		error:Spaz.Data.onAjaxError,
		success:function(data){
			sch.dump(data);
			Spaz.UI.setSelectedTab(document.getElementById(Spaz.Section.friends.tab));
			Spaz.UI.reloadCurrentTab();
			Spaz.UI.statusBar("No longer following " + userid);
		},
		beforeSend:function(xhr){
			xhr.setRequestHeader("Authorization", "Basic " + sc.helpers.Base64.encode(user + ":" + pass));
			// cookies just get in the way.	 eliminate them
			xhr.setRequestHeader("Cookie", "");
			xhr.setRequestHeader("If-Modified-Since", 'Sun, 1 Jan 2007 18:54:41 GMT');
		},
		processData:false,
		type:"POST",
		data:'&id='+userid,
		url:Spaz.Data.getAPIURL('stop_follow').replace(/{{ID}}/, userid),
	});

	// sch.dump(xhr);
};


/**
 * Called by most of the Twitter ajax methods when complete
 * @param {Object} xhr the xhr object
 * @param {rstr} xhr a "response" string that indicates if the request was successful or not
 * @returns void
 */
Spaz.Data.onAjaxComplete = function(xhr, rstr) {
	Spaz.UI.hideLoading();
	if (xhr.readyState < 3) {
		sch.dump("ERROR: Server did not respond");
		Spaz.UI.statusBar("ERROR: Server did not respond")
		return;
	}
	sch.dump("HEADERS:\n"+xhr.getAllResponseHeaders());
	sch.dump("DATA:\n"+xhr.responseText);
	sch.dump("COMPLETE: " + rstr);
};


/**
 * Called by most of the Twitter ajax methods on error
 * @param {Object} xhr the xhr object
 * @param {rstr} xhr a "response" string that indicates if the request was successful or not
 * @returns void
 */
Spaz.Data.onAjaxError = function(xhr,rstr) {
	sch.dump("ERROR: " + rstr);
	if (xhr.readyState < 3) {
		sch.dump("ERROR: Server did not respond.");
	}
	if (xhr.responseText) {
		try {
			var errorInfo = JSON.parse(xhr.responseText)
			if (errorInfo.error) {
				Spaz.UI.statusBar('ERROR: "' + errorInfo.error+'"');
			} else {
				Spaz.UI.statusBar('ERROR: Server returned invalid data');
			}
		} catch(e) {
			sch.dump('Error parsing for JSON in error response');
			Spaz.UI.statusBar('ERROR: Server returned invalid data');
		}
	}
	// Spaz.UI.statusBar('Error : ' + xhr.responseText);
	Spaz.UI.flashStatusBar();
};



// /**
//  * Starts the process of data retrieval for a section
//  * @param {object} section the Spaz.Section object
//  * @param {boolean} force if true, forces a reload of the section even if mincachetime has not passed
//  * @returns void
//  */
// Spaz.Data.getDataForTimeline = function(section, force) {
// 
// 	var username = Spaz.Prefs.getUser();
// 	if (!username || username == 'null' || username == 'undefined' || username == 'false') {
// 		
// 		$('#timeline-friends').html("<div id='not-logged-in'><div>Username and password not set.</div><input type='button' id='open-login-panel' value='Enter user/pass' /> </div>");
// 		
// 		$('#open-login-panel').one('click', function() {
// 			$('#not-logged-in').remove();
// 			Spaz.UI.showPrefs();
// 			setTimeout(Spaz.UI.openLoginPanel, 500);
// 		});
// 		
// 		sch.dump('hiding loading');
// 		Spaz.UI.hideLoading();
// 		return;
// 	} else {
// 		$('#not-logged-in').remove();
// 	}
// 
// 	sch.dump('now:'+sch.getTimeAsInt());
// 	sch.dump('then:'+section.lastcheck);
// 	sch.dump('difference:'+(sch.getTimeAsInt() - section.lastcheck));
// 	sch.dump('section.mincachetime:'+section.mincachetime);
// 
// 	if (force || (sch.getTimeAsInt() - section.lastcheck) > section.mincachetime ) {
// 		section.lastcheck = sch.getTimeAsInt();
// 
// 		for (var i = 0; i < section.urls.length; i++) {
// 			// alert('section.urls['+i+']: '+ section.urls[i])
// 			Spaz.Data.getDataForUrl(section.urls[i], section);
// 			// data = data.concat(thisdata);
// 		}
// 	} else {
// 		sch.dump('Not loading data - section.mincachetime has not expired');
// 	}
// 
// }
// 




// Spaz.Data.onSectionAjaxComplete = function(section, thisurl, xhr, msg) {
// 
// 	Spaz.Data.$ajaxQueueFinished++;
// 
// 	if (xhr.readyState < 3) { // XHR is not yet ready. don't try to access response headers
// 		sch.dump("Error:Timeout on "+thisurl);
// 	} else {
// 		sch.dump("HEADERS:\n"+xhr.getAllResponseHeaders());
// 		sch.dump("STATUS:\n"+xhr.status);
// 		sch.dump("DATA:\n"+xhr.responseText);
// 		sch.dump("COMPLETE: " + msg);
// 
// 		if (xhr.status == 400) {
// 			sch.dump("ERROR: 400 error - Exceeded request limit. Response from Twitter:\n"+xhr.responseText);
// 		}
// 
// 		else if (xhr.status == 401) {
// 			sch.dump("ERROR: 401 error - Not Authenticated. Check your username and password.	Response from Twitter:\n"+xhr.responseText);
// 			Spaz.Data.$ajaxQueueErrors.push("Not Authenticated. Check your username and password.");
// 		}
// 
// 		else if (xhr.responseText.length < 0) {
// 			sch.dump("Error:response empty from "+thisurl);
// 			Spaz.Data.$ajaxQueueErrors.push("Empty response from server for "+thisurl)
// 		}
// 
// 		try {
// 			var data = sch.deJSON(xhr.responseText);
// 			sch.dump(typeof(data))
// 
// 			if (!data) {
// 				sch.dump("Error: no data returned from "+thisurl);
// 			} else {
// 				/* This is a little hack for summize data */
// 				if (data.results) {
// 					data = data.results;
// 				}
// 				if (data.error) {
// 					sch.dump("ERROR: "+data.error+" ["+data.request+"]");
// 					Spaz.Data.$ajaxQueueErrors.push("Twitter says: \""+data.error+"\"");
// 				} else {
// 					Spaz.Data.$ajaxQueueStorage = Spaz.Data.$ajaxQueueStorage.concat(data);
// 				}
// 			}
// 		} catch(e) {
// 			sch.dump("An exception occurred when eval'ing the returned data. Error name: " + e.name + ". Error message: " + e.message);
// 		}
// 
// 		sch.dump('Spaz.Data.$ajaxQueueFinished:'+Spaz.Data.$ajaxQueueFinished);
// 		sch.dump('section.urls.length:'+section.urls.length);
// 		sch.dump('Spaz.Data.$ajaxQueueStorage.length:'+Spaz.Data.$ajaxQueueStorage.length);
// 		sch.dump('Spaz.Data.$ajaxQueueErrors.length:'+Spaz.Data.$ajaxQueueErrors.length);
// 
// 	}
// 
// 	if (Spaz.Data.$ajaxQueueFinished >= section.urls.length) {
// 		Spaz.Data.$ajaxQueueFinished = 0;
// 		Spaz.UI.statusBar('Adding '+Spaz.Data.$ajaxQueueStorage.length+' entries');
// 
// 		if (Spaz.Data.$ajaxQueueStorage.length > 0) {
// 			time.start('addingItems');
// 			for (var i in Spaz.Data.$ajaxQueueStorage) {
// 				// sch.dump('URL:'+thisurl);
// 				// sch.dump('section URLs:'+section.urls);
// 				/*
// 					Check the origin URL to see if this is a follower or someone the
// 					user is following
// 				*/
// 				if (thisurl == Spaz.Data.getAPIURL('followerslist')) {
// 					Spaz.Data.$ajaxQueueStorage[i].is_following = true;
// 				} else if (thisurl == Spaz.Data.getAPIURL('followerslist')) {
// 					Spaz.Data.$ajaxQueueStorage[i].is_follower = true;
// 				}
// 				
// 				section.addItem(Spaz.Data.$ajaxQueueStorage[i]);
// 			}
// 			time.stop('addingItems');
// 		}
// 
// 		sch.dump('onSectionAjaxComplete cleaning up timeline');
// 		section.cleanup();
// 
// 		sch.dump('hiding loading');
// 		Spaz.UI.hideLoading();
// 
// 		if (Spaz.Data.$ajaxQueueErrors.length > 0) {
// 			var errors = Spaz.Data.$ajaxQueueErrors.join("\n");
// 			Spaz.UI.alert(errors, "Error");
// 			sch.dump(errors);
// 			Spaz.Data.$ajaxQueueErrors = [];
// 		}
// 
// 		sch.dump('emptying storage');
// 		Spaz.Data.$ajaxQueueStorage = [];
// 	}
// }
// 












Spaz.Data.updatePingFM = function(msg) {
	// if (!Spaz.Prefs.get('services-pingfm-enabled')) {
	// 	return false;
	// }
	// 
	// // do not post dms
	// if ( msg.match(/^(?:d\s).*/i) ) {
	// 	sch.dump("Will not post dms to ping.fm");
	// 	return -1;
	// }
	// 
	// // only post replies if preference set
	// if ( msg.match(/^(?:@\S).*/i) && !Spaz.Prefs.get('services-pingfm-sendreplies') ) {
	// 	sch.dump("Will not post replies to ping.fm");
	// 	return -1;
	// }
	// 
	// var userappkey = Spaz.Prefs.get('services-pingfm-userappkey');
	// var posttype   = Spaz.Prefs.get('services-pingfm-updatetype');
	// 
	// Spaz.UI.statusBar("Sending update to Ping.fm");
	// Spaz.UI.showLoading();
	// 
	// var xhr = $.ajax({
	// 	timeout:1000*40, // updates can take longer, so we double the standard timeout
	// 	error:function(xhr, rstr){
	// 		sch.dump("ERROR");
	// 		if (xhr.readyState < 3) {
	// 			sch.dump("Update ERROR: Ping.fm did not confirm update. Who knows?");
	// 			Spaz.UI.statusBar("ERROR: Ping.fm did not confirm update. Who knows?");
	// 			Spaz.UI.hideLoading();
	// 			return;
	// 		}
	// 		if (xhr.status != 200) { // sanity check
	// 			sch.dump("ERROR: " + rstr);
	// 			Spaz.UI.statusBar("ERROR: Ping.fm could not post update");
	// 			Spaz.UI.flashStatusBar();
	// 			Spaz.UI.hideLoading();
	// 		} else {
	// 
	// 		}
	// 		
	// 	},
	// 	success:function(xml){
	// 		if ($(xml).find('rsp').attr('status') == 'OK') {
	// 			sch.dump('SUCCESS:'+xml);
	// 			Spaz.UI.statusBar("Ping.fm Update succeeded");
	// 			Spaz.UI.hideLoading();
	// 		} else {
	// 			sch.dump('FAIL:'+xml);
	// 			Spaz.UI.statusBar("Ping.fm Update failed");
	// 			Spaz.UI.hideLoading();
	// 		}
	// 	},
	// 	dataType:'xml',
	// 	type:"POST",
	// 	url:Spaz.Data.url_pingfm_update,
	// 	data: {
	// 		'api_key':Spaz.Data.apikey_pingfm,
	// 		'user_app_key':userappkey,
	// 		'post_method':posttype,
	// 		'body':msg
	// 	},
	// });


};



Spaz.Data.getRateLimitInfo = function(callback, cbdata) {
	var user = Spaz.Prefs.getUser();
	var pass = Spaz.Prefs.getPass();

	if (!user || !pass) {
		sch.dump('Dropping out of getRateLimitInfo because user or pass is not set');
		return false;
	}

	Spaz.UI.showLoading();
	Spaz.UI.statusBar('Asking Twitter for rate limit info…');

	var xhr = $.ajax({
		complete:Spaz.Data.onAjaxComplete,
		error:Spaz.Data.onAjaxError,
		success:function(data){
			sch.dump(data);

			json = JSON.parse(data);


			if (callback) {
				callback(json, cbdata);
			}
		},
		beforeSend:function(xhr){
			xhr.setRequestHeader("Authorization", "Basic " + sc.helpers.Base64.encode(user + ":" + pass));
			xhr.setRequestHeader("Cookie", "");
			xhr.setRequestHeader("If-Modified-Since", 'Sun, 1 Jan 2007 18:54:41 GMT');
		},
		processData:false,
		type:"GET",
		url:Spaz.Data.getAPIURL('ratelimit_status'),
	});
}




Spaz.Data.uploadFile = function(opts) {
	sch.dump(opts.url);

	var request = new air.URLRequest(opts.url);
	var loader = new air.URLLoader();

	var file = new air.File(opts.fileUrl); //use file.browseForOpen() on ur wish
	var stream = new air.FileStream();
	var buf = new air.ByteArray();

	stream.open(file, air.FileMode.READ);
	stream.readBytes(buf);
	
	var contentType = GetContentType(file.extension.toUpperCase());
	sch.dump(contentType);
	PrepareMultipartRequest(request, buf, contentType, 'media', file.nativePath, opts.extra);

	loader.addEventListener(air.Event.COMPLETE, opts.complete);
	// loader.addEventListener(air.ProgressEvent.PROGRESS, progressHandler);
	loader.addEventListener(air.Event.OPEN, opts.open);
	loader.load(request);

	function GetContentType(fileType){
		switch (fileType) {
			  case "JPG": return "image/jpeg";
			 case "JPEG": return "image/jpeg";
			  case "PNG": return "image/png";
 			  case "GIF": return "image/gif";
				 default: return "image/jpeg";
		}
	}

	/**
	 * Multipart File Upload Request Helper Function
	 *
	 * A function to help prepare URLRequest object for uploading.
	 * The script works without FileReference.upload().
	 *
	 * @author FreeWizard
	 *
	 * Function Parameters:
	 * void PrepareMultipartRequest(URLRequest request, ByteArray file_bytes,
	 *								string field_name = "file", string native_path = "C:\FILE",
	 *								object data_before = {}, object data_after = {});
	 *
	 * Sample JS Code:
	 * <script>
	 * var request = new air.URLRequest('http://example.com/upload.php');
	 * var loader = new air.URLLoader();
	 * var file = new air.File('C:\\TEST.TXT'); //use file.browseForOpen() on ur wish
	 * var stream = new air.FileStream();
	 * var buf = new air.ByteArray();
	 * var extra = {
	 *	   "id": "abcd"
	 *	   };
	 * stream.open(file, air.FileMode.READ);
	 * stream.readBytes(buf);
	 * MultipartRequest(request, buf, 'myfile', file.nativePath, extra);
	 * loader.load(request);
	 * </script>
	 *
	 * Sample PHP Code:
	 * <?php
	 * $id = $_POST['id'];
	 * move_uploaded_file($_FILES['myfile']['tmp_name'], '/opt/blahblah');
	 * ?>\
	 * @link http://rollingcode.org/blog/2007/11/file-upload-with-urlrequest-in-air.html
	 */
	function PrepareMultipartRequest(request, file_bytes, file_type, field_name, native_path, data_before, data_after) {
		var boundary = '---------------------------1076DEAD1076DEAD1076DEAD';
		var header1 = '';
		var header2 = '\r\n';
		var header1_bytes = new air.ByteArray();
		var header2_bytes = new air.ByteArray();
		var body_bytes = new air.ByteArray();
		var n;
		if (!field_name) field_name = 'file';
		if (!file_type) file_type = 'application/octet-stream';
		if (!native_path) native_path = 'C:\FILE';
		if (!data_before) data_before = {};
		if (!data_after) data_after = {};
		for (n in data_before) {
			header1 += '--' + boundary + '\r\n'
					+ 'Content-Disposition: form-data; name="' + n + '"\r\n\r\n'
					+ data_before[n] + '\r\n';
		}
		header1 += '--' + boundary + '\r\n'
				+ 'Content-Disposition: form-data; name="' + field_name + '"; filename="' + native_path + '"\r\n'
				+ 'Content-Type: ' + file_type + '\r\n\r\n';
		for (n in data_after) {
			header2 += '--' + boundary + '\r\n'
					+ 'Content-Disposition: form-data; name="' + n + '"\r\n\r\n'
					+ data_after[n] + '\r\n';
		}
		header2 += '--' + boundary + '--';
		header1_bytes.writeMultiByte(header1, "ascii");
		header2_bytes.writeMultiByte(header2, "ascii");
		body_bytes.writeBytes(header1_bytes, 0, header1_bytes.length);
		body_bytes.writeBytes(file_bytes, 0, file_bytes.length);
		body_bytes.writeBytes(header2_bytes, 0, header2_bytes.length);
		request.method = air.URLRequestMethod.POST;
		request.contentType = 'multipart/form-data; boundary='+boundary;
		request.data = body_bytes;
	}
};
// return;




/**
 * loads data for a particular tab (tabs are usually connected to a single Spaz.Section)
 * @param {Object} tab the DOM Element of the tab
 * @param {Boolean} force if true, force a reload even if mincachetime of this tab's section has not expired
 * @param {Boolean} reset resets all lastid/mincachetime data on this section
 * @returns false
 * @type Boolean
 * @see Spaz.Timelines.getTimelineFromTab
 */

Spaz.Data.loadDataForTab = function(tab, force, reset) {

	if (!force) {
		force=false;
	}

	if (!reset) {
		reset=false;
	}

	switch (tab.id) {
		case 'tab-prefs':
			break;
		case 'tab-friends':
			Spaz.Timelines.friends.activate();
			break;
		case 'tab-public':
			Spaz.Timelines.public.activate();
			break;
		case 'tab-favorites':
			Spaz.Timelines.favorites.activate();
			break;
		case 'tab-userlists':
			Spaz.Timelines.userlists.activate();
			break;
		case 'tab-user':
			Spaz.Timelines.user.activate();
			break;
		case 'tab-search':
			$('#search-for')[0].focus();
			Spaz.Timelines.search.activate();
			break;
		case 'tab-followerslist':
			Spaz.Timelines.followers.activate();
			break;
		default:
			sch.error('Tab not implemented or something!');
			break;
	}
	return false
};



/**
 * @param {integer|string} user_id
 * @param {DOMElement} target_el
 * @param {function} [onSuccess] a callback function taking one argument (the user obj)
 */
Spaz.Data.getUser = function(user_id, target_el, onSuccess) {
	
	var userobj = null;
	var target_el = target_el || document;
	
	if (sch.isString(user_id)) {
		userobj = TwUserModel.getUser(user_id);
	} else {
		userobj = TwUserModel.getUserById(user_id);
	}
	
	if (userobj) {
		if (onSuccess) {
			onSuccess(userobj);
		}
		sch.trigger('get_user_succeeded', target_el, userobj);
	} else {
		var twit = new SpazTwit(null, null, {
			'event_target':target_el
		});

		sch.listen(target_el, 'get_user_succeeded', saveUserObject);
		twit.getUser(user_id);
	}
	
	
	function saveUserObject(e) {
		var userobj = sch.getEventData(e);
		if (onSuccess) {
			onSuccess(userobj);
		}
		TwUserModel.findOrCreate(userobj);
		sch.unlisten(target_el, 'get_user_succeeded', saveUserObject);
	}
};



/**
 * @param {integer|string} user_id
 * @param {DOMElement} target_el 
 * @param {function} [onSuccess] a callback function taking one argument (the status obj)
 */
Spaz.Data.getTweet = function(status_id, target_el, onSuccess) {
	
	var statusobj = null;
	var target_el = target_el || document;
	

	statusobj = TweetModel.getById(status_id);
	
	if (statusobj) {
		sch.error('loaded statusobj from model');
		if (onSuccess) {
			onSuccess(statusobj);
		}
		sch.trigger('get_one_status_succeeded', target_el, statusobj);
	} else {
		sch.error('retrieving '+status_id+' from Twitter');
		var twit = new SpazTwit(null, null, {
			'event_target':target_el
		});

		// sch.listen(target_el, 'get_one_status_succeeded', saveTweetObject);
		twit.getOne(status_id, saveTweetObject);
	}
	
	
	function saveTweetObject(data) {
		sch.error('saveTweetObject');
		sch.error(data);
		// var statusobj = sch.getEventData(e);
		if (onSuccess) {
			onSuccess(data);
		}
		TweetModel.saveTweet(data);
		// sch.unlisten(target_el, 'get_one_status_succeeded', saveTweetObject);
	}
};