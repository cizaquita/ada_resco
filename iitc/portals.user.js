// ==UserScript==
// @id             iitc-plugin-owners-list-owners
// @name           IITC plugin: Muestra lista de portales Iluminados en una zona
// @author         teo96 - Editor @Cizaquita
// @category       Info
// @version        0.2.1.2016804.0010
// @namespace      https://github.com/jonatkins/ingress-intel-total-conversion
// @updateURL      
// @downloadURL    
// @description    Muestra lista de portales Iluminados en una zona
// @include        https://www.ingress.com/intel*
// @include        http://www.ingress.com/intel*
// @match          https://www.ingress.com/intel*
// @match          http://www.ingress.com/intel*
// @include        https://www.ingress.com/mission/*
// @include        http://www.ingress.com/mission/*
// @match          https://www.ingress.com/mission/*
// @match          http://www.ingress.com/mission/*
// @grant          none
// ==/UserScript==


// CHANGELOG //////////////////////////////////////////////////////////////
// 0.2.1.2016804.0010
// + Optimized for Telegram Bot @ada_resco_bot
// 0.2.1.20150708.0004
// + Add Support for database
// 0.2.1.20150704.0003
// + Add Server Save Support
// 0.2.1.20150703.0002
// + AddField Portal URL
// 0.2.1.20150703.0001
// + Initial release. 
//   > Muestra una lista de los portales visibles por INTEL y busca los propietarios actuales.
///////////////////////////////////////////////////////////////////////////


