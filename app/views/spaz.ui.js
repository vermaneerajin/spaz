var Spaz;
if (!Spaz) Spaz = {};

/***********
Spaz.UI
***********/
if (!Spaz.UI) Spaz.UI = {};

// the currently selected tab (should be the element)
Spaz.UI.selectedTab = null;

// widgets
Spaz.UI.tabbedPanels = {};
Spaz.UI.entryBox = {};
Spaz.UI.prefsCPG = {};

// holder
Spaz.UI.tooltipHideTimeout = null;
// holder for the timeoutObject
Spaz.UI.tooltipShowTimeout = null;
// holder for the timeoutObject
// kind of a const
Spaz.UI.mainTimelineId = 'timeline-friends';


Spaz.UI.playSound = function(url, callback) {
    if (!Spaz.Prefs.get('sound-enabled')) {
        sch.error('Not playing sound ' + url + '- disabled');
        if (callback) {
            sch.error('calling callback manually');
            callback();
            sch.error('ending callback');
        } else {
            sch.error('no callback, returning');
        }
        return;
    }

    sch.error('Spaz.UI.playSound callback:' + callback);
    sch.error("loading " + url);

    var req = new air.URLRequest(url);
    var s = new air.Sound();

    function onComplete(e) {
        var sc = s.play();
        if (sc) {
            sch.error("playing " + url);
            if (callback) {
                sc.addEventListener(air.Event.SOUND_COMPLETE, callback);
            }
        }
    }

    function onIOError(e) {
        sch.error("failed to load " + url);
        if (callback) {
            sch.error('calling callback manually');
            callback();
            sch.error('ending callback');
        } else {
            sch.error('no callback, returning');
        }

    }

    s.addEventListener(air.Event.COMPLETE, onComplete);
    s.addEventListener(air.IOErrorEvent.IO_ERROR, onIOError);
    s.load(req);
}


Spaz.UI.onSoundPlaybackComplete = function(event) {
    sch.dump("The sound has finished playing.");
}


Spaz.UI.playSoundUpdate = function(callback) {
    Spaz.UI.playSound(Spaz.Prefs.get('sound-url-update'), callback);
}

Spaz.UI.playSoundStartup = function(callback) {
    Spaz.UI.playSound(Spaz.Prefs.get('sound-url-startup'), callback);
}

Spaz.UI.playSoundShutdown = function(callback) {
    Spaz.UI.playSound(Spaz.Prefs.get('sound-url-shutdown'), callback);
}

Spaz.UI.playSoundNew = function(callback) {
    Spaz.UI.playSound(Spaz.Prefs.get('sound-url-new'), callback);
}

Spaz.UI.playSoundWilhelm = function(callback) {
    Spaz.UI.playSound(Spaz.Prefs.get('sound-url-wilhelm'), callback);
}


Spaz.UI.doWilhelm = function() {
    sch.debug('Applying Flash Filter Dropshadow and Negative');

	if (Spaz.Prefs.get('window-dropshadow')) {
	    sch.dump('Applying Flash Filter Dropshadow');

	    window.htmlLoader.filters = window.runtime.Array(
	    	new window.runtime.flash.filters.DropShadowFilter(3, 90, 0, .8, 6, 6),
	    	new window.runtime.flash.filters.ColorMatrixFilter(([ - 1, 0, 0, 0, 255, 0, -1, 0, 0, 255, 0, 0, -1, 0, 255, 0, 0, 0, 1, 0]))
	    );
	} else {
		window.htmlLoader.filters = window.runtime.Array(
	    	new window.runtime.flash.filters.ColorMatrixFilter(([ - 1, 0, 0, 0, 255, 0, -1, 0, 0, 255, 0, 0, -1, 0, 255, 0, 0, 0, 1, 0]))
	    );

	}

    $('#wilhelm').center();
    $('#wilhelm').show(300);
	setTimeout(Spaz.UI.endWilhelm, 960); // end with a timeout instead of relying on sound to finish
};

Spaz.UI.endWilhelm = function() {
	if (Spaz.Prefs.get('window-dropshadow')) {
	    sch.dump('Applying Flash Filter Dropshadow');

	    window.htmlLoader.filters = window.runtime.Array(
	    	new window.runtime.flash.filters.DropShadowFilter(3, 90, 0, .8, 6, 6)
	    );
	}
    $('#wilhelm').hide();
};



Spaz.UI.statusBar = function(txt) {
    $('#statusbar-text').html(txt);
}

Spaz.UI.resetStatusBar = function() {
    $('#statusbar-text').html('Ready');
    Spaz.UI.hideLoading();
}

Spaz.UI.flashStatusBar = function() {
    for (var i = 0; i < 3; i++) {
        $('#statusbar').fadeOut(400);
        $('#statusbar').fadeIn(400);
    }
}

Spaz.UI.showLoading = function() {
    $('#status-text').html('Uploading image…');
    $('#loading').fadeIn(500);
}

Spaz.UI.hideLoading = function() {
    $('#loading').fadeOut(500);
}





Spaz.UI.showPopup = function(panelid) {
    sch.debug('showing ' + panelid + '...');
    $('#' + panelid).css('opacity', 0);
    $('#' + panelid).show();
    $('#' + panelid).fadeTo('fast', 1.0,
    function() {
        sch.debug(panelid + ':fadeIn:' + 'faded in!');
        sch.debug(panelid + ':display:' + $('#' + panelid).css('display'));
        sch.debug(panelid + ':opacity:' + $('#' + panelid).css('opacity'));
    });
    Spaz.UI.centerPopup(panelid);
};
Spaz.UI.hidePopup = function(panelid) {
    sch.debug('hiding ' + panelid + '...');
    $('#' + panelid).fadeTo('fast', 0,
    function() {
        sch.debug('fadeOut:' + 'faded out!');
        sch.debug('fadeOut:' + $('#' + panelid).css('display'));
        sch.debug('fadeOut:' + $('#' + panelid).css('opacity'));
        $('#' + panelid).hide();
    });
}


Spaz.UI.showUpdateCheck = function() {
    Spaz.UI.showPopup('updateCheckWindow');
}
Spaz.UI.hideUpdateCheck = function() {
    Spaz.UI.hidePopup('updateCheckWindow');
}


Spaz.UI.showAbout = function() {
    openPopboxInline('#aboutWindow');
}
Spaz.UI.showHelp = function() {
    openPopboxInline('#helpWindow');
}
Spaz.UI.showShortLink = function() {
    openPopboxInline('#shortLinkWindow');
}
Spaz.UI.uploadImage = function(imgurl) {
	openPopboxInline('#imageUploadWindow');
}
Spaz.UI.showCSSEdit = function() {
    this.instance = window.open('app:/html/css_edit.html', 'cssEditWin', 'height=350,width=400');
}




