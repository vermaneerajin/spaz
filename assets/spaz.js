var Spaz; if (!Spaz) Spaz = {};

Spaz.verified = false;

Spaz.sourceStr = "spaz";

/*
short vars for referring to particular tabs
*/
Spaz.PUBLIC_TL = 'public_timeline';
Spaz.FRIENDS_TL = 'friends_timeline';
Spaz.REPLIES_TL = 'replies_timeline';
Spaz.USER_TL = 'user_timeline';
Spaz.DM_TL = 'dm_timeline';
Spaz.ME_TL = 'user_timeline';
Spaz.FRIEND_LS = 'friend_list';
Spaz.FOLLOWER_LS = 'follower_list';


/*
Spaz
*/


Spaz.loadMainPage = function() {
	window.location.href='index.html';
};




Spaz.getUrlForTab = function(tab) {
	
}

Spaz.getPathForTab = function(tab) {
	
}

Spaz.getSubpathForTab = function(tab) {
	
}

Spaz.getRegionForTab = function(tab) {
	
}



Spaz.startReloadTimer = function() {
	var refreshInterval = Spaz.Prefs.getRefreshInterval();
	Spaz.dump('started timer with refresh of ' + refreshInterval + ' msecs');
	reloadID = window.setInterval(Spaz.UI.autoReloadCurrentTab, refreshInterval);
	return reloadID;
}


Spaz.stopReloadTimer = function() {
	if (reloadID) {
		window.clearInterval(reloadID);
		Spaz.dump('stopped timer');
	}
	
}

Spaz.restartReloadTimer = function() {
	Spaz.dump('trying to restart timer');
	Spaz.stopReloadTimer();
	Spaz.startReloadTimer();
}



Spaz.createUserDirs = function() {
	var appStore = air.File.applicationStorageDirectory;
	var userThemesDir = appStore.resolvePath("userthemes/");
	userThemesDir.createDirectory()
	
	var userPluginsDir = appStore.resolvePath("userplugins/");
	userPluginsDir.createDirectory()
	
	air.trace(userThemesDir.nativePath);
	air.trace(userPluginsDir.nativePath);
};