function wrapper(plugin_info) {
    // ensure plugin framework is there, even if iitc is not yet loaded
    if(typeof window.plugin !== 'function') window.plugin = function() {};

    //PLUGIN AUTHORS: writing a plugin outside of the IITC build environment? if so, delete these lines!!
    //(leaving them in place might break the 'About IITC' page or break update checks)
    plugin_info.buildName = 'yo';
    plugin_info.dateTimeVersion = '20150708.0004';
    plugin_info.pluginId = 'portals-list-owners';
    //END PLUGIN AUTHORS NOTE

    // PLUGIN START ////////////////////////////////////////////////////////

    // use own namespace for plugin
    window.plugin.ownerlist = function() {};

    window.plugin.ownerlist.listPortals = [];
    window.plugin.ownerlist.sortBy = 5; // sort by Team
    window.plugin.ownerlist.sortOrder = -1;
    window.plugin.ownerlist.enlP = 0;
    window.plugin.ownerlist.resP = 0;
    window.plugin.ownerlist.neuP = 0;
    window.plugin.ownerlist.filter = 0;
	window.plugin.ownerlist.server = "";
	window.plugin.ownerlist.sendinfo = false;
    window.plugin.ownerlist.descargarble = true;
    window.plugin.ownerlist.minHe = -1;
	

    /*
 * plugins may add fields by appending their specification to the following list. The following members are supported:
 * title: String
 *     Name of the column. Required.
 * value: function(portal)
 *     The raw value of this field. Can by anything. Required, but can be dummy implementation if sortValue and format
 *     are implemented.
 * sortValue: function(value, portal)
 *     The value to sort by. Optional, uses value if omitted. The raw value is passed as first argument.
 * sort: function(valueA, valueB, portalA, portalB)
 *     Custom sorting function. See Array.sort() for details on return value. Both the raw values and the portal objects
 *     are passed as arguments. Optional. Set to null to disable sorting
 * format: function(cell, portal, value)
 *     Used to fill and format the cell, which is given as a DOM node. If omitted, the raw value is put in the cell.
 * defaultOrder: -1|1
 *     Which order should by default be used for this column. -1 means descending. Default: 1
 */

	// sync all keys with the server
    window.plugin.ownerlist.send2server = function send2server(timemy, logmy) {
        // hide current key count for displayed portal
        if (!window.plugin.ownerlist.sendinfo) {
			console.log("[ownerlist] Send to server... DESACTIVADO");
			return;
		}
			
        console.log("[ownerlist] Send to server...");
        
		$.ajax({
            url: window.plugin.ownerlist.server,
            method: "POST",
            data: {
                action: "owners",
                user: window.PLAYER.nickname,
				time: timemy,
                portals: logmy
            },
			
            success: function(resp, status, obj) {
                console.log("[ownerlist] Response received.");
				/*
                var data = JSON.parse(resp);
                // if user is authenticated
                if (data.auth) {
                    // re-show info on selected portal
                    self.addInfo();
                } else {
                    self.authFail();
                }
				*/
            },
            error: function(obj, status, err) {
                console.warn("[ownerlist] Failed to sync: " + status);
				/*
                setTimeout(function() {
                    self.syncKeys();
                }, 3000);
				*/
            }
        });
    };

    window.plugin.ownerlist.fields = [
        {
            title: "Owner",
            value: function(portal) { 
				switch (portal.options.team) {
					case TEAM_ENL:
						window.portalDetail.request(portal.options.guid);
						var d = window.portalDetail.get(portal.options.guid);
						if (d) {
							window.plugin.ownerlist.descargarble = true;
							return d.owner;
						}else{
							return "Iluminado"; 
						}
						break;
					case TEAM_RES:
						return "Resistencia";
						break;
					default:
						return "Neutral"; 
				}
            },
            format: function(cell, portal, value) {
                $(cell)
                .text(value);
            }
        },
        {
            title: "Name",
            value: function(portal) { return portal.options.data.title; },
            sortValue: function(value, portal) { return value.toLowerCase(); },
            format: function(cell, portal, value) {
                $(cell)
                .append(plugin.ownerlist.getPortalLink(portal))
                .addClass("portalTitle");
            }
        },
        {
            title: "Level",
            value: function(portal) { return portal.options.data.level; },
            format: function(cell, portal, value) {
                $(cell)
                .css('background-color', COLORS_LVL[value])
                .text(value); // 'L' + 
            },
            defaultOrder: -1,
        },
        {
            title: "Team",
            value: function(portal) { return portal.options.team; },
            format: function(cell, portal, value) {
                $(cell).text(['N', 'R', 'E'][value]);
            },
            defaultOrder: -1,
        },
        {
            title: "H%",
            value: function(portal) { return portal.options.data.health; },
            sortValue: function(value, portal) { return portal.options.team===TEAM_NONE ? -1 : value; },
            format: function(cell, portal, value) {
                $(cell)
                .addClass("alignR")
                .text(portal.options.team===TEAM_NONE ? '0' : value); // +'%'
            },
            defaultOrder: -1,
        },
        {
            title: "Res",
            value: function(portal) { return portal.options.data.resCount; },
            format: function(cell, portal, value) {
                $(cell)
                .addClass("alignR")
                .text(value);
            },
            defaultOrder: -1,
        },
        {
            title: "LAT",
            value: function(portal) { 
                var coord = portal.getLatLng();
                return coord.lat; 
            },
            format: function(cell, portal, value) {
                $(cell)
                .addClass("alignR")
                .text(value);
            },
            defaultOrder: -1,
        },
        {
            title: "LNG",
            value: function(portal) { 
                var coord = portal.getLatLng();
                return coord.lng; 
            },
            format: function(cell, portal, value) {
                $(cell)
                .addClass("alignR")
                .text(value);
            },
            defaultOrder: -1,
        },
        {
            title: "GUID",
            value: function(portal) {
                return portal.options.guid;
            },
            format: function(cell, portal, value) {
                $(cell)
                .addClass("alignR")
                .text(value);
            },
            defaultOrder: -1,
        },
    ];

    //fill the listPortals array with portals avaliable on the map (level filtered portals will not appear in the table)
	window.plugin.ownerlist.getPortals = function() {
        //filter : 0 = All, 1 = Neutral, 2 = Res, 3 = Enl, -x = all but x
        var retval=false;

        var displayBounds = map.getBounds();

        window.plugin.ownerlist.listPortals = [];

		$.each(window.portals, function(i, portal) {
			// eliminate offscreen portals (selected, and in padding)
			if(!displayBounds.contains(portal.getLatLng())) return true;

			retval=true;

			switch (portal.options.team) {
				case TEAM_RES:
					window.plugin.ownerlist.resP++;
					break;
				case TEAM_ENL:
					window.plugin.ownerlist.enlP++;
					break;
				default:
					window.plugin.ownerlist.neuP++;
			}

			// cache values and DOM nodes
			var obj = { portal: portal, values: [], sortValues: [] };

			var row = document.createElement('tr');
			row.className = TEAM_TO_CSS[portal.options.team];
			obj.row = row;

			var cell = row.insertCell(-1);
			cell.className = 'alignR';

			window.plugin.ownerlist.fields.forEach(function(field, i) {
				cell = row.insertCell(-1);

				var value = field.value(portal);
				obj.values.push(value);

				obj.sortValues.push(field.sortValue ? field.sortValue(value, portal) : value);

				if(field.format) {
					field.format(cell, portal, value);
				} else {
					cell.textContent = value;
				}
			});

            window.plugin.ownerlist.listPortals.push(obj);
            
//			if (portal.options.team == TEAM_ENL) { // Solo la agregamos a la tabla si el portal es ENL
//				if (portal.options.data.health > window.plugin.ownerlist.minHe){
//					window.plugin.ownerlist.listPortals.push(obj);
//				}
//			}
		});
		return retval;
	};

	window.plugin.ownerlist.displayPL = function() {
		var list;
		// plugins (e.g. bookmarks) can insert fields before the standard ones - so we need to search for the 'level' column
		window.plugin.ownerlist.sortBy = window.plugin.ownerlist.fields.map(function(f){return f.title;}).indexOf('Team');
		window.plugin.ownerlist.sortOrder = -1;
		window.plugin.ownerlist.enlP = 0;
		window.plugin.ownerlist.resP = 0;
		window.plugin.ownerlist.neuP = 0;
		window.plugin.ownerlist.filter = 3;
		window.plugin.ownerlist.descargarble = true;

		if (window.plugin.ownerlist.getPortals()) {
			list = window.plugin.ownerlist.portalTable(window.plugin.ownerlist.sortBy, window.plugin.ownerlist.sortOrder,window.plugin.ownerlist.filter);
		} else {
			list = $('<table class="noPortals"><tr><td>Nada q mostrar... ?m?s zoom? :-( </td></tr></table>');
		}

		if(window.useAndroidPanes()) {
			$('<div id="ownerlist" class="mobile">').append(list).appendTo(document.body);
		} else {
			dialog({
				html: $('<div id="ownerlist">').append(list),
				dialogClass: 'ui-dialog-ownerlist',
				title: 'Owner list: ' + window.plugin.ownerlist.listPortals.length + ' ' + (window.plugin.ownerlist.listPortals.length == 1 ? 'portal' : 'portals'),
				id: 'owner-list',
				width: 700
			});
		}
	};
	window.plugin.ownerlist.portalTable = function(sortBy, sortOrder, filter) {
		// save the sortBy/sortOrder/filter
		window.plugin.ownerlist.sortBy = sortBy;
		window.plugin.ownerlist.sortOrder = sortOrder;
		window.plugin.ownerlist.filter = filter;

		var portals = window.plugin.ownerlist.listPortals;
		var sortField = window.plugin.ownerlist.fields[sortBy];

		portals.sort(function(a, b) {
			var valueA = a.sortValues[sortBy];
			var valueB = b.sortValues[sortBy];

			if(sortField.sort) {
				return sortOrder * sortField.sort(valueA, valueB, a.portal, b.portal);
			}

			//FIXME: sort isn't stable, so re-sorting identical values can change the order of the list.
			//fall back to something constant (e.g. portal name?, portal GUID?),
			//or switch to a stable sort so order of equal items doesn't change
			return sortOrder *
				(valueA < valueB ? -1 :
				 valueA > valueB ?  1 :
				 0);
		});

		if(filter !== 0) {
			portals = portals.filter(function(obj) {
				return filter < 0 ? obj.portal.options.team+1 != -filter : obj.portal.options.team+1 == filter;
			});
		}

		var table, row, cell;
		var container = $('<div>');

		table = document.createElement('table');
		table.className = 'filter';
		container.append(table);

		row = table.insertRow(-1);

		var length = window.plugin.ownerlist.listPortals.length;

		// Desde ACA  recorre las 4 categor�as y va sumando las q corresponde

		["All", "Neutral", "Resistance", "Enlightened"].forEach(function(label, i) {
			cell = row.appendChild(document.createElement('th'));
			cell.className = 'filter' + label.substr(0, 3);
			cell.textContent = label+':';
			cell.title = 'Show only portals of this color';
			
			$(cell).click(function() {
				$('#ownerlist').empty().append(window.plugin.ownerlist.portalTable(sortBy, sortOrder, i));
			});
			
			cell = row.insertCell(-1);
			cell.className = 'filter' + label.substr(0, 3);
			if(i != 0) cell.title = 'Hide portals of this color';
			
			$(cell).click(function() {
				$('#ownerlist').empty().append(window.plugin.ownerlist.portalTable(sortBy, sortOrder, -i));
			});

			switch(i-1) {
				case -1:
					cell.textContent = length;
					break;
				case 0:
					cell.textContent = window.plugin.ownerlist.neuP + ' (' + Math.round(window.plugin.ownerlist.neuP/length*100) + '%)';
					break;
				case 1:
					cell.textContent = window.plugin.ownerlist.resP + ' (' + Math.round(window.plugin.ownerlist.resP/length*100) + '%)';
					break;
				case 2:
					cell.textContent = window.plugin.ownerlist.enlP + ' (' + Math.round(window.plugin.ownerlist.enlP/length*100) + '%)';
			}
		});
		// hasta ACA
		table = document.createElement('table');
		table.className = 'portals';
		container.append(table);

		var thead = table.appendChild(document.createElement('thead'));
		row = thead.insertRow(-1);

		cell = row.appendChild(document.createElement('th'));
		cell.textContent = '#';

		window.plugin.ownerlist.fields.forEach(function(field, i) {
			cell = row.appendChild(document.createElement('th'));
			cell.textContent = field.title;
			if(field.sort !== null) {
				
				cell.classList.add("sortable");
				
				if(i == window.plugin.ownerlist.sortBy) {
					cell.classList.add("sorted");
				}

				$(cell).click(function() {
					var order;
					if(i == sortBy) {
						order = -sortOrder;
					} else {
						order = field.defaultOrder < 0 ? -1 : 1;
					}

					$('#ownerlist').empty().append(window.plugin.ownerlist.portalTable(i, order, filter));
				});
			}
		});
		
		var Mylog = "";
        var record = [];
        var inRecord = 0;
		//Guardará unicamente los portales iluminados
		var portalesIlumindos = [];
		portals.forEach(function(obj, i) {
			
			var row = obj.row;
			
			if(row.parentNode) row.parentNode.removeChild(row);

			row.cells[0].textContent = i+1;
			
			//Mylog += row.cells[0].textContent + ",";  // ID
			Mylog += row.cells[1].textContent + ";"; 	// OWNER
			Mylog += row.cells[2].textContent + ";";	// NAME
			Mylog += row.cells[3].textContent + ";";	// LEVEL
			Mylog += "https://www.ingress.com/intel?ll=" + row.cells[7].textContent + "," + row.cells[8].textContent + "&z=17&pll=" + row.cells[7].textContent + "," + row.cells[8].textContent + ";";	// URL
			Mylog += row.cells[5].textContent + ";";	// HEALTH
			Mylog += row.cells[6].textContent + ";";	// RES
			Mylog += row.cells[7].textContent + ";";	// LAT
			Mylog += row.cells[8].textContent + ";";	// LNG
			Mylog += row.cells[9].textContent + "\r\n";	// GUID

            record[inRecord] = [];
            record[inRecord][0] = row.cells[1].textContent; // OWNER
			record[inRecord][1] = row.cells[2].textContent;	// NAME
			record[inRecord][2] = row.cells[3].textContent;	// LEVEL
			record[inRecord][3] = "https://www.ingress.com/intel?ll=" + row.cells[7].textContent + "," + row.cells[8].textContent + "&z=17&pll=" + row.cells[7].textContent + "," + row.cells[8].textContent;	// URL
			record[inRecord][4] = row.cells[5].textContent;	// HEALTH
			record[inRecord][5] = row.cells[6].textContent;	// RES
			record[inRecord][6] = row.cells[7].textContent;	// LAT
			record[inRecord][7] = row.cells[8].textContent;	// LNG
			record[inRecord][8] = row.cells[9].textContent;	// GUID
            inRecord++;
			table.appendChild(row);
		});

		//container.append('<div class="disclaimer">Click on portals table headers to sort by that column. '
		//                 + 'Click on <b>All, Neutral, Resistance, Enlightened</b> to only show portals owner by that faction or on the number behind the factions to show all but those portals.</div>');

		if (window.plugin.ownerlist.descargarble) {
			var d = new Date();

			var link = document.createElement('a');
			link.textContent = "Descargar";
			//.append('<a onclick="window.plugin.ownerlist.displayPL()" title="Display a list of portals owners in the current view [o]" accesskey="o">OWNERS</a>');
			link.setAttribute('download', d.getTime() + "_portalowner.js");
			link.setAttribute('href', 'data:' + 'text/plain'  +  ';charset=utf-8,' + record); // container.html() // table.innerHTML
			// link.click(); 
            console.log(JSON.stringify(record));
			container.append(link);
			
			//window.plugin.ownerlist.send2server(d.getTime(), encodeURIComponent(JSON.stringify(record)));
            window.plugin.ownerlist.send2server(d.getTime(), JSON.stringify(record));
		}
		
		

		return container;
	}

	// portal link - single click: select portal
	//               double click: zoom to and select portal
	// code from getPortalLink function by xelio from iitc: AP List - https://raw.github.com/breunigs/ingress-intel-total-conversion/gh-pages/plugins/ap-list.user.js
	window.plugin.ownerlist.getPortalLink = function(portal) {
		var coord = portal.getLatLng();
		var perma = '/intel?ll='+coord.lat+','+coord.lng+'&z=17&pll='+coord.lat+','+coord.lng;

		// jQuery's event handlers seem to be removed when the nodes are remove from the DOM
		var link = document.createElement("a");
		link.textContent = portal.options.data.title;
		link.href = perma;
		link.addEventListener("click", function(ev) {
			renderPortalDetails(portal.options.guid);
			ev.preventDefault();
			return false;
		}, false);
		link.addEventListener("dblclick", function(ev) {
			zoomToAndShowPortal(portal.options.guid, [coord.lat, coord.lng]);
			ev.preventDefault();
			return false;
		});
		return link;
	}

	window.plugin.ownerlist.onPaneChanged = function(pane) {
		if(pane == "plugin-ownerlist") {
			window.plugin.ownerlist.displayPL();
		} else {
			$("#ownerlist").remove()
		}
	};

	var setup =  function() {
		if(window.useAndroidPanes()) {
			android.addPane("plugin-ownerlist", "Owner list", "ic_action_paste");
			addHook("paneChanged", window.plugin.ownerlist.onPaneChanged);
		} else {
			$('#toolbox').append('<a onclick="window.plugin.ownerlist.displayPL()" title="Display a list of portals owners in the current view [o]" accesskey="o">OWNERS</a>');
		}

		$("<style>")
		.prop("type", "text/css")
		.html("#ownerlist.mobile {\n  background: transparent;\n  border: 0 none !important;\n  height: 100% !important;\n  width: 100% !important;\n  left: 0 !important;\n  top: 0 !important;\n  position: absolute;\n  overflow: auto;\n}\n\n#ownerlist table {\n  margin-top: 5px;\n  border-collapse: collapse;\n  empty-cells: show;\n  width: 100%;\n  clear: both;\n}\n\n#ownerlist table td, #ownerlist table th {\n  background-color: #1b415e;\n  border-bottom: 1px solid #0b314e;\n  color: white;\n  padding: 3px;\n}\n\n#ownerlist table th {\n  text-align: center;\n}\n\n#ownerlist table .alignR {\n  text-align: right;\n}\n\n#ownerlist table.portals td {\n  white-space: nowrap;\n}\n\n#ownerlist table th.sortable {\n  cursor: pointer;\n}\n\n#ownerlist table .portalTitle {\n  min-width: 120px !important;\n  max-width: 240px !important;\n  overflow: hidden;\n  white-space: nowrap;\n  text-overflow: ellipsis;\n}\n\n#ownerlist .sorted {\n  color: #FFCE00;\n}\n\n#ownerlist table.filter {\n  table-layout: fixed;\n  cursor: pointer;\n  border-collapse: separate;\n  border-spacing: 1px;\n}\n\n#ownerlist table.filter th {\n  text-align: left;\n  padding-left: 0.3em;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n\n#ownerlist table.filter td {\n  text-align: right;\n  padding-right: 0.3em;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n\n#ownerlist .filterNeu {\n  background-color: #666;\n}\n\n#ownerlist table tr.res td, #ownerlist .filterRes {\n  background-color: #005684;\n}\n\n#ownerlist table tr.enl td, #ownerlist .filterEnl {\n  background-color: #017f01;\n}\n\n#ownerlist table tr.none td {\n  background-color: #000;\n}\n\n#ownerlist .disclaimer {\n  margin-top: 10px;\n  font-size: 10px;\n}\n\n#ownerlist.mobile table.filter tr {\n  display: block;\n  text-align: center;\n}\n#ownerlist.mobile table.filter th, #ownerlist.mobile table.filter td {\n  display: inline-block;\n  width: 22%;\n}\n\n")
		.appendTo("head");
	}

	// PLUGIN END //////////////////////////////////////////////////////////
	setup.info = plugin_info; //add the script info data to the function as a property
	if(!window.bootPlugins) window.bootPlugins = [];
	window.bootPlugins.push(setup);
	
	// if IITC has already booted, immediately run the 'setup' function
	if(window.iitcLoaded && typeof setup === 'function') setup();
} // wrapper end


// inject code into site context
var script = document.createElement('script');
var info = {};
if (typeof GM_info !== 'undefined' && GM_info && GM_info.script) info.script = { version: GM_info.script.version, name: GM_info.script.name, description: GM_info.script.description };
script.appendChild(document.createTextNode('('+ wrapper +')('+JSON.stringify(info)+');'));
(document.body || document.head || document.documentElement).appendChild(script);