Spaz.UI.pageLeft = function(tabEl) {
    Spaz.UI.page(tabEl, -1);
}
Spaz.UI.pageRight = function(tabEl) {
    Spaz.UI.page(tabEl, 1);
}
Spaz.UI.page = function(tabEl, distance) {
    panel = tabEl.id.replace(/tab/, 'panel');
    sch.debug('Getting page number using \'#' + panel + ' .timeline-pager-number\'');
    var thispage = parseInt($('#' + panel + ' .timeline-pager-number').text());
    sch.debug("Current page:" + thispage);
    sch.debug("Paging distance:" + distance);
    var newpage = thispage + distance;
    sch.debug("New page:" + newpage);
    if (newpage < 1) {
        return;
    }
    Spaz.Data.loadDataForTab(tabEl, false, newpage);
};
Spaz.UI.setCurrentPage = function(tabEl, newpage) {
    panel = tabEl.id.replace(/tab/, 'panel');
    $('#' + panel + ' .timeline-pager-number').html(newpage);
};
Spaz.UI.showEntryboxTip = function() {
    Spaz.UI.statusBar('Logged in as <span class="statusbar-username">' + Spaz.Prefs.getUser() + '</span>. Type your message and press ENTER to send');
}

Spaz.UI.showLocationOnMap = function(location) {
    if (location.length > 0) {
        var url = 'http://maps.google.com/?q=' + encodeURIComponent(location);
        sch.debug("Loading " + url);
        sc.helpers.openInBrowser(url);
    }
};

// Spaz.UI.showPopup = function(contentid) {
//	if (!Spaz.UI.popupPanel) {
//		Spaz.UI.popupPanel = new Spry.Widget.HTMLPanel("mainContent");
//	}
//	Spaz.UI.popupPanel.setContent($('#'+contentid).html());
// }
// Spaz.UI.showWhatsNew = function() {
//	Spaz.UI.popupPanel.loadContent('whatsnew.html');
// }
// taken from ThickBox
// http://jquery.com/demo/thickbox/
Spaz.UI.centerPopup = function(windowid) {
    var jqWin = $('#' + windowid);
    var jqBody = $('#container');

    jqWin.css('margin', 0);

    // WIDTH
    var winWidth = jqWin.outerWidth();
    if (jqBody.width() > winWidth) {
        jqWin.css('left', (jqBody.width() - winWidth) / 2);
    } else {
        // jqWin.width()(jqBody.width() - 20);
        // jqWin.width() = jqWin.width()();
        jqWin.css('left', 0);
    }

    // HEIGHT
    var winHeight = jqWin.outerHeight();
    if (jqBody.height() > winHeight) {
        jqWin.css('top', (jqBody.height() - winHeight) / 2);
    } else {
        // jqWin.width()(jqBody.width() - 20);
        // jqWin.width() = jqWin.width()();
        jqWin.css('top', 0);
    }
    // jqBody.css('border', '1px solid red');
    // jqWin.css('border', '1px solid blue');
    sch.debug("windowid:#" + windowid);
    sch.debug("jqBody.height():" + jqBody.height());
    sch.debug("jqBody.width() :" + jqBody.width());
    sch.debug("jqWin.height() :" + winHeight);
    sch.debug("jqWin.width()  :" + winWidth);
    sch.debug("margin	 :" + jqWin.css('margin'));
    sch.debug("top		 :" + jqWin.css('top'));
    sch.debug("left		 :" + jqWin.css('left'));

}




Spaz.UI.prepMessage = function() {
	//     var eb = $('#entrybox');
	//     eb.val('');
	//     eb[0].setSelectionRange(0, 0);
	// 
	// Spaz.UI.clearPostIRT();
};

Spaz.UI.prepRetweet = function(entryid) {
	// var timelineid = Spaz.UI.selectedTab.id.replace(/tab-/, 'timeline-');
	// // sch.dump(timelineid);
	// // sch.dump('#'+timelineid+'-'+entryid);
	// var entry = $('#'+timelineid+'-'+entryid);
	// // sch.dump(entry.html());
	// var text = entry.children('.entry-text').text();
	// var screenname = entry.children('.entry-user-screenname').text();
	// 
	// var rtstr = 'RT @' + screenname + ': '+text+'';
	// 
	// if (rtstr.length > 140) {
	// 	rtstr = rtstr.substr(0,139)+'…"';
	// }
	// 
	//     var eb = $('#entrybox');
	// eb.focus();
	// eb.val(rtstr);
	// eb[0].setSelectionRange(eb.val().length, eb.val().length);
	// 
	// Spaz.UI.clearPostIRT();

};

Spaz.UI.prepDirectMessage = function(username) {
	//     var eb = $('#entrybox');
	//     eb.focus();
	//     if (username) {
	//         eb.val('d ' + username + ' ...');
	//         eb[0].setSelectionRange(eb.val().length - 3, eb.val().length)
	//     } else {
	//         eb.val('d username');
	//         eb[0].setSelectionRange(2, eb.val().length)
	//     }
	// Spaz.UI.clearPostIRT();
};

Spaz.UI.prepPhotoPost = function(url) {
	//     var eb = $('#entrybox');
	//     eb.focus();
	//     if (url) {
	//         eb.val(url + ' desc');
	//         eb[0].setSelectionRange(eb.val().length - 4, eb.val().length);
	//         return true;
	//     } else {
	//         return false;
	//     }
	// 
	// Spaz.UI.clearPostIRT();

}

Spaz.UI.prepReply = function(username, irt_id) {
	//     var eb = $('#entrybox');
	//     eb.focus();
	// 
	// if (irt_id) {
	// 	var timelineid = Spaz.UI.selectedTab.id.replace(/tab-/, 'timeline-');
	// 	var entry = $('#'+timelineid+'-'+irt_id);
	// 	var text = entry.children('.entry-text').text();
	// 	Spaz.UI.setPostIRT(irt_id, text);
	// }
	// 
	//     if (username) {
	//         var newText = '@' + username + ' ';
	// 
	//         if (eb.val() != '') {
	//             eb.val(newText + eb.val());
	//             eb[0].setSelectionRange(eb.val().length, eb.val().length);
	//         } else {
	//             eb.val('@' + username + ' ...');
	//             eb[0].setSelectionRange(eb.val().length - 3, eb.val().length);
	//         }
	//     } else {
	//         var newText = '@';
	//         if (eb.val() != '') {
	//             eb.val(newText + ' ' + eb.val());
	//         } else {
	//             eb.val('@');
	//         }
	//         eb[0].setSelectionRange(newText.length, newText.length);
	//     }
};