Spaz.initialize = function() {
	
	air.trace('root init begin');



	// create user themes and plugins dirs if necessary
	Spaz.createUserDirs();



	/**
	Keyboard shortcut definitions
	**/
	document.onkeydown = Spaz.Keyboard.keyboardHandler

	
	window.htmlLoader.manageCookies = false;
	window.htmlLoader.paintsDefaultBackground = false;
	window.htmlLoader.cacheResponse = false;
	window.htmlLoader.useCache = false;
	
	air.URLRequestDefaults.manageCookies = false;
	air.URLRequestDefaults.cacheResponse = false;
	air.URLRequestDefaults.useCache = false;
	
	// if (Spaz.Prefs.get('network-airhandlehttpauth')) {
	// 	air.trace('Turning ON HTTPAuth handling')
	// 	window.htmlLoader.authenticate = true;
	// } else {
	// 	air.trace('Turning OFF HTTPAuth handling')
	// 	window.htmlLoader.authenticate = false;
	// }
	
	
	// apply dropshadow to window
	air.trace('Applying Flash Filter Dropshadow');
	window.htmlLoader.filters = window.runtime.Array(
		new window.runtime.flash.filters.DropShadowFilter(3,90,0,.8,6,6)
	);
	new window.runtime.flash.filters.ColorMatrixFilter(([-1, 0, 0, 0, 255, 0, -1, 0, 0, 255, 0, 0, -1, 0, 255, 0, 0, 0, 1, 0]))
	
	

	
	
	
	//*************************
	// START ME UP
	//*************************







	/*************************** 
	 * Load prefs 
	 **************************/
	air.trace('init prefs');
	Spaz.Prefs.init();


	// ***************************************************************
	// Keyboard shortcut handling
	// ***************************************************************
	Spaz.Keyboard.setShortcuts();


	// insert theme CSS links
	Spaz.Themes.init();

	/*************************** 
	 * Apply prefs 
	 **************************/
	window.moveTo(Spaz.Prefs.get('window-x'), Spaz.Prefs.get('window-y'));
	window.resizeTo(Spaz.Prefs.get('window-width'), Spaz.Prefs.get('window-height'));
	
	
		 
	Spaz.dump('APPLYING PREFS==============================');
	$('#username').val(Spaz.Prefs.getUser());
	$('#password').val(Spaz.Prefs.getPass());
	

	// Markdown
	// if (Spaz.Prefs.get('usemarkdown')) {
	// 	Spaz.UI.markdownOn();
	// 	$('#markdown-enabled').attr('checked', 'checked');
	// } else {
	// 	Spaz.UI.markdownOff();
	// 	$('#markdown-enabled').attr('checked', '');
	// }

	// Minimize to Systray
	// if (Spaz.UI.minimizeToSystray) {
	// 	Spaz.UI.minimizeToSystrayOn();
	// 	$('#minimize-systray').attr('checked', 'checked');
	// } else {
	// 	Spaz.UI.minimizeToSystrayOff();
	// 	$('#minimize-systray').attr('checked', '');
	// }

	// Minimize on BG
	// if (Spaz.UI.minimizeOnBackground) {
	// 	Spaz.UI.minimizeOnBackgroundOn();
	// 	$('#minimize-background').attr('checked', 'checked');
	// } else {
	// 	Spaz.UI.minimizeOnBackgroundOff();
	// 	$('#minimize-background').attr('checked', '');
	// }

	// Restore on Activate
	// if (Spaz.UI.restoreOnActivate) {
	// 	Spaz.UI.restoreOnActivateOn();
	// 	$('#maximize-foreground').attr('checked', 'checked');
	// } else {
	// 	Spaz.UI.restoreOnActivateOff();
	// 	$('#maximize-foreground').attr('checked', '');
	// }

	// Show notification popups

	// Sounds
	// if (Spaz.Prefs.get('sounds-enabled')) {
	// 	Spaz.UI.soundOn();
	// 	$('#sound-enabled').attr('checked', 'checked');
	// } else {
	// 	Spaz.UI.soundOff();
	// 	$('#sound-enabled').attr('checked', '');
	// }


	//DONE: Check for Update
	air.trace("CHECKING FOR UPDATES IS TURNED OFF DURING PREFS REWRITE")
	
	if (Spaz.Prefs.get('checkupdate')) {
	//	Spaz.Update.setCheckUpdateState(true);
		// $('#checkupdate-enabled').attr('checked', 'checked');
		Spaz.dump('Starting check for update');
		// Spaz.Update.updater.checkForUpdate();
		Spaz.dump('Ending check for update');
	} else {
	//	Spaz.Update.setCheckUpdateState(false);
		// $('#checkupdate-enabled').attr('checked', '');
	}
	Spaz.dump('Prefs Apply: check for update')

	// if ($('html').attr('debug') == 'true') {
	// 	$('#debugging-enabled').attr('checked', 'checked');
	// }else{
	// 	$('#debugging-enabled').attr('checked', '');
	// }
	Spaz.dump('Prefs Apply: debugging');



	/************************
	 * Other stuff to do when document is ready
	 ***********************/



	Spaz.UI.playSoundStartup();
	Spaz.dump('Played startup sound');

	Spaz.Windows.makeWindowVisible();
	Spaz.dump('Made window visible');

	// $('#about-version').text("v"+Spaz.Info.getVersion());


	Spaz.UI.tabbedPanels = new Spry.Widget.TabbedPanels("tabs");


	Spaz.UI.entryBox = new Spry.Widget.ValidationTextarea("entrybox",
		{ maxChars:140,
		counterType:"chars_remaining",
		counterId:'chars-left',
		hint:entryBoxHint,
		useCharacterMasking:true }
	);

	Spaz.UI.prefsCPG = new Spry.Widget.CollapsiblePanelGroup("prefsCPG",
		{ contentIsOpen:false, duration:200 }
	);
	// var AccountPanel = Spaz.UI.prefsCPG.openPanel(0);

	// Make Draggables
	$('div.popupWindow').each(function(i){
		$('#'+this.id).draggable({
			handle: 	$('#'+this.id+' popupWindowBar')[0],
			containment:'#container',
			opacity: 	0.7,
		});
	});



	// make tweets selectable
	// $('div.timeline-entry').bind('click', function(event){
	// 	$('#'+event.target.id).toggleClass('ui-selected');
	// });	
	// $('#friends-timeline').selectable({
	// 	filter:'div.timeline-entry'
	// });


	$('.TabbedPanelsTab').each( function(i) {
		this.title = this.title + '<br />Shortcut: <strong>CMD or CTRL'+(parseInt(i)+1)+'</strong>';
	});
	Spaz.dump('Set shortcut info in tab titles');



	Spaz.dump('ended document.ready()');
	
	if(Spaz.Debug.enabled){
		// Spaz.Debug.insertDebugScripts();
	}

	window.nativeWindow.addEventListener(air.Event.CLOSING, Spaz.Prefs.windowClosingHandler); 
	window.nativeWindow.addEventListener(air.Event.ACTIVATE, Spaz.Windows.windowActiveHandler);



	Spaz.Update.updater = new Spaz.Update(Spaz.Info.getVersion(), Spaz.Update.descriptorURL, 'updateCheckWindow');



	/**
	 * Window manip funcs
	 */

	
	
	// ***************************************************************
	// Event delegation handling
	// ***************************************************************
	$('body').intercept('mouseover', {
			'.user-screen-name[title]':function() {
				Spaz.UI.showUserTooltip(this, $(this).attr('title'));
			},
			'.user-image[title]':function() {
				Spaz.UI.showUserTooltip(this, $(this).attr('title'));
			},
			'a[title]':function() {
				Spaz.UI.showTooltip(this, $(this).attr('title'), $(this).attr('href'));
				// air.trace(this.outerHTML);
			},

		})
		.intercept('mouseout', {
			'[title]':function() {
				Spaz.UI.hideTooltips();
			}
		})
		.intercept('click', {
			'a[href]':function() {
				var url = $(this).attr('href');
				openInBrowser(url);
				return false;
			},
			'.user-screen-name':function() {
				var url = 'http://twitter.com/'+$(this).attr('user-screen_name');
				openInBrowser(url);
			},
			'.user-image':function() {
				var url = 'http://twitter.com/'+$(this).attr('user-screen_name');
				openInBrowser(url);
			},
			'.status-action-fav':function() {
				Spaz.Data.makeFavorite($(this).attr('entry-id'))
			},
			'.status-action-dm':function() {
				Spaz.UI.prepDirectMessage($(this).attr('user-screen_name'));
			},
			'.status-action-reply':function() {
				Spaz.UI.prepReply($(this).attr('user-screen_name'));
			},
			'.status-action-del':function() {
				Spaz.Data.destroyStatus($(this).attr('entry-id'))
			},
			'.timeline-entry':function() {
				$('div.timeline-entry.ui-selected').removeClass('ui-selected').addClass('read');
				$(this).addClass('ui-selected');
			},
			'.timeline-entry *':function() { // this one needs to be last so the more specific ones above take precedence
				$('div.timeline-entry.ui-selected').removeClass('ui-selected').addClass('read');
				var entry = $(this).parents('.timeline-entry');
				entry.addClass('ui-selected');
			},
		})
	// end intercept


	
}


