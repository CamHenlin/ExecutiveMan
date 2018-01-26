// polyfill touch functionality on browsers that have pointer functionality (that piece of trash internet explorer)
// this thing is mostly just a hack on handjs, but does the reverse
// could use some cleanup
// cameron henlin, cam.henlin@gmail.com

(function() {
	if (typeof(window.ontouchstart) === "object") {
		return;
	}

	var userAgent = navigator.userAgent;
	if (userAgent.match(/iPad/i) || userAgent.match(/iPhone/i) || userAgent.match(/iPod/i)) {
		return;
	} else if (userAgent.match(/Android/i)) {
		return;
	}

	// console.log("polyfill!");
	// event listener intercept
	var supportedEventsNames = ["touchstart", "touchmove", "touchend", "touchcancel", "touchleave"];
	var upperCaseEventsNames = ["TouchStart", "TouchMove", "TouchEnd", "TouchCancel", "TouchLeave"];
	// polyfill custom event
	var CustomEvent;

	CustomEvent = function(event, params) {
		var evt;
		params = params || {
			bubbles: false,
			cancelable: false,
			detail: undefined
		};
		evt = document.createEvent("CustomEvent");
		evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
		return evt;
	};

	CustomEvent.prototype = window.Event.prototype;

	window.CustomEvent = CustomEvent;

	var previousTargets = {};

	var checkPreventDefault = function(node) {
		while (node && !node.handJobjs_forcePreventDefault) {
			node = node.parentNode;
		}
		return !!node || window.handJobjs_forcePreventDefault;
	};

	var generateTouchEventProxy = function(name, touchPoint, target, eventObject, canBubble, relatedTarget) {
		generateTouchClonedEvent(touchPoint, name, canBubble, target, relatedTarget);
	};

	// Touch events
	var generateTouchClonedEvent = function(sourceEvent, newName, canBubble, target, relatedTarget) {
		// console.log("generating touch cloned");
		var touchHandler = function(event) {
			// console.log("touch!");
			event.touches = [];
			event.touches.length = 1;
			event.touches[0] = event;
			event.touches[0].identifier = event.pointerId;

			var eventType = "";
			if (event.type === "pointerdown") {
				eventType = "touchstart";
			} else if (event.type === "pointermove") {
				eventType = "touchmove";
			}

			event.type = eventType;
			var touchEvent = new CustomEvent(eventType, {
				bubbles: true,
				cancelable: true
			});
			touchEvent.touches = event.touches;
			touchEvent.type = eventType;

			return touchEvent;
		};

		var touchChangedHandler = function(event) {
			// console.log("touchchanged!");
			event.changedTouches = [];
			event.changedTouches.length = 1;
			event.changedTouches[0] = event;
			event.changedTouches[0].identifier = event.pointerId;

			if (event.type === "pointerup") {
				eventType = "touchend";
			} else if (event.type === "pointercancel") {
				eventType = "touchcancel";
			} else if (event.type === "pointerleave") {
				eventType = "touchleave";
			}

			event.type = eventType;
			var touchEvent = new CustomEvent(eventType, {
				bubbles: true,
				cancelable: true
			});
			touchEvent.changedTouches = event.changedTouches;
			touchEvent.type = eventType;

			return touchEvent;
		};

		var evObj;
		if (sourceEvent.type === "pointerdown" || sourceEvent.type === "pointermove") {
			evObj = touchHandler(sourceEvent);
		} else {
			evObj = touchChangedHandler(sourceEvent);
		}

		// PreventDefault
		evObj.preventDefault = function() {
			if (sourceEvent.preventDefault !== undefined)
				sourceEvent.preventDefault();
		};

		// Fire event
		// console.log("dispatching!");
		sourceEvent.target.dispatchEvent(evObj);
	};

	// Intercept addEventListener calls by changing the prototype
	var interceptAddEventListener = function(root) {
		var current = root.prototype ? root.prototype.addEventListener : root.addEventListener;

		// console.log("intercepting add event listener!");
		// console.log(root);

		var customAddEventListener = function(name, func, capture) {
			// console.log("customAddEventListener");
			// console.log(name);

			if (supportedEventsNames.indexOf(name) !== -1) {
				// console.log("setting touch aware...");
				setTouchAware(this, name, true);
			}
			current.call(this, name, func, capture);
		};


		if (root.prototype) {
			root.prototype.addEventListener = customAddEventListener;
		} else {
			root.addEventListener = customAddEventListener;
		}
	};

	// Hooks
	interceptAddEventListener(window);
	interceptAddEventListener(window.HTMLElement || window.Element);
	interceptAddEventListener(document);
	interceptAddEventListener(HTMLBodyElement);
	interceptAddEventListener(HTMLDivElement);
	interceptAddEventListener(HTMLImageElement);
	interceptAddEventListener(HTMLUListElement);
	interceptAddEventListener(HTMLAnchorElement);
	interceptAddEventListener(HTMLLIElement);
	interceptAddEventListener(HTMLTableElement);
	if (window.HTMLSpanElement) {
		interceptAddEventListener(HTMLSpanElement);
	}
	if (window.HTMLCanvasElement) {
		interceptAddEventListener(HTMLCanvasElement);
	}
	if (window.SVGElement) {
		interceptAddEventListener(SVGElement);
	}

	var handleOtherEvent = function(eventObject, name) {
		// console.log("handle other event");
		if (eventObject.preventManipulation) {
			eventObject.preventManipulation();
		}

		generateTouchClonedEvent(touchPoint, name);
	};

	// Intercept removeEventListener calls by changing the prototype
	var interceptRemoveEventListener = function(root) {
		var current = root.prototype ? root.prototype.removeEventListener : root.removeEventListener;

		var customRemoveEventListener = function(name, func, capture) {
			// Branch when a PointerXXX is used
			if (supportedEventsNames.indexOf(name) !== -1) {
				removeTouchAware(this, name);
			}

			current.call(this, name, func, capture);
		};

		if (root.prototype) {
			root.prototype.removeEventListener = customRemoveEventListener;
		} else {
			root.removeEventListener = customRemoveEventListener;
		}
	};

	interceptRemoveEventListener(window);
	interceptRemoveEventListener(window.HTMLElement || window.Element);
	interceptRemoveEventListener(document);
	interceptRemoveEventListener(HTMLBodyElement);
	interceptRemoveEventListener(HTMLDivElement);
	interceptRemoveEventListener(HTMLImageElement);
	interceptRemoveEventListener(HTMLUListElement);
	interceptRemoveEventListener(HTMLAnchorElement);
	interceptRemoveEventListener(HTMLLIElement);
	interceptRemoveEventListener(HTMLTableElement);
	if (window.HTMLSpanElement) {
		interceptRemoveEventListener(HTMLSpanElement);
	}
	if (window.HTMLCanvasElement) {
		interceptRemoveEventListener(HTMLCanvasElement);
	}
	if (window.SVGElement) {
		interceptRemoveEventListener(SVGElement);
	}

	var removeTouchAware = function(item, eventName) {
		// If item is already touch aware, do nothing
		if (item.ontouchdown !== undefined) {
			return;
		}

		// Chrome, Firefox
		if (item.ontouchstart !== undefined) {
			switch (eventName.toLowerCase()) {
				case "touchstart":
					item.removeEventListener("pointerdown", function(evt) {
						handleOtherEvent(evt, eventName);
					});
					break;
				case "touchmove":
					item.removeEventListener("pointermove", function(evt) {
						handleOtherEvent(evt, eventName);
					});
					break;
				case "touchend":
					item.removeEventListener("pointerup", function(evt) {
						handleOtherEvent(evt, eventName);
					});
					break;
				case "touchcancel":
					item.removeEventListener("pointercancel", function(evt) {
						handleOtherEvent(evt, eventName);
					});
					break;
			}
		}
	};

	var registerOrUnregisterEvent = function(item, name, func, enable) {
		// console.log("registerOrUnregisterEvent");
		if (item.__handJobjsRegisteredEvents === undefined) {
			item.__handJobjsRegisteredEvents = [];
		}

		if (enable) {
			if (item.__handJobjsRegisteredEvents[name] !== undefined) {
				item.__handJobjsRegisteredEvents[name] ++;
				return;
			}

			item.__handJobjsRegisteredEvents[name] = 1;
			// console.log("adding event " + name);
			item.addEventListener(name, func, false);
		} else {

			if (item.__handJobjsRegisteredEvents.indexOf(name) !== -1) {
				item.__handJobjsRegisteredEvents[name] --;

				if (item.__handJobjsRegisteredEvents[name] !== 0) {
					return;
				}
			}
			// console.log("removing event");
			item.removeEventListener(name, func);
			item.__handJobjsRegisteredEvents[name] = 0;
		}
	};

	var getPrefixEventName = function(prefix, eventName) {
		var upperCaseIndex = supportedEventsNames.indexOf(eventName);
		var newEventName = prefix + upperCaseEventsNames[upperCaseIndex];

		return newEventName;
	};

	var setTouchAware = function(item, eventName, enable) {
		// console.log("setTouchAware " + enable + " " +eventName);
		// Leaving tokens
		if (!item.__handJobjsGlobalRegisteredEvents) {
			item.__handJobjsGlobalRegisteredEvents = [];
		}
		if (enable) {
			if (item.__handJobjsGlobalRegisteredEvents[eventName] !== undefined) {
				item.__handJobjsGlobalRegisteredEvents[eventName] ++;
				return;
			}
			item.__handJobjsGlobalRegisteredEvents[eventName] = 1;

			// console.log(item.__handJobjsGlobalRegisteredEvents[eventName]);
		} else {
			if (item.__handJobjsGlobalRegisteredEvents[eventName] !== undefined) {
				item.__handJobjsGlobalRegisteredEvents[eventName] --;
				if (item.__handJobjsGlobalRegisteredEvents[eventName] < 0) {
					item.__handJobjsGlobalRegisteredEvents[eventName] = 0;
				}
			}
		}

		var nameGenerator = function(name) {
			return name;
		}; // easier than doing this right and replacing all the references
		var eventGenerator = generateTouchClonedEvent;

		//switch (eventName) {
		//    case "touchenter":
		//    	// console.log("touchenter");
		//    	break;
		//    case "touchleave":
		//    	// console.log("touchleave");
		var targetEvent = nameGenerator(eventName);
		if (item['on' + targetEvent.toLowerCase()] !== undefined) {
			registerOrUnregisterEvent(item, targetEvent, function(evt) {
				eventGenerator(evt, eventName);
			}, enable);
		}
		//        break;
		//}
	};

	var checkEventRegistration = function(node, eventName) {
		// console.log("checkEventRegistration");
		return node.__handJobjsGlobalRegisteredEvents && node.__handJobjsGlobalRegisteredEvents[eventName];
	};

	var findEventRegisteredNode = function(node, eventName) {
		// console.log("findEventRegisteredNode");
		while (node && !checkEventRegistration(node, eventName))
			node = node.parentNode;
		if (node)
			return node;
		else if (checkEventRegistration(window, eventName))
			return window;
	};

	var generateTouchEventProxyIfRegistered = function(eventName, touchPoint, target, eventObject, canBubble, relatedTarget) { // Check if user registered this event
		// console.log("generateTouchEventProxyIfRegistered");
		if (findEventRegisteredNode(target, eventName)) {
			generateTouchEventProxy(eventName, touchPoint, target, eventObject, canBubble, relatedTarget);
		}
	};


	function getDomUpperHierarchy(node) {
		var nodes = [];
		if (node) {
			nodes.unshift(node);
			while (node.parentNode) {
				nodes.unshift(node.parentNode);
				node = node.parentNode;
			}
		}
		return nodes;
	}

	function getFirstCommonNode(node1, node2) {
		var parents1 = getDomUpperHierarchy(node1);
		var parents2 = getDomUpperHierarchy(node2);

		var lastmatch = null;
		while (parents1.length > 0 && parents1[0] == parents2.shift())
			lastmatch = parents1.shift();
		return lastmatch;
	}

	//generateProxy receives a node to dispatch the event
	function dispatchPointerEnter(currentTarget, relatedTarget, generateProxy) {
		// console.log("dispatchPointerEnter");
		var commonParent = getFirstCommonNode(currentTarget, relatedTarget);
		var node = currentTarget;
		var nodelist = [];
		while (node && node != commonParent) { //target range: this to the direct child of parent relatedTarget
			if (checkEventRegistration(node, "touchenter")) //check if any parent node has pointerenter
				nodelist.push(node);
			node = node.parentNode;
		}
		while (nodelist.length > 0)
			generateProxy(nodelist.pop());
	}

	//generateProxy receives a node to dispatch the event
	function dispatchPointerLeave(currentTarget, relatedTarget, generateProxy) {
		// console.log("dispatchPointerLeave");
		var commonParent = getFirstCommonNode(currentTarget, relatedTarget);
		var node = currentTarget;
		while (node && node != commonParent) { //target range: this to the direct child of parent relatedTarget
			if (checkEventRegistration(node, "touchleave")) //check if any parent node has pointerleave
				generateProxy(node);
			node = node.parentNode;
		}
	}

	// Handling events on window to prevent unwanted super-bubbling
	// All mouse events are affected by touch fallback
	function applySimpleEventTunnels(nameGenerator, eventGenerator) {
		// console.log("applySimpleEventTunnels");
		["touchstart", "touchmove", "touchend", "touchmove", "touchleave"].forEach(function(eventName) {
			window.addEventListener(nameGenerator(eventName), function(evt) {
				if (!touching && findEventRegisteredNode(evt.target, eventName))
					eventGenerator(evt, eventName, true);
			});
		});
		if (window['on' + nameGenerator("touchenter").toLowerCase()] === undefined)
			window.addEventListener(nameGenerator("touchmove"), function(evt) {
				if (touching)
					return;
				var foundNode = findEventRegisteredNode(evt.target, "touchenter");
				if (!foundNode || foundNode === window)
					return;
				else if (!foundNode.contains(evt.relatedTarget)) {
					dispatchPointerEnter(foundNode, evt.relatedTarget, function(targetNode) {
						eventGenerator(evt, "touchenter", false, targetNode, evt.relatedTarget);
					});
				}
			});
		if (window['on' + nameGenerator("touchleave").toLowerCase()] === undefined)
			window.addEventListener(nameGenerator("touchleave"), function(evt) {
				if (touching)
					return;
				var foundNode = findEventRegisteredNode(evt.target, "touchleave");
				if (!foundNode || foundNode === window)
					return;
				else if (!foundNode.contains(evt.relatedTarget)) {
					dispatchPointerLeave(foundNode, evt.relatedTarget, function(targetNode) {
						eventGenerator(evt, "touchleave", false, targetNode, evt.relatedTarget);
					});
				}
			});
	}

	(function() {
		if (typeof(window.ontouchstart) === "object") {
			return;
		}
		// Handling move on window to detect pointerleave/out/over
		if (typeof(window.ontouchstart) === "undefined") {
			window.addEventListener('pointerdown', function(eventObject) {
				// console.log("pointerdownfired");
				var touchPoint = eventObject;
				previousTargets[touchPoint.identifier] = touchPoint.target;
				generateTouchEventProxyIfRegistered("touchenter", touchPoint, touchPoint.target, eventObject, true);

				//pointerenter should not be bubbled
				dispatchPointerEnter(touchPoint.target, null, function(targetNode) {
					generateTouchEventProxy("touchenter", touchPoint, targetNode, eventObject, false);
				});

				generateTouchEventProxyIfRegistered("touchstart", touchPoint, touchPoint.target, eventObject, true);

			});

			window.addEventListener('pointerup', function(eventObject) {
				// console.log("pointer up fired");
				var touchPoint = eventObject;
				var currentTarget = previousTargets[touchPoint.identifier];

				generateTouchEventProxyIfRegistered("touchend", touchPoint, currentTarget, eventObject, true);
				generateTouchEventProxyIfRegistered("touchleave", touchPoint, currentTarget, eventObject, true);

				//pointerleave should not be bubbled
				dispatchPointerLeave(currentTarget, null, function(targetNode) {
					generateTouchEventProxy("touchleave", touchPoint, targetNode, eventObject, false);
				});

			});

			window.addEventListener('pointermove', function(eventObject) {
				// console.log("pointer move fired");
				var touchPoint = eventObject;
				var currentTarget = previousTargets[touchPoint.identifier];
				// If force preventDefault
				if (currentTarget && checkPreventDefault(currentTarget) === true)
					eventObject.preventDefault();

				generateTouchEventProxyIfRegistered("touchmove", touchPoint, currentTarget, eventObject, true);

			});
		}
	})();
})();