/**
 *
 */
Spaz.UI.setPostIRT = function(status_id, raw_text) {
	// if (raw_text) {
	// 	var status_text = raw_text;
	// 	if (status_text.length > 30) {
	// 		status_text = status_text.substr(0,29)+'…'
	// 	}
	// } else {
	// 	var status_text = 'status #'+status_id;
	// }
	// 
	// // update the GUI stuff
	// $('#irt-message')
	// 	.html(status_text)
	// 	.attr('data-status-id', status_id);
	// $('#irt').fadeIn('fast');
};


/**
 *
 */
Spaz.UI.clearPostIRT = function() {
	// $('#irt').fadeOut('fast');
	// $('#irt-message').html('').attr('data-status-id', '0');
};



/* sends a twitter status update for the current user */
Spaz.UI.sendUpdate = function() {
		//     var entrybox = $('#entrybox');
		// 
		//     if (entrybox.val() != '' && entrybox.val() != Spaz.Prefs.get('entryboxhint')) {
		// 
		//         sch.debug('length:' + entrybox.val().length);
		// 
		// var irt_id = parseInt($('#irt-message').attr('data-status-id'));
		// 
		// if (!Spaz.Prefs.get('twitter-disable-direct-posting')) {
		// 	if ( irt_id > 0 ) {
		// 		Spaz.Data.update(entrybox.val(), Spaz.Prefs.getUser(), Spaz.Prefs.getPass(), irt_id);
		// 	} else {
		// 		Spaz.Data.update(entrybox.val(), Spaz.Prefs.getUser(), Spaz.Prefs.getPass());
		// 	}
		// } else if (Spaz.Prefs.get('services-pingfm-enabled')) {
		// 	Spaz.Data.updatePingFM( entrybox.val() );
		// } else {
		// 	Spaz.UI.statusBar("Nothing sent! Enable direct posting and/or ping.fm");
		// }
		// 
		// 
		//         // entrybox.val('');
		//     }
}







Spaz.UI.decodeSourceLinkEntities = function(str) {
    str = str.replace(/&gt;/gi, '>');
    str = str.replace(/&lt;/gi, '<');
    return str;
}


Spaz.UI.setSelectedTab = function(tab) {
    if (typeof tab == 'number') {
        // if a # is passed in, get the element of the corresponding tab
        sch.debug('getting tab element for number ' + tab);
        Spaz.UI.selectedTab = Spaz.UI.tabbedPanels.getTabs()[tab];
    } else if (typeof tab == 'string') { // this is an ID
        sch.debug('getting tab element for id ' + tab);
		if (tab.indexOf('#') !== 0) {
			tab = '#'+tab;
		}
		Spaz.UI.selectedTab = $(tab).get(0);
    } else {
        sch.debug('tab element passed in ' + tab);
        Spaz.UI.selectedTab = tab;
    }

    sch.debug('Spaz.UI.selectedTab: ' + Spaz.UI.selectedTab.id);

    // sch.debug('restarting reload timer');
    // Spaz.restartReloadTimer();

    Spaz.Data.loadDataForTab(Spaz.UI.selectedTab);
};

/**
 * returns the currently selected tab element
 * @return {DOMElement}
 */
Spaz.UI.getSelectedTab = function() {
    return Spaz.UI.selectedTab;
}


Spaz.UI.reloadCurrentTab = function(force, reset) {
    sch.debug('reloading the current tab');
    Spaz.Data.loadDataForTab(Spaz.UI.selectedTab, force, reset);
}


Spaz.UI.autoReloadCurrentTab = function() {
    sch.debug('auto-reloading the current tab');
    Spaz.Data.loadDataForTab(Spaz.UI.selectedTab, true);
}

Spaz.UI.clearCurrentTimeline = function() {
    sch.debug('clearing the current timeline');
    var tl = Spaz.Timelines.getTimelineFromTab(Spaz.UI.selectedTab)

    // reset the lastcheck b/c some timelines will use "since" parameters
	section.lastcheck = 0;
	sch.debug('set lastcheck to 0');
	if (section.lastid) {
		section.lastid = 0;
		sch.debug('set lastid to 0');
	}
	if (section.lastid_dm) {
		section.lastid_dm = 0;
		sch.debug('set lastid_dm to 0');
	}



    if (section.canclear) {
        var timelineid = section.timeline;
        $('#' + timelineid + ' .timeline-entry').remove();
        sch.debug('cleared timeline #' + timelineid);
    } else {
        sch.debug('timeline not clearable');
    }
}


Spaz.UI.markCurrentTimelineAsRead = function() {
    sch.debug('clearing the current timeline');
    var tl = Spaz.Timelines.getTimelineFromTab(Spaz.UI.selectedTab);
    tl.markAsRead();
};


Spaz.UI.toggleTimelineFilter = function() {
	if (!Spaz.UI.currentFriendsTimelineView) {
		Spaz.UI.currentFriendsTimelineView = 'view-friends-menu-all';
	}
	
	if (Spaz.UI.currentFriendsTimelineView !== 'view-friends-menu-all') {
		Spaz.UI.setView('view-friends-menu-all');
	} else {
		Spaz.UI.setView('view-friends-menu-replies-dms');
	}

};

Spaz.UI.setView = function(type ) {

	sch.error('setView type:'+type);

	if (!type) {
		var type = Spaz.UI.currentFriendsTimelineView || 'view-friends-menu-all';
	}

	sch.dump('View type is '+type);

	var container = Spaz.Timelines.friends.timeline.timeline_container_selector;
	
	/*
		clear it and add the base 'timeline' class back
	*/
	jQuery(container).attr('class', '');
	jQuery(container).attr('class', 'timeline');

	switch(type) {

		case 'view-friends-menu-all':
			jQuery(container).addClass('filter-timeline-all');
			break;
		case 'view-friends-menu-replies-dms':
			jQuery(container).addClass('filter-timeline-replies-dms');
			Spaz.UI.statusBar('Hiding tweets not directed at you');
			break;
		case 'view-friends-menu-replies':
			jQuery(container).addClass('filter-timeline-replies');
			break;
		case 'view-friends-menu-dms':
			jQuery(container).addClass('filter-timeline-dms');
			break;
		case 'view-friends-menu-unread':
			jQuery(container).addClass('filter-timeline-unread');
			break;
		case 'view-friends-menu-custom':
			alert('not yet implemented');
			break;
		default:
			jQuery(container).addClass('filter-timeline-all');
			break;
	}

	sch.dump(jQuery(container).attr('class'));

	Spaz.UI.currentFriendsTimelineView = type;

	$().trigger('UNREAD_COUNT_CHANGED');

}