/*
makes relative time out of "Sun Jul 08 19:01:12 +0000 2007" type string
Borrowed from Mike Demers (slightly altered)
https://twitter.pbwiki.com/RelativeTimeScripts
*/
function get_relative_time(time_value) {
	var parsed_date = new Date;
	parsed_date.setTime(Date.parse(time_value));
	var now = new Date;
	var delta = parseInt( (now.getTime() - parsed_date.getTime()) / 1000);

	if(delta < 60) {
		return 'less than a minute ago';
	} else if(delta < 120) {
		return 'about a minute ago';
	} else if(delta < (45*60)) {
		return (parseInt(delta / 60)).toString() + ' minutes ago';
	} else if(delta < (90*60)) {
		return 'about an hour ago';
	} else if(delta < (24*60*60)) {
		if (parseInt(delta / 3600) == 1) {
			return 'about 2 hours ago';
		} else {
			return 'about ' + (parseInt(delta / 3600)).toString() + ' hours ago';
		}
	} else if(delta < (48*60*60)) {
		return '1 day ago';
	} else {
		return (parseInt(delta / 86400)).toString() + ' days ago';
	}
}


function httpTimeToInt(entryDate) {
	var parsedDate = new Date;
	parsedDate.setTime(Date.parse(entryDate));
	return parsedDate.getTime();
	// var now = new Date;
}


function getTimeAsInt() {
	var now = new Date;
	return now.getTime();
}


function openInBrowser(url) {
	Spaz.dump('opening '+url);
	var request = new air.URLRequest(url);
	try {            
	    air.navigateToURL(request);
	}
	catch (e) {
	    Spaz.dump(e.errorMsg)
	}
}



function createXMLFromString (string) {
  var xmlParser, xmlDocument;
  try {
    xmlParser = new DOMParser();
    xmlDocument = xmlParser.parseFromString(string, 'text/xml');
    return xmlDocument;
  }
  catch (e) {
    output("Can't create XML document.");
    return null;
  }
}



// Return a boolean value telling whether
// the first argument is a string. 
function isString() {
	if (typeof arguments[0] == 'string') return true;
	if (typeof arguments[0] == 'object') {
		var criterion = arguments[0].constructor.toString().match(/string/i);
		return (criterion != null);
	}
	return false;
}

// http://www.breakingpar.com/bkp/home.nsf/0/87256B280015193F87256C720080D723
function isArray(obj) {
   if (obj.constructor.toString().indexOf("Array") == -1)
      return false;
   else
      return true;
}