/*
    Remap this function to the new, more OOP-oriented setup
*/
Spaz.UI.showTooltip = function(el, str, previewurl) {

    var opts = {
        'el': el,
        'previewurl': previewurl,
    }

    // if (e) { opts['e'] = e }
    if (event) {
        opts.e = event
    }

    var tt = new Spaz_Tooltip(str, opts);
    tt.show();

};





Spaz.UI.hideTooltips = function() {
    // clear existing timeouts
    var tt = $('#tooltip');

    sch.debug('clearing show and hide tooltip timeouts');
    clearTimeout(Spaz_Tooltip_Timeout)
    clearTimeout(Spaz_Tooltip_hideTimeout);
    tt.stop();
    $('#tooltip .preview').hide();
    tt.hide();
}


Spaz.UI.getViewport = function() {
    return {
        x: $('#container').scrollLeft(),
        y: $('#container').scrollTop(),
        cx: $('#container').width(),
        cy: $('#container').height()
    };
}






Spaz.UI.showLinkContextMenu = function(jq, url) {
    var el = jq[0];

    // hide any showing tooltips
    // sch.dump('hiding tooltip');
    $('#tooltip').hide();

    // show the link context menu
    // sch.dump('opening context menu');
    $('#linkContextMenu').css('left', event.pageX)
    .css('top', event.pageY)
    .unbind()
    .show();


    $('#userContextMenu .menuitem').unbind();

    // sch.dump('outerHTML:'+el.outerHTML);
    var urlarray = /http:\/\/([^'"]+)/i.exec(url);
    if (urlarray && urlarray.length > 0) {
        var elurl = urlarray[0];

        // sch.dump('url from element:'+elurl);
        $('#linkContextMenu-copyLink').one('click', {
            url: elurl
        },
        function(event) {
            Spaz.Sys.setClipboardText(event.data.url);
            // sch.dump('Current Clipboard:'+Spaz.Sys.getClipboardText());
        });
        // sch.dump('Set one-time click event on #menu-copyLink');
        $(document).one('click',
        function() {
            $('#linkContextMenu').hide();
        });
        // sch.dump('set one-time link context menu close event for click on document');
    } else {
        // sch.dump('no http link found');
        }
};



Spaz.UI.showUserContextMenu = function(jq, screen_name) {
    if (!screen_name) {
        return false;
    }

    sch.dump(screen_name)

    var el = jq[0];

    sch.debug(el);

    // hide any showing tooltips
    // sch.dump('hiding tooltip');
    $('#tooltip').hide();

    // show the link context menu
    // sch.dump('opening context menu for user '+screen_name);
    $('#userContextMenu').css('left', event.pageX)
    .css('top', event.pageY)
    .show();

    $('#userContextMenu .menuitem').attr('user-screen_name', screen_name);


    // sch.dump('Set one-time click event on #userContextMenu');
    $(document).one('click',
    function() {
        $('#userContextMenu').hide();
    });

};





Spaz.UI.addItemToTimeline = function(entry, section, mark_as_read, prepend) {
	//     // alert('adding:'+entry.id)
	//     if (entry.error) {
	//         sch.debug('There was an error in the entry:' + entry.error)
	//     }
	// 
	//     var timelineid = section.timeline;
	// 
	// sch.debug('TIMELINE #' + timelineid + '-' + entry.id);
	// sch.dump('TIMELINE #' + timelineid + '-' + entry.id);
	// 
	// 
	// 
	//     // sch.dump(JSON.stringify(entry));
	//     if ($('#' + timelineid + '-' + entry.id).length < 1) {
	// 	sch.dump('adding #' + timelineid + '-' + entry.id);
	// 	entry.isDM = false;
	// 	entry.isSent = false;
	// 	if (!entry.favorited) { // we do this to make a favorited property for DMs
	// 		entry.favorited = false;
	// 	}
	// 
	// 	if (entry.sender) {
	// 		entry.user = entry.sender
	// 		entry.isDM = true;
	// 	}
	// 
	// 	if (!entry.in_reply_to_screen_name) {
	// 		entry.in_reply_to_screen_name = false;
	// 	}
	// 
	// 
	// 	if (timelineid == 'timeline-user') {
	// 		entry.isSent = true;
	// 	}
	// 
	// 	// sch.debug(entry);
	// 
	// 	if (!entry.user.name) {
	// 		entry.user.name = entry.user.screen_name
	// 	}
	// 
	// 	/*
	// 		Check for reply
	// 	*/
	// 
	// 	if (entry.in_reply_to_user_id && !entry.in_reply_to_screen_name) {
	// 		sch.dump('in_reply_to_user_id exists, but in_reply_to_screen_name not set');
	// 		var reply_matches = null;
	// 		if (reply_matches = entry.text.match(/^@([a-zA-Z0-9_\-]+)/i)) {
	// 			entry.in_reply_to_screen_name = reply_matches[1];
	// 		}
	// 	}
	// 
	// 	entry.rowclass = "even";
	// 	entry.timestamp = sch.httpTimeToInt(entry.created_at);
	// 	entry.base_url = Spaz.Prefs.get('twitter-base-url');
	// 	entry.timelineid = timelineid;
	// 
	// 
	// 	/*
	// 		Clean the entry.text
	// 	*/
	// 	// fix weird unicode junk
	// 	entry.text = entry.text.replace(/\u2028/, " ");
	// 
	// 	// save a raw version
	// 	entry.rawtext = entry.text;
	// 
	// 	// fix extra ampersand encoding
	// 	entry.text = entry.text.replace(/&amp;(gt|lt|quot|apos);/gi, '&$1;');
	// 
	// 	// fix entity &#123; style extra encoding
	// 	entry.text = entry.text.replace(/&amp;#([\d]{3,4});/gi, '&#$1;');
	// 
	// 	// sch.dump(this.innerHTML);
	// 	if (Spaz.Prefs.get('usemarkdown')) {
	// 		var md = new Showdown.converter();
	// 
	// 		// Markdown conversion with Showdown
	// 		entry.text = md.makeHtml(entry.text);
	// 
	// 		// put title attr in converted Markdown link
	// 		entry.text = entry.text.replace(/href="([^"]+)"/gi, 'href="$1" title="Open link in a browser window" class="inline-link"');
	// 	}
	// 
	// 	// convert inline links
	// 	/*
	// 		Inline links that start with http://
	// 	*/
	// 	var inlineRE = /(?:(\s|^|\.|\:|\())(https?:\/\/)((?:[^\W_]((?:[^\W_]|-){0,61}[^\W_])?\.)+([a-z]{2,6}))((?:\/[\w\.\/\?=%&_\-~@#+]*)*)/gi;
	// 	entry.text = entry.text.replace(inlineRE, '$1<a href=\"$2$3$6\" title="Open link in a browser window" class="inline-link">$3&raquo;</a>');
	// 
	// 	/*
	// 		this is the regex we use to match inline
	// 		lots of uncommon but valid top-level domains aren't used
	// 		because they cause more problems than solved
	// 	*/
	// 	var inlineRE = /(?:(\s|^|\:|\())((?:[^\W_]((?:[^\W_]|-){0,61}[^\W_])?\.)+(com|net|org|co\.uk|aero|asia|biz|cat|coop|edu|gov|info|jobs|mil|mobi|museum|name|au|ca|cc|cz|de|eu|fm|fr|gd|hk|ie|it|jp|nl|no|nu|nz|ru|st|tv|uk|us))((?:\/[\w\.\/\?=%&_\-~@#+]*)*)/g;
	// 	entry.text = entry.text.replace(inlineRE, '$1<a href=\"http://$2$5\" title="Open link in a browser window" class="inline-link">$2&raquo;</a>');
	// 
	// 	// email addresses
	// 	entry.text = entry.text.replace(/(^|\s+)([a-zA-Z0-9_+-]+)@([a-zA-Z0-9\.-]+)/gi, '$1<a href="mailto:$2@$3" class="inline-email" title="Send an email to $2@$3">$2@$3</a>');
	// 
	// 	// convert @username reply indicators
	// 	entry.text = entry.text.replace(/(^|\s+)@([a-zA-Z0-9_-]+)/gi, '$1<a href="' + Spaz.Prefs.get('twitter-base-url') + '$2" class="inline-reply" title="View $2\'s profile page" user-screen_name="$2">@$2</a>');
	// 
	// 	// convert emoticons
	// 	entry.text = Emoticons.SimpleSmileys.convertEmoticons(entry.text)
	// 
	// 	// hashtags
	// 	entry.text = entry.text.replace(/(\s|^|\(|\[)(#([a-z0-9_\-]{2,}))/gi, '$1<a href="javascript:;" title="View search results for $2" class="inline-link hashtag-link">$2</a>');
	// 
	// 
	// 	var entryHTML = Spaz.Tpl.parse('timeline_entry', entry);
	// 	// sch.dump(entryHTML);
	// 
	// 	// sch.dump('make DOMElement from string: '+entryHTML);
	// 	// var entryElement = document.createElement(entryHTML);
	// 
	// 	// Make the jQuery object and bind events
	// 	// sch.dump('make jQ entry and bind events to: '+entryElement);
	// 	// sch.dump('make jQ entry and bind events to: '+entryElement);
	// 
	// 	var jqentry = $(entryHTML);
	// 
	// 	if (mark_as_read) {
	// 		jqentry.addClass('read')
	// 		jqentry.removeClass('new')
	// 	}
	// 
	// 	if (entry.isDM) {
	// 		jqentry.addClass('dm');
	// 	}
	// 
	// 	// We only do the fetch if the mark_as_read is not specified
	// 	if (typeof mark_as_read == 'undefined')
	// 	{
	// 		// The as read callback
	// 		Spaz.DB.asyncGetAsRead(entry.id,
	// 		function(read)
	// 		{
	// 			if (read)
	// 			{
	// 				// sch.dump("Entry " + entry.id + " is read");
	// 				jqentry.addClass('read');
	// 				jqentry.removeClass('new');
	// 				$().trigger('UNREAD_COUNT_CHANGED');
	// 			}
	// 		});
	// 	}
	// 
	// 	if (prepend) {
	// 		$('#' + timelineid).prepend(jqentry);
	// 	} else {
	// 		$('#' + timelineid).append(jqentry);
	// 	}
	// 
	// 
	// 	return true;
	// 
	//     } else {
	//         sch.debug('skipping ' + entry.id);
	// 
	//         return false;
	//     }

}




Spaz.UI.selectEntry = function(el) {

    sch.debug('unselected tweets');
    $('div.timeline-entry.ui-selected').removeClass('ui-selected');


    sch.debug('selecting tweet');
    $(el).addClass('ui-selected').addClass('read').each(function() {
        if (entryId = Spaz.UI.getStatusIdFromElement(this)) {
            sch.dump("Want to mark as read " + entryId);
            Spaz.DB.markEntryAsRead(entryId);
        }
    });

	sch.debug(el);
    sch.debug('selected tweet #' + el.id + ':' + el.tagName + '.' + el.className);

    $().trigger('UNREAD_COUNT_CHANGED');

}



Spaz.UI.getStatusIdFromElement = function(el) {
	var entryId = parseInt($(el).attr('data-status-id'), 10);

    if (entryId === null) {
        sch.dump("Cannot obtain entry id for entry with DOM id " + this.id);
        return false;
    } else {
        return entryId;
    }
};


/*
	this returns the first matching element that contains the given id
*/
Spaz.UI.getElementFromStatusId = function(id) {
	var element = $('.entry-id:contains('+id+')').parent().get()[0];
	if (element) {
		sch.dump(element.id);
		return element
	}
	return false;
};



Spaz.UI.markEntryAsRead = function(el) {

    $(el).removeClass('new').addClass('read');

    $().trigger('UNREAD_COUNT_CHANGED');

}




Spaz.UI.sortTimeline = function(timelineid, reverse, sort_all) {

    /*
        Check the sorting
    */
    var unsorted = false;

    $('#' + timelineid + ' div.timeline-entry').each(function() {

        if ( parseInt($(this).find('div.entry-timestamp').text()) < parseInt($(this).next().find('div.entry-timestamp').text()) ) {
            unsorted = true;
            return false;
        }
    });

    if (unsorted) {
        // if (sort_all) {
        time.start('sortTimeline');
        var cells = $('#' + timelineid + ' div.timeline-entry').remove().get();
        // } else {
        // var cells = $('#'+timelineid+' div.timeline-entry.needs-cleanup');
        // }
        // sch.debug('cells length:'+cells.length);

        if (reverse) {
            $(cells.sort(Spaz.UI.sortTweetElements)).prependTo('#' + timelineid);
        } else {
            $(cells.sort(Spaz.UI.sortTweetElements)).appendTo('#' + timelineid);
        }
        time.stop('sortTimeline');

        // time.report();
        // sch.debug('done sorting');
    }

}



Spaz.UI.sortTweetElements = function(a, b) {
    var inta = parseInt($(a).find('.entry-timestamp').text())
    var intb = parseInt($(b).find('.entry-timestamp').text())
    var diff =  inta - intb;
    return diff;
};



Spaz.UI.reverseTimeline = function(timelineid) {
    var cells = $('#' + timelineid + ' .timeline-entry');
    cells.reverse(true).remove().appendTo('#' + timelineid);
}


Spaz.UI.getUnreadCount = function() {
	var timelineid = Spaz.Timelines.friends.timeline.timeline_container_selector;

	var selector = timelineid + ' div.timeline-entry:visible'

    // // unread count depends on whether or not we're showing everything, or just replies/dms
    // if ($('#' + timelineid).is('.dm-replies')) {
    //     var selector = '#' + timelineid + ' div.timeline-entry.dm, #' + timelineid + ' div.timeline-entry.reply'
    // } else {
    //     var selector = '#' + timelineid + ' div.timeline-entry'
    // }
	var unread_count = $(selector).not('.read').length;

	sch.dump(unread_count);

    return unread_count;
};


Spaz.UI.getNewEntrySelector = function() {
    var timelineid = Spaz.Section.friends.timeline;

    // we change the selector so that messages not showing do not trigger notifications
    if ($('#' + timelineid).is('.dm-replies')) {
        var selector = '#' + timelineid + ' .new.dm, #' + timelineid + ' .new.reply:visible'
    } else {
        var selector = '#' + timelineid + ' .new:visible'
    }

    return selector;
}

Spaz.UI.getNewEntryCount = function() {
    return $(Spaz.UI.getNewEntrySelector()).not('.read').length;
}


Spaz.UI.notifyOfNewEntries = function(new_entries) {

    $().trigger('UNREAD_COUNT_CHANGED');
    sch.debug('notifyOfNewEntries');

	var new_count = new_entries.length;
    if (new_count > 0) {

        sch.debug('NewEntries found!');

		if (Spaz.Prefs.get('window-notificationmethod') === 'growl') {

			if (!Spaz.Growl) {
				Spaz.Growl = new SpazGrowl('Spaz');
			}
			
			if (Spaz.Prefs.get('notify-totals')) {
				Spaz.Growl.notify(new_count + " New Messages", "There were "+new_count+" new messages found", {
					'identifier':SpazGrowl.NEW_MESSAGE_COUNT
				});
			}


			if ( new_count > Spaz.Prefs.get('window-notificationmax')) {
				new_entries = new_entries.slice(0, Spaz.Prefs.get('window-notificationmax'));
			}

			
			for (var x=0; x<new_entries.length; x++) {
				
				var this_entry = new_entries[x];
				var growl_opts = {};
				
				if (this_entry.SC_is_dm && Spaz.Prefs.get('notify-dms')) {
					var title = "New DM from "+this_entry.sender.screen_name;
					var text        = this_entry.SC_text_raw;
					growl_opts.img = this_entry.sender.profile_image_url;
					// growl_opts.identifier = SpazGrowl.NEW_MESSAGE_DM;
					Spaz.Growl.notify(title, text, growl_opts);
				} else {
					if (this_entry.SC_is_reply && Spaz.Prefs.get('notify-mentions')) {
						var title = "New @mention from "+this_entry.user.screen_name;
						var text        = this_entry.SC_text_raw;
						growl_opts.img = this_entry.user.profile_image_url;
						// growl_opts.identifier = SpazGrowl.NEW_MESSAGE_REPLY;
						Spaz.Growl.notify(title, text, growl_opts);
					} else if (Spaz.Prefs.get('notify-messages')) {
						var title = "New message from "+this_entry.user.screen_name;
						var text        = this_entry.SC_text_raw;
						growl_opts.img = this_entry.user.profile_image_url;
						// growl_opts.identifier = SpazGrowl.NEW_MESSAGE;
						Spaz.Growl.notify(title, text, growl_opts);
					}
				}
				
				
			}

		} else {

			var this_entry = new_entries[0];

	        sch.debug('Sending notification');
	        var resp = "";

			if (this_entry.SC_is_dm) {
				var screen_name = this_entry.sender.screen_name;
				var text        = this_entry.SC_text_raw;
				var img = this_entry.sender.profile_image_url;
				// growl_opts.identifier = SpazGrowl.NEW_MESSAGE_DM;
			} else {
				if (this_entry.SC_is_reply) {
					var screen_name = this_entry.user.screen_name;
					var text        = this_entry.SC_text_raw;
					var img = this_entry.user.profile_image_url;
					// growl_opts.identifier = SpazGrowl.NEW_MESSAGE_REPLY;
				} else {
					var screen_name = this_entry.user.screen_name;
					var text        = this_entry.SC_text_raw;
					var img = this_entry.user.profile_image_url;
					// growl_opts.identifier = SpazGrowl.NEW_MESSAGE;
				}
			}
			
			// alert("screen_name:"+screen_name+"\ntext:"+text+"\n img:"+img);

	        if (new_count > 1) {
	            var title = screen_name + " (+" + (new_count - 1) + " more)";
	        } else {
	            var title = screen_name;
	        }
	        Spaz.UI.notify(text, title, Spaz.Prefs.get('window-notificationposition'), Spaz.Prefs.get('window-notificationhidedelay'), img);
		}

        Spaz.UI.playSoundNew();
        Spaz.UI.statusBar('Updates found');

    } else {
        sch.debug('NewEntries NOT found!');
        Spaz.UI.statusBar('No new messages');
    }

}


Spaz.UI.alert = function(message, title) {
    if (!title) {
        title = "Alert"
    }
    Spaz.UI.notify(message, title, null, Spaz.Prefs.get('window-notificationhidedelay'), 'app:/images/spaz-icon-alpha_48.png');
}


Spaz.UI.notify = function(message, title, where, duration, icon, force) {
    if (Spaz.Prefs.get('window-shownotificationpopups') || force) {
        // Spaz.Notify.add(message, title, where, duration, icon);

		if (Spaz.Prefs.get('window-notificationmethod') === 'growl') {

			if (!Spaz.Growl) {
				Spaz.Growl = new SpazGrowl('Spaz', new air.File(new air.File("app:/images/spaz-icon-alpha.png").nativePath).url);
			}

			Spaz.Growl.notify(title, message, icon);
		} else {
			PurrJS.notify(title, message, icon, duration, where);
		}

    } else {
        sch.debug('not showing notification popup - window-shownotificationpopups disabled');
    }
}






// cleans up and parses stuff in timeline's tweets
Spaz.UI.cleanupTimeline = function(timelineid, suppressNotify, suppressScroll, skip_sort) {

	/*
		record some values so we can adjust the scrollTop if necessary
	*/
	var oldFirst  = $('#'+timelineid+" div.timeline-entry:first");
	var $timeline = $('#'+timelineid);
	var offset_before = oldFirst.offset().top;
	sch.dump("oldFirst BEFORE top: " + oldFirst.offset().top + "\nscrollTop: " + $timeline.parent().scrollTop());



	// alert('Spaz.UI.cleanupTimeline');

    /*
        Make this non-blocking
    */
    Spaz.Timers.add(function() {
        var numentries = $('#' + timelineid + ' div.timeline-entry').length;
        time.start('sortTimeline');
        if (numentries > 1 && !skip_sort) {
            sch.debug('Sorting timeline numentries:'+numentries);
            Spaz.UI.sortTimeline(timelineid, true);
        } else {
            sch.debug('not sorting - skip_sort:'+skip_sort+' numentries:'+numentries);
        }
        time.stop('sortTimeline');
        return false;
    });


    /*
        remove extra entries
    */
    Spaz.Timers.add(function() {
        time.start('removeExtras');

		var tl_selector = '#' + timelineid + ' div.timeline-entry';

		// alert(tl_selector);

		function removeExtraItems(type) {
			switch (type) {
				case 'reply':
					var tweets  = $(tl_selector).is('reply');
					var prefkey = "timeline-maxentries-reply";
					break;

				case 'dm':
					var tweets  = $(tl_selector).is('dm');
					var prefkey = "timeline-maxentries-dm";
					break;

				default:
					var tweets  = $(tl_selector).not('.reply, .dm');
					var prefkey = "timeline-maxentries";
			}

			var numEntries = tweets.length
	        if (numEntries > Spaz.Prefs.get(prefkey)) {
	            var diff = numEntries - Spaz.Prefs.get(prefkey);
	            sch.dump("numEntries "+type+"is " + numEntries + " > " + Spaz.Prefs.get(prefkey) + "; removing last " + diff + " entries");
	            tweets.slice(diff * -1).remove();
	        }
		}


		removeExtraItems();
		removeExtraItems('reply');
		removeExtraItems('dm');

        time.stop('removeExtras');
        return false;
    });


    /*
        Make this non-blocking
    */
    Spaz.Timers.add(function() {
        time.start('removeEvenOdd-convertPostTimes');

        $("#" + timelineid + ' .timeline-entry').removeClass('even').removeClass('odd');

        $("#" + timelineid + ' a.status-created-at').each(function(i) {
            $(this).text(sch.get_relative_time($(this).attr('data-created-at')));
        });
        time.stop('removeEvenOdd-convertPostTimes');
        return false;
    });



    /*
        Make this non-blocking
    */
    Spaz.Timers.add(function() {
        time.start('applyEvenOdd');
        // apply even class
        $("#" + timelineid + ' .timeline-entry:nth-child(even)').addClass('even');

        // apply odd class
        $("#" + timelineid + ' .timeline-entry:nth-child(odd)').addClass('odd');
        time.stop('applyEvenOdd');
        return false;
    });

    /*
        Make this non-blocking
    */
    Spaz.Timers.add(function() {
        time.start('scrollTimeline');
        if (!suppressScroll) {
            if ($("#" + timelineid + ' .timeline-entry.new:not(.read)').length > 0) {
                // scroll to top
                sch.debug('scrolling to .timeline-entry.new:not(.read) in #' + timelineid);

				/*

				*/
                if (Spaz.Prefs.get('timeline-scrollonupdate') && $timeline.parent().scrollTop() > 0) {
                    try {
						sch.dump('scrolliong thee timeline '+timelineid);
                        $('#'+timelineid).parent().scrollTo('.timeline-entry.new:not(.read):last', {
                            speed: 400,
                            easing: 'swing'
                        })
                    } catch(e) {
                        sch.debug('Error doing scrollTo first new entry - probably switched tabs in the middle of loading. No sweat!');
                    }
                }

            }
        }
        time.stop('scrollTimeline');
        return false;
    });

    /*
        Make this non-blocking
    */
    Spaz.Timers.add(function() {


        var cleanupTweets = $("div.needs-cleanup", "#" + timelineid);

        time.start('bindOnceFadein');
        cleanupTweets.find('img.user-image').one('load',
        function() {
            // alert('fadingIn');
            $(this).fadeTo('500', '1.0');
        });
        time.stop('bindOnceFadein');

        time.start('highlightReplies');
        // highlight all messages that mention @username
        cleanupTweets.find(".status-text").each(function(i) {
            var re = new RegExp('@' + Spaz.Prefs.getUser() + '\\b', 'i');
            if (re.test($(this).html())) {
                // sch.debug("found reply in "+$(this).text());
                $(this).parents('div.needs-cleanup').addClass('reply');
            }
        })
        time.stop('highlightReplies');


        /* clean up the .status-text */

        // make it here so we don't instantiate on every loopthrough
        var md = new Showdown.converter();

        time.start('cleanupStatusText');
        cleanupTweets.find("div.status-text").each(function(i) {

            // ******************************
            // Support for shortened URL rewriting
            // ******************************
            // We save this as it will be used in the response status callback
            var divElt = this;

            // We save the text as it could change in the loop due to async callbacks
            var txt = divElt.innerHTML;

            var domains = ["short.ie", "tinyurl.com", "is.gd", "snipr.com", "snurl.com", "moourl.com", "url.ie", "snipurl.com", "xrl.us", "bit.ly", "ping.fm", "urlzen.com", "revcanonical" ];
            var stream = new air.URLStream();

            // time.start('lookingForShortDomains');
            for (var i in domains)
            {
                // Get domain
                var domain = domains[i];

                // Iterate over URL pattern
                var urlRE = new RegExp("http:\\/\\/" + domain + "([\\w\\-_+\\/]*)", "g");
                var matchArray = null;
                while (matchArray = urlRE.exec(txt)) {
                    // sch.dump("Getting content of URL " + matchArray[1]);
                    sch.debug("Getting content of URL " + matchArray[1]);

                    // Get the URL
                    var url = matchArray[0];

                    // Now we make a request to obtain the response URL
                    stream.addEventListener(air.HTTPStatusEvent.HTTP_RESPONSE_STATUS, onHTTPResponseStatus, false, 0, true);
                    stream.addEventListener(air.IOErrorEvent.IO_ERROR, onIOError);

					// make the URLRequest and set some properties
					url_req = new air.URLRequest(url);
					url_req.manageCookies = false;
					url_req.authenticate  = false;
					url_req.cacheResponse = true;
					url_req.userAgent = Spaz.Sys.getUserAgent();

					// Perform load
                    stream.load(url_req);
                    // sch.dump("Decoding " + domain + " URL " + url);
                    sch.dump("Decoding " + domain + " URL " + url);
                }

            }
            // time.stop('lookingForShortDomains');

            function onHTTPResponseStatus(event) {
                // sch.dump('onHTTPResponseStatus');
                if (event.status == 200) {
                    // Here we get the value to rewrite
                    var targetURL = event.responseURL;
                    var slicerRE = /(?:(\s|^|\.|\:|\())(?:http:\/\/)((?:[^\W_]((?:[^\W_]|-){0,61}[^\W_])?\.)+([a-z]{2,6}))((?:\/[\w\.\/\?=%&_-]*)*)/;
                    var targetDomain = targetURL.replace(slicerRE, "$2");
                    sch.debug("Got a response status event for url " + url + ": " + targetURL);
                    $(divElt).find("a[href*=" + url + "]").html(targetDomain + "&raquo;").attr("href", targetURL);
                }
                stream.removeEventListener(air.HTTPStatusEvent.HTTP_RESPONSE_STATUS, onHTTPResponseStatus);
                stream.removeEventListener(air.IOErrorEvent.IO_ERROR, onIOError);
            }

            function onIOError(event) {
                // sch.dump('onIOError');
                var targetURL = event.responseURL;
                sch.debug('Request to ' + event.responseURL + ' returned an IOErrorEvent');
                sch.debug(event);
                stream.removeEventListener(air.HTTPStatusEvent.HTTP_RESPONSE_STATUS, onHTTPResponseStatus);
                stream.removeEventListener(air.IOErrorEvent.IO_ERROR, onIOError);
            }

        });

        time.start('removeCleanupClass');
        // remove the needs-cleanup and show
        cleanupTweets.css('display', '').removeClass('needs-cleanup');
        time.stop('removeCleanupClass');

        time.stop('cleanupStatusText');

        // Spaz.Timers.stop();


		/*
			this is a helper to fadeIn any user avatars that didn't see the load event properly
		*/
		function fadeInStragglers() {
			$("img.user-image").each( function() {
				if ($(this).css('opacity') < 1) {
					// sch.dump('fadingIn: '+this.outerHTML);
					$(this).fadeTo('500', '1.0');
				}
			});
		};

		/*
			run the helper after 5 seconds
		*/
		setTimeout(fadeInStragglers, 5000);

		/*
			if necessary, adjust the scrollTop
		*/
		var offset_after = oldFirst.offset().top;
		var offset_diff = Math.abs(offset_before - offset_after);
		sch.dump("oldFirst AFTER top: " + oldFirst.offset().top + "\nscrollTop: " + $timeline.parent().scrollTop() + "\noffset_diff: "+offset_diff);

		if ($timeline.parent().scrollTop() > 0) {
			$timeline.parent().scrollTop( $timeline.parent().scrollTop() + offset_diff );
		}

		sch.dump($timeline.parent().scrollTop());
        return false;
    });

    /*
        Make this non-blocking
    */
    Spaz.Timers.add(function() {
        //sch.debug($("#"+timelineid).html());
        time.start('setNotificationTimeout');
        // we delay on notification of new entries because stuff gets
        // really confused and wonky if you fire it off right away
        if (!suppressNotify) {
            sch.debug('Set timeout for notifications');
            Spaz.UI.notifyOfNewEntries();
            // remove "new" indicators
            $("#" + Spaz.Section.friends.timeline + ' .new').removeClass('new');
        }
        time.stop('setNotificationTimeout');

        return false;
    });


}



/**
 * @param {string|number} index an integer or an ID for the tab 
 */
Spaz.UI.showTab = function(index) {
    Spaz.UI.setSelectedTab(index);

	if (typeof index === 'number') {
	    Spaz.UI.tabbedPanels.showPanel(index);		
	} else if (typeof index === 'string') {
	    Spaz.UI.tabbedPanels.showPanel(index);		
	}
}

Spaz.UI.showPrefs = function() {
    Spaz.UI.setSelectedTab(document.getElementById(Spaz.Section.prefs.tab));
    Spaz.UI.tabbedPanels.showPanel(Spaz.Section.prefs.tab);
}

Spaz.UI.openLoginPanel = function() {
    Spaz.UI.prefsCPG.openPanel(0);
};



Spaz.UI.focusHandler = function(event) {
    e = event || window.event;
    el = e.srcElement || e.target;

    sch.debug('FOCUS name:' + e.name + ' tagname:' + el.tagName + ' id:' + el.id);
};

Spaz.UI.blurHandler = function(event) {
    e = event || window.event;
    el = e.srcElement || e.target;

    sch.debug('BLUR	 name:' + e.name + ' tagname:' + el.tagName + ' id:' + el.id);
};

Spaz.UI.clickHandler = function(event) {
    e = event || window.event;
    el = e.srcElement || e.target;

    sch.debug('BLUR	 name:' + e.name + ' tagname:' + el.tagName + ' id:' + el.id);
};

/**
 * Generates the Account (user) selection menu.
 * @returns void
 */
Spaz.UI.generateAccountsMenu = function() {
	var accounts = Spaz.DB.getUserList();

	for (i = 0; i < accounts.length; i++) {
		$('#mainMenu-account-list').append('<li class="menuitem">' +
										   '<a  class="mainMenu-account" id="mainMenu-accountname-' + accounts[i] +
										   '">' + accounts[i] + '</a></li>');
		$('#account-list').append('<li class="account-list-item">' +
								  '<a  class="account-item" id="account-list-item-' + accounts[i] +
								  '">' + accounts[i] + '</a></li>');
		if (accounts[i].toLowerCase() == Spaz.Prefs.user) {
			$('#mainMenu-accountname-' + accounts[i]).addClass("selected-account");
			$('#account-list-item-'    + accounts[i]).addClass("selected-account");
		}
	}

	// $('#account-details').hide();

	/**
	 * Repeating this code block here makes the previously generated menu items
	 * appear -- but I don't understand why.
	 */
	$('#header-label').menu({
			copyClassAttr: true,
			addExpando: true,
			onClick: $.Menu.closeAll
		},
		'#mainMenuRoot'
	);
}

Spaz.UI.accountMaintenance = function(imgurl) {
	var url = 'app:/html/accounts.html';
	if (imgurl) {
		url += '?fileUrl='+encodeURIComponent(imgurl);
	}
    this.instance = window.open(url, 'accountMaint', 'height=300,width=350');
}