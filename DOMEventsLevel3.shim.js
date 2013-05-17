/** @license DOM Keyboard Event Level 3 polyfill | @version 0.4.4 | MIT License | github.com/termi */

// ==ClosureCompiler==
// @compilation_level ADVANCED_OPTIMIZATIONS
// @warning_level VERBOSE
// @jscomp_warning missingProperties
// @output_file_name DOMEventsLevel3.shim.min.js
// @check_types
// ==/ClosureCompiler==
/**
 * @version 0.4
 * TODO::
 * 0. refactoring and JSDoc's
 * 1. Bug fixing:
 *   - FF: char "[" (keyCode:91) or "\"(keyCode:92) for key "OS"
 * 2. repeat property
 * 3. preventDefault for keypress for special keys (Ctrl+c, shift+a, etc) for Opera lt 12.50
 *
 * TODO Links:
 * 1. http://help.dottoro.com/ljlwfxum.php | onkeypress event | keypress event
 * 2. http://api.jquery.com/event.preventDefault/#comment-31391501 | Bug in Opera with keypress
 * 3. http://www.w3.org/TR/DOM-Level-3-Events/#events-keyboard-event-order
 * 4. http://www.quirksmode.org/dom/events/keys.html
 * 5. http://stackoverflow.com/questions/9200589/keypress-malfunction-in-opera
 * 6. http://code.google.com/p/closure-library/source/browse/trunk/closure/goog/events/keyhandler.js
 * 7. http://www.javascripter.net/faq/keycodes.htm
 /*
 http://www.w3.org/TR/DOM-Level-3-Events/#events-KeyboardEvent
 http://dev.w3.org/2006/webapi/DOM-Level-3-Events/html/DOM3-Events.html#events-KeyboardEvent
 */

/*
 http://lists.w3.org/Archives/Public/www-dom/2010JanMar/0062.html
 http://w3c-test.org/webapps/DOMEvents/tests/submissions/Microsoft/converted/EventObject.multiple.dispatchEvent.html
 Test Description: An event object may be properly dispatched multiple times while also allowing to prevent the event objects propagation prior to the event dispatch.
 var evt = document.createEvent("Event");
 evt.initEvent("foo", true, true);
 var el = document.createElement("_");
 var evtCount = 0;
 el.addEventListener(evt.type, function(e){ evtCount++; e.stopPropagation() });
 el.dispatchEvent(evt);
 el.dispatchEvent(evt);
 console.log(evtCount);
 PASS: IE9, FireFox
 FAILS: Chrome, Opera, Safari
*/

// [[[|||---=== GCC DEFINES START ===---|||]]]
/** @define {boolean} */
var __GCC__ECMA_SCRIPT_SHIMS__ = false;
//IF __GCC__ECMA_SCRIPT_SHIMS__ == true [
//TODO::
//]
var __GCC__NEW_KEYBOARD_EVENTS_PROPOSAL__ = true;
//more info: http://lists.w3.org/Archives/Public/www-dom/2012JulSep/0108.html
//]
// [[[|||---=== GCC DEFINES END ===---|||]]]

if( !function( global ) {
	try {
		return (new global["KeyboardEvent"]( "keyup", {"key": "a"} ))["key"] == "a";
	}
	catch ( __e__ ) {
		return false;
	}
}( this ) )void function( ) {

	var global = this

		, _DOM_KEY_LOCATION_STANDARD = 0x00 // Default or unknown location
		, _DOM_KEY_LOCATION_LEFT = 0x01 // e.g. Left Alt key
		, _DOM_KEY_LOCATION_RIGHT = 0x02 // e.g. Right Alt key
		, _DOM_KEY_LOCATION_NUMPAD = 0x03 // e.g. Numpad 0 or +
		, _DOM_KEY_LOCATION_MOBILE = 0x04
		, _DOM_KEY_LOCATION_JOYSTICK = 0x05

		, _Event_prototype = global["Event"].prototype

		, _KeyboardEvent_prototype = global["KeyboardEvent"] && global["KeyboardEvent"].prototype || _Event_prototype

		, _Event_prototype__native_key_getter

		, _Event_prototype__native_char_getter

		, _Event_prototype__native_location_getter

		, _Event_prototype__native_keyCode_getter

		, _Object_defineProperty = Object.defineProperty || function(obj, prop, val) {
			if( "value" in val ) {
				obj[prop] = val["value"];
				return;
			}

			if( "get" in val ) {
				obj.__defineGetter__(prop, val["get"]);
			}
			if( "set" in val ) {
				obj.__defineSetter__(prop, val["set"]);
			}
		}

		, _Object_getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor

		, getObjectPropertyGetter = function( obj, prop ) {
			/* FF throw Error{message: "Illegal operation on WrappedNative prototype object", name: "NS_ERROR_XPC_BAD_OP_ON_WN_PROTO", result: 2153185292}
			 *  when Object.getOwnPropertyDescriptor(KeyboardEvent.prototype, "location")
			 *  so using __lookupGetter__ instead
			 */
			return "__lookupGetter__" in obj ?
				obj.__lookupGetter__( prop ) :
				_Object_getOwnPropertyDescriptor ? (_Object_getOwnPropertyDescriptor( obj, prop ) || {})["get"] : void 0
			;
		}

		, KEYBOARD_EVENTS = {
			"keydown": null,
			"keyup": null,
			"keypress": null
		}
		, UUID = 1
		/** @const @type {string} */
		, _event_handleUUID = "_h_9e2"
		/** @const @type {string} */
		, _event_eventsUUID = "_e_8vj"
		/** @const @type {string} */
		, _shim_event_keyCodeUUID = _event_handleUUID + "__keyCode"

		, _keyboardEvent_properties_dictionary = {
			"char": "",
			"key": "",
			"location": _DOM_KEY_LOCATION_STANDARD,
			"ctrlKey": false,
			"shiftKey": false,
			"altKey": false,
			"metaKey": false,
			"repeat": false,
			"locale": "",

			"detail": 0,
			"bubbles": false,
			"cancelable": false
		}

		/** @const
		 * Opera lt 12.10 has no event.stopImmediatePropagation
		 * */
		, _Event_has_stopImmediatePropagation = "stopImmediatePropagation" in document.createEvent( "Event" )

		/** @const */
		, _Array_slice = Array.prototype.slice

		/** Use native "bind" or unsafe bind for service and performance needs
		 * @const
		 * @param {Object} object
		 * @param {...} var_args
		 * @return {Function} */
		, _unSafeBind = Function.prototype.bind || function( object, var_args ) {
			var __method = this
				, args = _Array_slice.call( arguments, 1 )
			;
			return function() {
				return __method.apply( object, args.concat( _Array_slice.call( arguments ) ) );
			}
		}

		/** @const */
		, _hasOwnProperty = _unSafeBind.call( Function.prototype.call, Object.prototype.hasOwnProperty )

		, _try_initKeyboardEvent = true

		, _getter_KeyboardEvent_location

		, _initKeyboardEvent_type = (function( _createEvent ) {
			try {
				var e = _createEvent.call(document,  "KeyboardEvent" );//Old browsers unsupported "KeyboardEvent"

				e.initKeyboardEvent(
					"keyup" // in DOMString typeArg
					, false // in boolean canBubbleArg
					, false // in boolean cancelableArg
					, global // in views::AbstractView viewArg
					, "+" // [test]in DOMString keyIdentifierArg | webkit event.keyIdentifier | IE9 event.char | IE9 event.key
					, 3 // [test]in unsigned long keyLocationArg | webkit event.keyIdentifier | IE9 event.key | IE9 event.location
					, true // [test]in boolean ctrlKeyArg | webkit event.shiftKey | old webkit event.ctrlKey | IE9 event.modifiersList
					, false // [test]shift | alt
					, true // [test]shift | alt
					, false // meta
					, false // altGraphKey
				);
				return ((e["keyIdentifier"] || e["key"]) == "+" && (e["keyLocation"] || e["location"]) == 3) && (
					e.ctrlKey ?
						e.altKey ? // webkit
							1
							:
							3
						:
						e.shiftKey ?
							2 // webkit
							:
							4 // IE9/IE10
					)
					|| (e["char"] == "+") && 5 //https://developer.mozilla.org/en-US/docs/DOM/KeyboardEvent#initKeyboardEvent()
					|| 9 // FireFox|w3c
				;
			}
			catch ( __e__ ) {
				return 0
			}
		})( document.createEvent )

		, canOverwrite_keyCode

		, canOverwrite_which

		, testKeyboardEvent = function() {
			try {
				return this && new this( "keyup", {"key": "a", "char": "b"} ) || {}
			} catch ( e ) {
				return {}
			}
		}.call( global["KeyboardEvent"] )

		, newKeyboadrEvent_key_property_proposal__getKey_

		, __Property_descriptor__ = {
			"enumerable": false
			, "configurable": true
			, "writable": true
		}
	;

	if( _Object_getOwnPropertyDescriptor ) {//Modern browser
		//IE9 has key property in KeyboardEvent.prototype otherwise Opera has no properties in KeyboardEvent.prototype
		_Event_prototype__native_key_getter = getObjectPropertyGetter( _KeyboardEvent_prototype, "key" ) || getObjectPropertyGetter( testKeyboardEvent, "key" );
		//IE9 has char property in KeyboardEvent.prototype otherwise Opera has no properties in KeyboardEvent.prototype
		_Event_prototype__native_char_getter = getObjectPropertyGetter( _KeyboardEvent_prototype, "char" ) || getObjectPropertyGetter( testKeyboardEvent, "char" );
		//IE9 has location property in KeyboardEvent.prototype otherwise Opera has no properties in KeyboardEvent.prototype
		_Event_prototype__native_location_getter = getObjectPropertyGetter( _KeyboardEvent_prototype, "location" ) || getObjectPropertyGetter( testKeyboardEvent, "location" );
		//IE9 doesn't allow overwrite "keyCode" and "charCode"
		_Event_prototype__native_keyCode_getter = getObjectPropertyGetter( _KeyboardEvent_prototype, "keyCode" );
	}

	/*

	 [OLD key-values-list] https://developer.mozilla.org/en/DOM/KeyboardEvent#Key_names_and_Char_values
	 [key-values-list] http://www.w3.org/TR/DOM-Level-3-Events/#key-values-list

	 Key | Char | Typical Usage (Informative) | Category (Informative)
	 'Attn' |  | The Attention (Attn) key. | General
	 'Apps' |  | Toggle display of available (interactive) application list. | General
	 'Crsel' |  | The Cursor Select (Crsel) key. | General
	 'ExSel' |  | The Extend Selection (ExSel) key. | General
	 'F1' |  | The F1 key, a general purpose function key, as index 1. | General
	 'F2' |  | The F2 key, a general purpose function key, as index 2. | General
	 'F3' |  | The F3 key, a general purpose function key, as index 3. | General
	 'F4' |  | The F4 key, a general purpose function key, as index 4. | General
	 'F5' |  | The F5 key, a general purpose function key, as index 5. | General
	 'F6' |  | The F6 key, a general purpose function key, as index 6. | General
	 'F7' |  | The F7 key, a general purpose function key, as index 7. | General
	 'F8' |  | The F8 key, a general purpose function key, as index 8. | General
	 'F9' |  | The F9 key, a general purpose function key, as index 9. | General
	 'F10' |  | The F10 key, a general purpose function key, as index 10. | General
	 'F11' |  | The F11 key, a general purpose function key, as index 11. | General
	 'F12' |  | The F12 key, a general purpose function key, as index 12. | General
	 'F13' |  | The F13 key, a general purpose function key, as index 13. | General
	 'F14' |  | The F14 key, a general purpose function key, as index 14. | General
	 'F15' |  | The F15 key, a general purpose function key, as index 15. | General
	 'F16' |  | The F16 key, a general purpose function key, as index 16. | General
	 'F17' |  | The F17 key, a general purpose function key, as index 17. | General
	 'F18' |  | The F18 key, a general purpose function key, as index 18. | General
	 'F19' |  | The F19 key, a general purpose function key, as index 19. | General
	 'F20' |  | The F20 key, a general purpose function key, as index 20. | General
	 'F21' |  | The F21 key, a general purpose function key, as index 21. | General
	 'F22' |  | The F22 key, a general purpose function key, as index 22. | General
	 'F23' |  | The F23 key, a general purpose function key, as index 23. | General
	 'F24' |  | The F24 key, a general purpose function key, as index 24. | General
	 'LaunchApplication1' |  | The Start Application One key. | General
	 'LaunchApplication2' |  | The Start Application Two key. | General
	 'LaunchMail' |  | The Start Mail key. | General
	 'List' |  | Toggle display listing of currently available content or programs. | General
	 'Props' |  | The properties (props) key. | General
	 'Soft1' |  | General purpose virtual function key, as index 1. | General
	 'Soft2' |  | General purpose virtual function key, as index 2. | General
	 'Soft3' |  | General purpose virtual function key, as index 3. | General
	 'Soft4' |  | General purpose virtual function key, as index 4. | General
	 'Accept' |  | The Accept (Commit, OK) key. Accept current option or input method sequence conversion. | UI
	 'Again' |  | The Again key, to redo or repeat an action. | UI
	 'Enter' |  | The Enter key, to activate current selection or accept current input. Note: This key value is also used for the 'Return' (Macintosh numpad) key. | UI
	 'Find' |  | The Find key. | UI
	 'Help' |  | Toggle display of help information. | UI
	 'Info' |  | Toggle display of information about currently selected context or media. | UI
	 'Menu' |  | Toggle display of content or system menu, if available. | UI
	 'ScrollLock' |  | The Scroll Lock key, to toggle between scrolling and cursor movement modes. | UI
	 'Execute' |  | The Execute key. | UI
	 'Cancel' | '\u0018' | The Cancel key. | UI
	 'Esc' | '\u001B' | The Escape (Esc) key, to initiate an escape sequence. | UI
	 'Exit' |  | Exit current state or current application (as appropriate). | UI
	 'Zoom' |  | Toggle between full-screen and scaled content, or alter magnification level. | UI
	 'Separator' |  | The Separator key, for context-sensitive text separators. | Character
	 'Spacebar' | '\u0020' | The Space (Spacebar) key (' '). | Character
	 'Add' | '\u002B' | The Add key, or plus sign ('+'). Note: the Add key is usually found on the numeric keypad (e.g., the 10-key) on typical 101-key keyboards and usually requires the 'NumLock' state to be enabled. | Character / Math
	 'Subtract' | '\u2212' | The Subtract key, or minus sign ('−'). Note: the Subtract key is usually found on the numeric keypad (e.g., the 10-key) on typical 101-key keyboards and usually requires the 'NumLock' state to be enabled. | Character / Math
	 'Multiply' | '\u002A' | The Multiply key, or multiplication sign ('*'). Note: the Multiply key is usually found on the numeric keypad (e.g., the 10-key) on typical 101-key keyboards and usually requires the 'NumLock' state to be enabled. Note: This key value can be represented by different characters depending on context, including  '\u002A' (ASTERISK, '*') or '\u00D7' (MULTIPLICATION SIGN, '×'). | Character / Math
	 'Divide' | '\u00F7' | The Divide key, or division sign ('÷'). Note: the Divide key is usually found on the numeric keypad (e.g., the 10-key) on typical 101-key keyboards and usually requires the 'NumLock' state to be enabled. | Character / Math
	 'Equals' | '\u003D' | The Equals key, or equals sign ('='). Note: the Equals key is usually found on the numeric keypad (e.g., the 10-key) on typical 101-key keyboards and usually requires the 'NumLock' state to be enabled. | Character / Math
	 'Decimal' | '\u2396' | The Decimal key, or decimal separator key symbol ('.'). Note: the Decimal key is usually found on the numeric keypad (e.g., the 10-key) on typical 101-key keyboards and usually requires the 'NumLock' state to be enabled. Note: This key value can be represented by different characters due to localization, such as '\u002E' (FULL STOP, '.') or '\u00B7' (MIDDLE DOT, '·'). | Character / Math
	 'BrightnessDown' |  | The Brightness Down key. Typically controls the display brightness. | Device
	 'BrightnessUp' |  | The Brightness Up key. Typically controls the display brightness. | Device
	 'Camera' |  | The Camera key. | Device
	 'Eject' |  | Toggle removable media to eject (open) and insert (close) state. | Device
	 'Power' |  | Toggle power state. Note: Some devices might not expose this key to the operating environment. | Device
	 'PrintScreen' |  | The Print Screen (PrintScrn, SnapShot) key, to initiate print-screen function. | Device
	 'BrowserFavorites' |  | The Browser Favorites key. | Browser
	 'BrowserHome' |  | The Browser Home key, used with keyboard entry, to go to the home page. | Browser
	 'BrowserRefresh' |  | The Browser Refresh key. | Browser
	 'BrowserSearch' |  | The Browser Search key. | Browser
	 'BrowserStop' |  | The Browser Stop key. | Browser
	 'HistoryBack' |  | Navigate to previous content or page in current history. | Browser
	 'HistoryForward' |  | Navigate to next content or page in current history. | Browser
	 'Left' |  | The left arrow key, to navigate or traverse leftward. | Navigation
	 'PageDown' |  | The Page Down key, to scroll down or display next page of content. | Navigation
	 'PageUp' |  | The Page Up key, to scroll up or display previous page of content. | Navigation
	 'Right' |  | The right arrow key, to navigate or traverse rightward. | Navigation
	 'Up' |  | The up arrow key, to navigate or traverse upward. | Navigation
	 'UpLeft' |  | The diagonal up-left arrow key, to navigate or traverse diagonally up and to the left. | Navigation
	 'UpRight' |  | The diagonal up-right arrow key, to navigate or traverse diagonally up and to the right. | Navigation
	 'Down' |  | The down arrow key, to navigate or traverse downward. | Navigation
	 'DownLeft' |  | The diagonal down-left arrow key, to navigate or traverse diagonally down and to the left. | Navigation
	 'DownRight' |  | The diagonal down-right arrow key, to navigate or traverse diagonally down and to the right. | Navigation
	 'Home' |  | The Home key, used with keyboard entry, to go to start of content. | Edit / Navigation
	 'End' |  | The End key, used with keyboard entry to go to the end of content. | Edit / Navigation
	 'Select' |  | The Select key. | Edit / Navigation
	 'Tab' | '\u0009' | The Horizontal Tabulation (Tab) key. | Edit / Navigation
	 'Backspace' | '\u0008' | The Backspace key. | Edit
	 'Clear' |  | The Clear key, for removing current selected input. | Edit
	 'Copy' |  | The Copy key. | Edit
	 'Cut' |  | The Cut key. | Edit
	 'Del' | '\u007F' | The Delete (Del) Key. Note: This key value is also used for the key labeled 'delete' on MacOS keyboards when modified by the 'Fn' key. | Edit
	 'EraseEof' |  | The Erase to End of Field key. This key deletes all characters from the current cursor position to the end of the current field. | Edit
	 'Insert' |  | The Insert (Ins) key, to toggle between text modes for insertion or overtyping. | Edit
	 'Paste' |  | The Paste key. | Edit
	 'Undo' |  | The Undo key. | Edit
	 'DeadGrave' | '\u0300' | The Combining Grave Accent (Greek Varia, Dead Grave) key. | Composition
	 'DeadEacute' | '\u0301' | The Combining Acute Accent (Stress Mark, Greek Oxia, Tonos, Dead Eacute) key. | Composition
	 'DeadCircumflex' | '\u0302' | The Combining Circumflex Accent (Hat, Dead Circumflex) key. | Composition
	 'DeadTilde' | '\u0303' | The Combining Tilde (Dead Tilde) key. | Composition
	 'DeadMacron' | '\u0304' | The Combining Macron (Long, Dead Macron) key. | Composition
	 'DeadBreve' | '\u0306' | The Combining Breve (Short, Dead Breve) key. | Composition
	 'DeadAboveDot' | '\u0307' | The Combining Dot Above (Derivative, Dead Above Dot) key. | Composition
	 'DeadUmlaut' | '\u0308' | The Combining Diaeresis (Double Dot Abode, Umlaut, Greek Dialytika, Double Derivative, Dead Diaeresis) key. | Composition
	 'DeadAboveRing' | '\u030A' | The Combining Ring Above (Dead Above Ring) key. | Composition
	 'DeadDoubleacute' | '\u030B' | The Combining Double Acute Accent (Dead Doubleacute) key. | Composition
	 'DeadCaron' | '\u030C' | The Combining Caron (Hacek, V Above, Dead Caron) key. | Composition
	 'DeadCedilla' | '\u0327' | The Combining Cedilla (Dead Cedilla) key. | Composition
	 'DeadOgonek' | '\u0328' | The Combining Ogonek (Nasal Hook, Dead Ogonek) key. | Composition
	 'DeadIota' | '\u0345' | The Combining Greek Ypogegrammeni (Greek Non-Spacing Iota Below, Iota Subscript, Dead Iota) key. | Composition
	 'DeadVoicedSound' | '\u3099' | The Combining Katakana-Hiragana Voiced Sound Mark (Dead Voiced Sound) key. | Composition
	 'DeadSemivoicedSound' | '\u309A' | The Combining Katakana-Hiragana Semi-Voiced Sound Mark (Dead Semivoiced Sound) key. | Composition
	 'Alphanumeric' |  | The Alphanumeric key. | Modifier
	 'Alt' |  | The Alternative (Alt, Option, Menu) key. Enable alternate modifier function for interpreting concurrent or subsequent keyboard input. Note: This key value is also used for the Apple 'Option' key. | Modifier
	 'AltGraph' |  | The Alt-Graph key. | Modifier
	 'CapsLock' |  | The Caps Lock (Capital) key. Toggle capital character lock function for interpreting subsequent keyboard input event. | Modifier
	 'Control' |  | The Control (Ctrl) key, to enable control modifier function for interpreting concurrent or subsequent keyboard input. | Modifier
	 'Fn' |  | The Function switch (Fn) key. Activating this key simultaneously with another key changes that key's value to an alternate character or function. | Modifier
	 'FnLock' |  | The Function-Lock (FnLock, F-Lock) key. Activating this key switches the mode of the keyboard to changes some keys' values to an alternate character or function.  | Modifier
	 'Meta' |  | The Meta key, to enable meta modifier function for interpreting concurrent or subsequent keyboard input. Note: This key value is also used for the Apple 'Command' key. | Modifier
	 'Process' |  | The Process key. | Modifier
	 'NumLock' |  | The Number Lock key, to toggle numer-pad mode function for interpreting subsequent keyboard input. | Modifier
	 'Shift' |  | The Shift key, to enable shift modifier function for interpreting concurrent or subsequent keyboard input. | Modifier
	 'SymbolLock' |  | The Symbol Lock key. | Modifier
	 'OS' |  | The operating system key (e.g. the "Windows Logo" key). | Modifier
	 'Compose' |  | The Compose key, also known as Multi_key on the X Window System. This key acts in a manner similar to a dead key, triggering a mode where subsequent key presses are combined to produce a different character. | Modifier
	 'AllCandidates' |  | The All Candidates key, to initate the multi-candidate mode. | IME
	 'NextCandidate' |  | The Next Candidate function key. | IME
	 'PreviousCandidate' |  | The Previous Candidate function key. | IME
	 'CodeInput' |  | The Code Input key, to initiate the Code Input mode to allow characters to be entered by their code points. | IME
	 'Convert' |  | The Convert key, to convert the current input method sequence. | IME
	 'Nonconvert' |  | The Nonconvert (Don't Convert) key, to accept current input method sequence without conversion in IMEs. | IME
	 'FinalMode' |  | The Final Mode (Final) key used on some Asian keyboards, to enable the final mode for IMEs. | IME
	 'FullWidth' |  | The Full-Width Characters key. | IME
	 'HalfWidth' |  | The Half-Width Characters key. | IME
	 'ModeChange' |  | The Mode Change key, to toggle between or cycle through input modes of IMEs. | IME
	 'RomanCharacters' |  | The Roman Characters function key, also known as the 'Youngja' or 'Young' key. | IME
	 'HangulMode' |  | The Hangul (Korean characters) Mode key, to toggle between Hangul and English modes. | IME
	 'HanjaMode' |  | The Hanja (Korean characters) Mode key. | IME
	 'JunjaMode' |  | The Junja (Korean characters) Mode key. | IME
	 'Hiragana' |  | The Hiragana (Japanese Kana characters) key. | IME
	 'JapaneseHiragana' |  | The Japanese-Hiragana key. | IME
	 'JapaneseKatakana' |  | The Japanese-Katakana key. | IME
	 'JapaneseRomaji' |  | The Japanese-Romaji key. | IME
	 'KanaMode' |  | The Kana Mode (Kana Lock) key. | IME
	 'KanjiMode' |  | The Kanji (Japanese name for ideographic characters of Chinese origin) Mode key. | IME
	 'Katakana' |  | The Katakana (Japanese Kana characters) key. | IME
	 'AudioFaderFront' |  | Adjust audio fader towards front. | Media
	 'AudioFaderRear' |  | Adjust audio fader towards rear. | Media
	 'AudioBalanceLeft' |  | Adjust audio balance leftward. | Media
	 'AudioBalanceRight' |  | Adjust audio balance rightward. | Media
	 'AudioBassBoostDown' |  | Decrease audio bass boost or cycle down through bass boost states. | Media
	 'AudioBassBoostUp' |  | Increase audio bass boost or cycle up through bass boost states. | Media
	 'AudioMute' |  | Toggle between muted state and prior volume level. | Media
	 'AudioVolumeDown' |  | Decrease audio volume. | Media
	 'AudioVolumeUp' |  | Increase audio volume. | Media
	 'MediaPause' |  | Pause playback, if not paused or stopped; also used with keyboard entry to pause scrolling output. | Media
	 'MediaPlay' |  | Initiate or continue media playback at normal speed, if not currently playing at normal speed. | Media
	 'MediaTrackEnd' |  | Seek to end of media or program. | Media
	 'MediaTrackNext' |  | Seek to next media or program track. | Media
	 'MediaPlayPause' |  | Toggle media between play and pause states. | Media
	 'MediaTrackPrevious' |  | Seek to previous media or program track. | Media
	 'MediaTrackSkip' |  | Skip current content or program. | Media
	 'MediaTrackStart' |  | Seek to start of media or program. | Media
	 'MediaStop' |  | Stop media playing, pausing, forwarding, rewinding, or recording, if not already stopped. | Media
	 'SelectMedia' |  | The Select Media key. | Media
	 'Blue' |  | General purpose color-coded media function key, as index 3. | Media
	 'Brown' |  | General purpose color-coded media function key, as index 5. | Media
	 'ChannelDown' |  | Select next (numerically or logically) lower channel.. | Media
	 'ChannelUp' |  | Select next (numerically or logically) higher channel. | Media
	 'ClearFavorite0' |  | Clear program or content stored as favorite 0. | Media
	 'ClearFavorite1' |  | Clear program or content stored as favorite 1. | Media
	 'ClearFavorite2' |  | Clear program or content stored as favorite 2. | Media
	 'ClearFavorite3' |  | Clear program or content stored as favorite 3. | Media
	 'Dimmer' |  | Adjust brightness of device, or toggle between or cycle through states. | Media
	 'DisplaySwap' |  | Swap video sources. | Media
	 'FastFwd' |  | Initiate or continue forward playback at faster than normal speed, or increase speed if already fast forwarding. | Media
	 'Green' |  | General purpose color-coded media function key, as index 1. | Media
	 'Grey' |  | General purpose color-coded media function key, as index 4. | Media
	 'Guide' |  | Toggle display of program or content guide. | Media
	 'InstantReplay' |  | Toggle instant replay. | Media
	 'MediaLast' |  | Select previously selected channel or media. | Media
	 'Link' |  | Launch linked content, if available and appropriate. | Media
	 'Live' |  | Toggle display listing of currently available live content or programs. | Media
	 'Lock' |  | Lock or unlock current content or program. | Media
	 'NextDay' |  | If guide is active and displayed, then display next day's content. | Media
	 'NextFavoriteChannel' |  | Select next favorite channel (in favorites list). | Media
	 'OnDemand' |  | Access on-demand content or programs. | Media
	 'PinPDown' |  | Move picture-in-picture window downward. | Media
	 'PinPMove' |  | Move picture-in-picture window. | Media
	 'PinPToggle' |  | Toggle display of picture-in-picture window. | Media
	 'PinPUp' |  | Move picture-in-picture window upward. | Media
	 'PlaySpeedDown' |  | Decrease media playback speed. | Media
	 'PlaySpeedReset' |  | Reset playback speed to normal speed (according to current media function). | Media
	 'PlaySpeedUp' |  | Increase media playback speed. | Media
	 'PrevDay' |  | If guide is active and displayed, then display previous day's content. | Media
	 'RandomToggle' |  | Toggle random media or content shuffle mode. | Media
	 'RecallFavorite0' |  | Select (recall) program or content stored as favorite 0. | Media
	 'RecallFavorite1' |  | Select (recall) program or content stored as favorite 1. | Media
	 'RecallFavorite2' |  | Select (recall) program or content stored as favorite 2. | Media
	 'RecallFavorite3' |  | Select (recall) program or content stored as favorite 3. | Media
	 'MediaRecord' |  | Initiate or resume recording of currently selected media. | Media
	 'RecordSpeedNext' |  | Toggle or cycle between media recording speeds (if applicable). | Media
	 'Red' |  | General purpose color-coded media function key, as index 0. | Media
	 'MediaRewind' |  | Initiate or continue reverse playback at faster than normal speed, or increase speed if already rewinding. | Media
	 'RfBypass' |  | Toggle RF (radio frequency) input bypass mode. | Media
	 'ScanChannelsToggle' |  | Toggle scan channels mode. | Media
	 'ScreenModeNext' |  | Advance display screen mode to next available mode. | Media
	 'Settings' |  | Toggle display of device settings screen. | Media
	 'SplitScreenToggle' |  | Toggle split screen mode. | Media
	 'StoreFavorite0' |  | Store current program or content as favorite 0. | Media
	 'StoreFavorite1' |  | Store current program or content as favorite 1. | Media
	 'StoreFavorite2' |  | Store current program or content as favorite 2. | Media
	 'StoreFavorite3' |  | Store current program or content as favorite 3. | Media
	 'Subtitle' |  | Toggle display of subtitles, if available. | Media
	 'AudioSurroundModeNext' |  | Advance surround audio mode to next available mode. | Media
	 'Teletext' |  | Toggle display of teletext, if available. | Media
	 'VideoModeNext' |  | Advance video mode to next available mode. | Media
	 'DisplayWide' |  | Toggle device display mode between wide aspect and normal aspect mode. | Media
	 'Wink' |  | Cause device to identify itself in some manner, e.g., audibly or visibly. | Media
	 'Yellow' |  | General purpose color-coded media function key, as index 2. | Media
	 'Unidentified' |  | This key value is used when an implementations is unable to identify another key value, due to either hardware, platform, or software constraints. | Special
	 */

	var
	/**
	 *Key map based on http://calormen.com/polyfill/keyboard.js
	 * @const
	 */
		VK__NON_CHARACTER_KEYS = {
			3: 'Cancel', // char \x0018 ???
			6: 'Help', // ???
			8: 'Backspace',
			9: 'Tab',
			12: 'Clear', // NumPad Center
			13: 'Enter',

			16: 'Shift',
			17: 'Control',
			18: 'Alt',
			19: 'Pause', // TODO:: not in [key-values-list], but usefull
			20: 'CapsLock',

			21: 'KanaMode', // IME
			22: 'HangulMode', // IME
			23: 'JunjaMode', // IME
			24: 'FinalMode', // IME
			25: 'HanjaMode', // IME
			//  0x19: 'KanjiMode', keyLocation: _KeyboardEvent.DOM_KEY_LOCATION_STANDARD, // IME; duplicate on Windows

			27: 'Esc',

			28: 'Convert', // IME
			29: 'Nonconvert', // IME
			30: 'Accept', // IME
			31: 'ModeChange', // IME

			32: 'Spacebar',
			33: 'PageUp',
			34: 'PageDown',
			35: 'End',
			36: 'Home',
			37: 'Left',
			38: 'Up',
			39: 'Right',
			40: 'Down',
			41: 'Select',
			//42: 'Print', // ??? not in [key-values-list]
			43: 'Execute',
			44: 'PrintScreen',
			45: 'Insert',
			46: 'Del',
			47: 'Help', // ???

			91: { _key: 'OS', _char: false, _location: _DOM_KEY_LOCATION_LEFT }, // Left Windows
			92: { _key: 'OS', _char: false, _location: _DOM_KEY_LOCATION_RIGHT }, // Right Windows
			93: 'Menu', // 'Context Menu' from [OLD key-values-list]

			// TODO: Test in WebKit
			106: { _key: 'Multiply', _char: '*', _location: _DOM_KEY_LOCATION_NUMPAD }, // or 'Asterisk' ?
			107: { _key: 'Add', _char: '+', _location: _DOM_KEY_LOCATION_NUMPAD },
			108: { _key: 'Separator', _char: false, _location: _DOM_KEY_LOCATION_NUMPAD }, // ??? NumPad Enter ???
			109: { _key: 'Subtract', _char: '-', _location: _DOM_KEY_LOCATION_NUMPAD },
			110: { _key: 'Decimal', _char: '.', _location: _DOM_KEY_LOCATION_NUMPAD },
			111: { _key: 'Divide', _char: '/'/* TODO:: or '\u00F7' */, _location: _DOM_KEY_LOCATION_NUMPAD },

			// TODO: Test in WebKit
			144: { _key: 'NumLock', _char: false, _location: _DOM_KEY_LOCATION_NUMPAD },
			145: 'ScrollLock',

			// NOTE: Not exposed to browsers so we don't need this
			/*
			 0xA0: { _key : 'Shift', _char: false, _location: _DOM_KEY_LOCATION_LEFT },
			 0xA1: { _key : 'Shift', _char: false, _location: _DOM_KEY_LOCATION_RIGHT },
			 0xA2: { _key : 'Control', _char: false, _location: _DOM_KEY_LOCATION_LEFT },
			 0xA3: { _key : 'Control', _char: false, _location: _DOM_KEY_LOCATION_RIGHT },
			 0xA4: { _key : 'Alt', _char: false, _location: _DOM_KEY_LOCATION_LEFT },
			 0xA5: { _key : 'Alt', _char: false, _location: _DOM_KEY_LOCATION_RIGHT },
			 */

			180: 'LaunchMail',
			181: 'SelectMedia',
			182: 'LaunchApplication1',
			183: 'LaunchApplication2',

			// TODO: Check keyIdentifier in WebKit
			224: 'Meta', // Apple Command key
			229: 'Process', // IME

			246: 'Attn',
			247: 'Crsel',
			248: 'Exsel',
			249: 'EraseEof',
			251: 'Zoom',
			254: 'Clear'
		}
		, VK__CHARACTER_KEYS__DOWN_UP = __GCC__NEW_KEYBOARD_EVENTS_PROPOSAL__ ?
		{
			186: ';'// 'ж', ';', ':'
			, 187: '='
			, 188: ','// 'б', ',', '<'
			, 189: '-'
			, 190: '.'// 'ю', '.', '>'
			, 191: '/'// '.', '/', '?'
			, 192: '`'// 'ё', '`', '~'
			, 219: '['// 'х', '[', '{'
			, 220: '\\'//'\', '\', '|'
			, 221: ']'// 'ъ', '[', '{'
			, 222: "'"// 'э', '"', '''
			, 226: '\\'// '\', '|', '/'
		}
		: { }
		, _userAgent_ = global.navigator.userAgent.toLowerCase()
		, _IS_MAC = !!~(global.navigator.platform + "").indexOf( "Mac" )
		, _BROWSER = {}
		, __i
		/** @type {boolean} */
		, IS_NEED_KEYCODE_BUGFIX
		/** @type {boolean} */
		, IS_OPERA_DOUBBLE_KEYPRESS_BUG
		, tmp
		/** @const @type {number} */
		, _KEYPRESS_VK__CHARACTER_KEYS__DOWN_UP_DELTA = 999
	;

	for( __i = 105 ; __i > 95 ; --__i ) {
		//0, 1, 2 ... 9
		tmp = __i - 96;
		VK__CHARACTER_KEYS__DOWN_UP[tmp + 48] = _Event_prototype__native_key_getter ? tmp + "" : {_key : tmp + ""};//48, 49, 50 ... 57

		//0-9 on Numpad
		VK__CHARACTER_KEYS__DOWN_UP[__i] = { _key: tmp + "", _location: _DOM_KEY_LOCATION_NUMPAD };//96, 97, 98 .. 105
	}

	if( !_Event_prototype__native_key_getter ) {
		for(__i in VK__CHARACTER_KEYS__DOWN_UP) if(_hasOwnProperty(VK__CHARACTER_KEYS__DOWN_UP, __i) && typeof(VK__CHARACTER_KEYS__DOWN_UP[__i]) != "object") {
			VK__CHARACTER_KEYS__DOWN_UP[__i] = {_key: VK__CHARACTER_KEYS__DOWN_UP[__i]};
		}
	}

	// 0x70 ~ 0x87: 'F1' ~ 'F24'
	for( __i = 135 ; __i > 111 ; --__i ) {
		VK__NON_CHARACTER_KEYS[__i] = "F" + (__i - 111);
	}

	if( global["opera"] ) {// Opera special cases
		if( !_Event_prototype__native_char_getter ) {
			//TODO: for Win only?
			IS_NEED_KEYCODE_BUGFIX = true;
			IS_OPERA_DOUBBLE_KEYPRESS_BUG = true;//TODO:: avoid Opera double keypress bug

			/*
			 VK__NON_CHARACTER_KEYS[43] = VK__NON_CHARACTER_KEYS[0x6B];	// key:'Add', char:'+'
			 VK__NON_CHARACTER_KEYS[43]._keyCode = 107;
			 VK__NON_CHARACTER_KEYS[43]._needkeypress = true;	// instead of _key: 0
			 VK__NON_CHARACTER_KEYS[45] = VK__NON_CHARACTER_KEYS[0x6D];	// key:'Subtract', char:'-'
			 VK__NON_CHARACTER_KEYS[45]._keyCode = 109;
			 VK__NON_CHARACTER_KEYS[45]._needkeypress = true;	// instead of _key: 0
			 */
			VK__NON_CHARACTER_KEYS[57351] = VK__NON_CHARACTER_KEYS[93];	//'Menu'
			VK__CHARACTER_KEYS__DOWN_UP[187] = VK__CHARACTER_KEYS__DOWN_UP[61] = {_key: 0, _keyCode: 187};	//'=' (US Standard ? need to ckeck it out)
			VK__CHARACTER_KEYS__DOWN_UP[189] = VK__CHARACTER_KEYS__DOWN_UP[109] = {_key: 0, _keyCode: 189/*not for 187 keyCode, but for 109 */, _location: 3};//TODO: location=3 only for win? //'-' (US Standard ? need to ckeck it out)
			/*
			 Unusable for Opera due to key '[' has keyCode=219 and key '\' has keyCode=220
			 TODO: filtering by keypress event. 'OS' key has no keypress event
			 (VK__NON_CHARACTER_KEYS[219] = VK__NON_CHARACTER_KEYS[0x5B])._keyCode = 91;
			 (VK__NON_CHARACTER_KEYS[220] = VK__NON_CHARACTER_KEYS[0x5C])._keyCode = 92;
			 */

			if( _IS_MAC ) {
				/*TODO::
				 0x11: { keyIdentifier: 'Meta' },
				 0xE030: { keyIdentifier: 'Control' }
				 */
			}
		}
	}
	else {
		//browser sniffing
		_BROWSER["names"] = _userAgent_.match( /(mozilla|compatible|chrome|webkit|safari)/gi );
		__i = _BROWSER["names"] && _BROWSER["names"].length || 0;
		while( __i-- > 0 )_BROWSER[_BROWSER["names"][__i]] = true;

		if( _BROWSER["mozilla"] && !_BROWSER["compatible"] && !_BROWSER["webkit"] ) {// Mozilla special cases
			//TODO:: only Windows?
			IS_NEED_KEYCODE_BUGFIX = true;

			//Firefox version
			_BROWSER._version = +(_userAgent_.match( /firefox\/([0-9]+)/ ) || [])[1];

			tmp = VK__CHARACTER_KEYS__DOWN_UP[61] = VK__CHARACTER_KEYS__DOWN_UP[187];//US Standard
			tmp._keyCode = 187;
			tmp = VK__CHARACTER_KEYS__DOWN_UP[173] = VK__CHARACTER_KEYS__DOWN_UP[189];//US Standard
			tmp._keyCode = 189;
			tmp = VK__CHARACTER_KEYS__DOWN_UP[59] = VK__CHARACTER_KEYS__DOWN_UP[186];//US Standard
			tmp._keyCode = 186;
			if( _BROWSER._version < 15 ) {
				VK__NON_CHARACTER_KEYS[107] = VK__NON_CHARACTER_KEYS[61];
				VK__CHARACTER_KEYS__DOWN_UP[109] = VK__CHARACTER_KEYS__DOWN_UP[173];

				//Can't handle Subtract(key="-",location="3") and Add(key="+",location="3") keys in FF < 15
			}
		}
		else if( _BROWSER["safari"] && !_BROWSER["chrome"] ) {// Safari WebKit special cases
			/*TODO::
			 0x03: { keyIdentifier: 'Enter', keyName: 'Enter', keyChar: '\u000D' }, // old Safari
			 0x0A: { keyIdentifier: 'Enter', keyName: 'Enter', keyLocation: KeyboardEvent.DOM_KEY_LOCATION_MOBILE, keyChar: '\u000D' }, // iOS
			 0x19: { keyIdentifier: 'U+0009', keyName: 'Tab', keyChar: '\u0009'} // old Safari for Shift+Tab
			 */
			if( _IS_MAC ) {
				/*
				 0x5B: { keyIdentifier: 'Meta', keyLocation: KeyboardEvent.DOM_KEY_LOCATION_LEFT },
				 0x5D: { keyIdentifier: 'Meta', keyLocation: KeyboardEvent.DOM_KEY_LOCATION_RIGHT },
				 0xE5: { keyIdentifier: 'U+0051', keyName: 'Q', keyChar: 'Q'} // On alternate presses, Ctrl+Q sends this
				 */
			}
		}
		else if( _BROWSER["chrome"] ) {// Chrome WebKit special cases
			if( _IS_MAC ) {
				/*TODO::
				 0x5B: { keyIdentifier: 'Meta', keyLocation: KeyboardEvent.DOM_KEY_LOCATION_LEFT },
				 0x5D: { keyIdentifier: 'Meta', keyLocation: KeyboardEvent.DOM_KEY_LOCATION_RIGHT }
				 */
			}
		}
	}

	var VK__FAILED_KEYIDENTIFIER = {//webkit 'keyIdentifier' or Opera12.10/IE9 'key'
		//keyIdentifier.substring( 0, 2 ) !== "U+"
		//'U+0008': null, // -> 'Backspace'
		//'U+0009': null, // -> 'Tab'
		//'U+0020': null, // -> 'Spacebar'
		//'U+007F': null, // -> 'Del'
		//'U+0010': null, // [test this] -> 'Fn' ?? 'Function' ?
		//'U+001C': null, // [test this] -> 'Left'
		//'U+001D': null, // [test this] -> 'Right'
		//'U+001E': null, // [test this] -> 'Up'
		//'U+001F': null, // [test this] -> 'Down'

		'Escape': null, // from [OLD key-values-list] -> 'Esc'
		'Win': null, // from [OLD key-values-list] -> 'OS'
		'Scroll': null, // from [OLD key-values-list] -> 'ScrollLock'
		'Apps': null, // from [OLD key-values-list] -> 'Menu'

		//From Opera impl
		'Delete': null, // from [OLD key-values-list] -> 'Del'
		'Window': null, // from [OLD key-values-list] -> 'OS'
		'ContextMenu': null, // from [OLD key-values-list] -> 'Menu'
		'Mul': null // from [OLD key-values-list] -> 'Multiply'
		/*
		 0xAD: 'VolumeMute',
		 0xAE: 'VolumeDown',
		 0xAF: 'VolumeUp',
		 0xB0: 'MediaNextTrack',
		 0xB1: 'MediaPreviousTrack',
		 0xB2: 'MediaStop',
		 0xB3: 'MediaPlayPause',
		 */

		/*
		 0xA6: 'BrowserBack',
		 0xA7: 'BrowserForward',
		 0xA8: 'BrowserRefresh',
		 0xA9: 'BrowserStop',
		 0xAA: 'BrowserSearch',
		 0xAB: 'BrowserFavorites',
		 0xAC: 'BrowserHome',
		 */

		/*
		 0xFA: 'Play',
		 */
	};

// NOTE: 'char' is the default character for that key, and doesn't reflect modifier
// states. It is primarily used here to indicate that this is a non-special key
// BUGS:
// do we need some kind of detection ?
	/*TODO::
	 VK_SPECIAL = {
	 // Mozilla special cases
	 'moz': {
	 0x3B: 'U+00BA', keyName: 'Semicolon', keyChar: ';', _shiftChar: ':', // ; : (US Standard)
	 0x3D: 'U+00BB', keyName: 'Equals', keyChar: '=', _shiftChar: '+', // = +
	 0x6B: 'U+00BB', keyName: 'Equals', keyChar: '=', _shiftChar: '+', // = +
	 0x6D: 'U+00BD', keyName: 'Minus', keyChar: '-', _shiftChar: '_', // - _
	 // TODO: Check keyIdentifier in WebKit for numpad
	 0xBB: 'Add', keyName: 'Add', keyLocation: _DOM_KEY_LOCATION_NUMPAD, keyChar: '+',
	 0xBD: 'Subtract', keyName: 'Subtract', keyLocation: _DOM_KEY_LOCATION_NUMPAD, keyChar: '-' }
	 },

	 // Chrome WebKit special cases
	 'chrome': {
	 },
	 'chrome-mac': {
	 0x5B: 'Meta', keyLocation: _DOM_KEY_LOCATION_LEFT,
	 0x5D: 'Meta', keyLocation: _DOM_KEY_LOCATION_RIGHT }
	 },


	 // Safari WebKit special cases
	 'safari': {
	 0x03: 'Enter', _keyCode: 13, keyName: 'Enter', keyChar: '\u000D', // old Safari
	 0x0A: 'Enter', _keyCode: 13, keyName: 'Enter', keyLocation: _KeyboardEvent.DOM_KEY_LOCATION_MOBILE, keyChar: '\u000D', // iOS
	 0x19: 'Tab', _keyCode: 9, keyName: 'Tab', keyChar: '\u0009'} // old Safari for Shift+Tab
	 },
	 'safari-mac': {
	 0x5B: 'Meta', keyLocation: _DOM_KEY_LOCATION_LEFT,
	 0x5D: 'Meta', keyLocation: _DOM_KEY_LOCATION_RIGHT,
	 0xE5: 'U+0051', keyName: 'Q', keyChar: 'Q'} // On alternate presses, Ctrl+Q sends this
	 },

	 // Opera special cases
	 'opera': {
	 // NOTE: several of these collide in theory, but most other keys are unrepresented
	 [true,cant prevent in input]0x2F: 'Divide', _keyCode: 111, keyName: 'Divide', keyLocation: _DOM_KEY_LOCATION_NUMPAD, keyChar: '/', // Same as 'Help'
	 [true,cant prevent in input]0x2A: 'Multiply', _keyCode: 106, keyName: 'Multiply', keyLocation: _DOM_KEY_LOCATION_NUMPAD, keyChar: '*', // Same as 'Print'
	 [true,cant prevent in input]//0x2D: 'Subtract', keyName: 'Subtract', _ keyCode: 109, keyLocation: _DOM_KEY_LOCATION_NUMPAD,   keyChar: '-', // Same as 'Insert'
	 [true,cant prevent in input]0x2B: 'Add', keyName: 'Add', _ keyCode: 107, keyLocation: _DOM_KEY_LOCATION_NUMPAD, keyChar: '+', // Same as 'Execute'

	 [true]0x3B: 'U+00BA', _keyCode: 186, keyName: 'Semicolon', keyChar: ';', _shiftChar: '', // ; : (US Standard)
	 [true]0x3D: 'U+00BB', _keyCode: 187, keyName: 'Equals', keyChar: '=', _shiftChar: '', // = +

	 [no need]0x6D: 'U+00BD', keyName: 'Minus', keyChar: '-', _shiftChar: '_'} // - _
	 },
	 'opera-mac': {
	 0x11: 'Meta',
	 0xE030: 'Control' }
	 }
	 };
	 */


	/**
	 * http://html5labs.interoperabilitybridges.com/dom4events/#constructors-keyboardevent
	 * http://www.w3.org/TR/DOM-Level-3-Events/#idl-interface-KeyboardEvent-initializers
	 * https://www.w3.org/Bugs/Public/show_bug.cgi?id=14052
	 * @constructor
	 * @param {string} type
	 * @param {Object=} dict
	 */
	function _KeyboardEvent ( type, dict ) {// KeyboardEvent  constructor
		var e;
		try {
			e = document.createEvent( "KeyboardEvent" );
		}
		catch ( err ) {
			e = document.createEvent( "Event" );
		}

		dict = dict || {};

		var localDict = {}
			, _prop_name
			, _prop_value
		;

		for( _prop_name in _keyboardEvent_properties_dictionary )if( _hasOwnProperty( _keyboardEvent_properties_dictionary, _prop_name ) ) {
			localDict[_prop_name] = _prop_name in dict && (_prop_value = dict[_prop_name]) !== void 0 ?
				_prop_value
				:
				_keyboardEvent_properties_dictionary[_prop_name]
			;
		}

		var _ctrlKey = localDict["ctrlKey"] || false
			, _shiftKey = localDict["shiftKey"] || false
			, _altKey = localDict["altKey"] || false
			, _metaKey = localDict["metaKey"] || false
			, _altGraphKey = localDict["altGraphKey"] || false

			, modifiersListArg = _initKeyboardEvent_type > 3 ? (
					(_ctrlKey ? "Control" : "")
					+ (_shiftKey ? " Shift" : "")
					+ (_altKey ? " Alt" : "")
					+ (_metaKey ? " Meta" : "")
					+ (_altGraphKey ? " AltGraph" : "")
				).trim() : null

			, _key = (localDict["key"] || "") + ""
			, _char = (localDict["char"] || "") + ""
			, _location = localDict["location"]
			, _keyCode = _key && _key.charCodeAt( 0 ) || 0 //TODO:: more powerfull key to charCode

			, _bubbles = localDict["bubbles"]
			, _cancelable = localDict["cancelable"]

			, _repeat = localDict["repeat"]
			, _locale = localDict["locale"]

			, success_init = false
		;

		_keyCode = localDict["keyCode"] = localDict["keyCode"] || _keyCode;
		localDict["which"] = localDict["which"] || _keyCode;

		if( !canOverwrite_keyCode ) {//IE9
			e["__keyCode"] = _keyCode;
			e["__charCode"] = _keyCode;
			e["__which"] = _keyCode;
		}


		if( "initKeyEvent" in e ) {//FF
			//https://developer.mozilla.org/en/DOM/event.initKeyEvent

			e.initKeyEvent( type, _bubbles, _cancelable, global,
				_ctrlKey, _altKey, _shiftKey, _metaKey, _keyCode, _keyCode );
			success_init = true;
		}
		else if( "initKeyboardEvent" in e ) {
			//https://developer.mozilla.org/en/DOM/KeyboardEvent#initKeyboardEvent()

			if( _try_initKeyboardEvent ) {
				try {
					if( _initKeyboardEvent_type == 1 ) { // webkit
						/*
						 http://stackoverflow.com/a/8490774/1437207
						 For Webkit-based browsers (Safari/Chrome), the event initialization call should look a bit differently (see https://bugs.webkit.org/show_bug.cgi?id=13368):
						 initKeyboardEvent(
						 in DOMString typeArg,
						 in boolean canBubbleArg,
						 in boolean cancelableArg,
						 in views::AbstractView viewArg,
						 in DOMString keyIdentifierArg,
						 in unsigned long keyLocationArg,
						 in boolean ctrlKeyArg,
						 in boolean shiftKeyArg,
						 in boolean altKeyArg,
						 in boolean metaKeyArg,
						 in boolean altGraphKeyArg
						 );
						 */
						e.initKeyboardEvent( type, _bubbles, _cancelable, global, _key, _location, _ctrlKey, _shiftKey, _altKey, _metaKey, _altGraphKey );
						e["__char"] = _char;
					}
					else if( _initKeyboardEvent_type == 2 ) { // old webkit
						/*
						 http://code.google.com/p/chromium/issues/detail?id=52408
						 event.initKeyboardEvent(
						 "keypress",        //  in DOMString typeArg,
						 true,             //  in boolean canBubbleArg,
						 true,             //  in boolean cancelableArg,
						 null,             //  in nsIDOMAbstractView viewArg,  Specifies UIEvent.view. This value may be null.
						 false,            //  in boolean ctrlKeyArg,
						 false,            //  in boolean altKeyArg,
						 false,            //  in boolean shiftKeyArg,
						 false,            //  in boolean metaKeyArg,
						 13,              //  in unsigned long keyCodeArg,
						 0                //  in unsigned long charCodeArg
						 );
						 */
						e.initKeyboardEvent( type, _bubbles, _cancelable, global, _ctrlKey, _altKey, _shiftKey, _metaKey, _keyCode, _keyCode );
					}
					else if( _initKeyboardEvent_type == 3 ) { // webkit
						/*
						 initKeyboardEvent(
						 type,
						 canBubble,
						 cancelable,
						 view,
						 keyIdentifier,
						 keyLocationA,
						 ctrlKey,
						 altKey,
						 shiftKey,
						 metaKey,
						 altGraphKey
						 );
						 */
						e.initKeyboardEvent( type, _bubbles, _cancelable, global, _key, _location, _ctrlKey, _altKey, _shiftKey, _metaKey, _altGraphKey );
						e["__char"] = _char;
					}
					else if( _initKeyboardEvent_type == 4 ) { // IE9
						/*
						 http://msdn.microsoft.com/en-us/library/ie/ff975297(v=vs.85).aspx
						 eventType [in] Type: BSTR One of the following values, or a user-defined custom event type: keydown,keypress,keyup
						 canBubble [in] Type: VARIANT_BOOL
						 cancelable [in] Type: VARIANT_BOOL
						 viewArg [in] Type: IHTMLWindow2 The active window object or null. This value is returned in the view property of the event.
						 keyArg [in] Type: BSTR The key identifier. This value is returned in the key property of the event.
						 locationArg [in] Type: unsigned long The location of the key on the device. This value is returned in the location property of the event.
						 modifiersListArg [in] Type: BSTR A space-separated list of any of the following values: Alt,AltGraph,CapsLock,Control,Meta,NumLock,Scroll,Shift,Win
						 repeat [in] Type: VARIANT_BOOL The number of times this key has been pressed. This value is returned in the repeat property of the event.
						 locale [in] Type: BSTR The locale name. This value is returned in the locale attribute of the event.
						 */
						e.initKeyboardEvent( type, _bubbles, _cancelable, global, _key, _location, modifiersListArg, _repeat, _locale );
						e["__char"] = _char;
					}
					else if( _initKeyboardEvent_type == 5 ) { // FireFox|w3c
						/*
						 http://www.w3.org/TR/DOM-Level-3-Events/#events-KeyboardEvent-initKeyboardEvent
						 https://developer.mozilla.org/en/DOM/KeyboardEvent#initKeyboardEvent()
						 void initKeyboardEvent(
						 in DOMString typeArg,
						 in boolean canBubbleArg,
						 in boolean cancelableArg,
						 in views::AbstractView viewArg,
						 in DOMString charArg,
						 in DOMString keyArg,
						 in unsigned long locationArg,
						 in DOMString modifiersListArg,
						 in boolean repeat,
						 in DOMString localeArg
						 );
						 */
						e.initKeyboardEvent( type, _bubbles, _cancelable, global, _char, _key, _location, modifiersListArg, _repeat, _locale );
					}
					else { // w3c TODO:: test for browsers that implement it
						/*
						 http://docs.webplatform.org/wiki/dom/methods/initKeyboardEvent
						 initKeyboardEvent(
						 eventType
						 canBubble
						 cancelable
						 view
						 key
						 location
						 modifiersList
						 repeat
						 locale);
						 */
						e.initKeyboardEvent( type, _bubbles, _cancelable, global, _key, _location, modifiersListArg, _repeat, _locale );
					}
					success_init = true;
				}
				catch ( __e__ ) {
					_try_initKeyboardEvent = false;
				}
			}
		}


		if( !success_init ) {
			e.initEvent( type, _bubbles, _cancelable, global );
			e["__char"] = _char;
			e["__key"] = _key;
			e["__location"] = _location;
		}

		for( _prop_name in _keyboardEvent_properties_dictionary )if( _hasOwnProperty( _keyboardEvent_properties_dictionary, _prop_name ) ) {
			if( e[_prop_name] != localDict[_prop_name] ) {
				delete e[_prop_name];
				_Object_defineProperty( e, _prop_name, { writable: true, "value": localDict[_prop_name] } );
			}
		}

		if( !("isTrusted" in e) )e.isTrusted = false;

		return e;
	}

	_KeyboardEvent["DOM_KEY_LOCATION_STANDARD"] = _DOM_KEY_LOCATION_STANDARD; // Default or unknown location
	_KeyboardEvent["DOM_KEY_LOCATION_LEFT"] = _DOM_KEY_LOCATION_LEFT; // e.g. Left Alt key
	_KeyboardEvent["DOM_KEY_LOCATION_RIGHT"] = _DOM_KEY_LOCATION_RIGHT; // e.g. Right Alt key
	_KeyboardEvent["DOM_KEY_LOCATION_NUMPAD"] = _DOM_KEY_LOCATION_NUMPAD; // e.g. Numpad 0 or +
	_KeyboardEvent["DOM_KEY_LOCATION_MOBILE"] = _DOM_KEY_LOCATION_MOBILE;
	_KeyboardEvent["DOM_KEY_LOCATION_JOYSTICK"] = _DOM_KEY_LOCATION_JOYSTICK;
	_KeyboardEvent.prototype = _KeyboardEvent_prototype;

	tmp = new _KeyboardEvent( "keyup" );

	try {
		delete tmp["keyCode"];
		_Object_defineProperty( tmp, "keyCode", { "writable": true, "value": 9 } );
		delete tmp["which"];
		_Object_defineProperty( tmp, "which", { "writable": true, "value": 9 } );
	}
	catch(e){}

	canOverwrite_which = tmp.which === 9;

	if( !(canOverwrite_keyCode = tmp.keyCode == 9) && _Event_prototype__native_keyCode_getter ) {
		_Object_defineProperty( _KeyboardEvent_prototype, "keyCode", {
			"enumerable": true,
			"configurable": true,
			"get": function() {
				if( "__keyCode" in this )return this["__keyCode"];

				return _Event_prototype__native_keyCode_getter.call( this );
			},
			"set": function( newValue ) {
				return this["__keyCode"] = isNaN( newValue ) ? 0 : newValue;
			}
		} );
		_Object_defineProperty( _KeyboardEvent_prototype, "charCode", {
			"enumerable": true,
			"configurable": true,
			"get": function() {
				if( "__charCode" in this )return this["__charCode"];

				return _Event_prototype__native_keyCode_getter.call( this );
			},
			"set": function( newValue ) {
				return this["__charCode"] = isNaN( newValue ) ? 0 : newValue;
			}
		} );
	}
	else {
		_Event_prototype__native_keyCode_getter = void 0;

		/*ovewrite_keyCode_which_charCode = function(key) {
		 //["which", "keyCode", "charCode"].forEach
		 var _event = this["e"]
		 , _keyCode = this["k"]
		 ;
		 if(!_event || !_keyCode)return;

		 delete _event[key];
		 _Object_defineProperty(_event, key, {value : _keyCode});
		 }*/
	}

	if( __GCC__NEW_KEYBOARD_EVENTS_PROPOSAL__ ) {
		/**
		 * @this {Event}
		 * @param {string} originalKey
		 * */
		newKeyboadrEvent_key_property_proposal__getKey_ = function( originalKey ) {
			originalKey = originalKey || "";
			if( originalKey.length > 1 ) {//fast IS SPECIAL KEY
				return originalKey;
			}

			var eventKeyCode = this.which || this.keyCode;

			if( this.type == "keypress" ) {
				//http://www.w3.org/TR/DOM-Level-3-Events/#event-type-keypress
				//Warning! the keypress event type is defined in this specification for reference and completeness, but this specification deprecates the use of this event type. When in editing contexts, authors can subscribe to the "input" event defined in [HTML5] instead.

				eventKeyCode += _KEYPRESS_VK__CHARACTER_KEYS__DOWN_UP_DELTA;
			}

			var vkCharacterKey = VK__CHARACTER_KEYS__DOWN_UP[eventKeyCode]
				, value_is_object = vkCharacterKey && typeof vkCharacterKey == "object"
				, _key = value_is_object ? vkCharacterKey._key : vkCharacterKey
				, _keyCode
			;

			if(_key)return _key;

			_keyCode = vkCharacterKey && vkCharacterKey._keyCode
				|| (eventKeyCode > 64 && eventKeyCode < 91 && eventKeyCode)//a-z
			;

			return (_keyCode && String.fromCharCode( _keyCode ) || originalKey).toLowerCase()
		}
	}

	function _helper_isRight_keyIdentifier ( _keyIdentifier ) {
		return _keyIdentifier && !(_keyIdentifier in VK__FAILED_KEYIDENTIFIER) && _keyIdentifier.substring( 0, 2 ) !== "U+";
	}

	_Object_defineProperty( _KeyboardEvent_prototype, "key", {
		"enumerable": true,
		"configurable": true,
		"get": function() {
			var thisObj = this
				, value
			;

			if( _Event_prototype__native_key_getter ) {//IE9 & Opera
				value = _Event_prototype__native_key_getter.call( thisObj );

				if( value && value.length < 2 || _helper_isRight_keyIdentifier(value) ) {
					if( __GCC__NEW_KEYBOARD_EVENTS_PROPOSAL__ ) {
						return newKeyboadrEvent_key_property_proposal__getKey_.call( this, value );
					}
					else {
						return value;
					}
				}
			}

			if( "__key" in thisObj )return thisObj["__key"];

			if( !(thisObj.type in KEYBOARD_EVENTS) )return;

			var _keyCode = thisObj.which || thisObj.keyCode
				, notKeyPress = thisObj.type != "keypress"
				, value_is_object
			;

			if( notKeyPress ) {
				if( "keyIdentifier" in thisObj && _helper_isRight_keyIdentifier( thisObj["keyIdentifier"] ) ) {
					value = thisObj["keyIdentifier"];
				}
				else if( !__GCC__NEW_KEYBOARD_EVENTS_PROPOSAL__ || !notKeyPress || (value = VK__NON_CHARACTER_KEYS[_keyCode]) ) {
					value = value || VK__CHARACTER_KEYS__DOWN_UP[_keyCode];
					value_is_object = value && typeof value == "object";
					value =
						(value_is_object ? value._key : value) ||
							thisObj["char"]//char getter
					;
				}
				else {
					value = newKeyboadrEvent_key_property_proposal__getKey_.call( this, value );
				}
			}
			else { // For keypress
				value = thisObj["char"];//char getter
			}

			__Property_descriptor__["value"] = value;
			_Object_defineProperty(thisObj, "__key", __Property_descriptor__);
			return value;
		}
	} );
	_Object_defineProperty( _KeyboardEvent_prototype, "char", {
		"enumerable": true,
		"configurable": true,
		"get": function() {
			var thisObj = this;

			if( !(thisObj.type in KEYBOARD_EVENTS) )return;

			if( thisObj.ctrlKey
				|| thisObj.altKey
				|| thisObj.metaKey
			) {
				return "";
			}

			if( "__char" in thisObj )return thisObj["__char"];

			var value
				, notKeyPress = thisObj.type != "keypress"
				, _keyCode = !notKeyPress && thisObj["__keyCode"] || thisObj.which || thisObj.keyCode
				, value_is_object
			;

			if( notKeyPress && (value = VK__NON_CHARACTER_KEYS[_keyCode]) && !(typeof value == "object") ) {
				//Test for Special key (Esc, Shift, Insert etc) and that this Special key has no "char" value
				return "";
			}

			if( _Event_prototype__native_char_getter && (value = _Event_prototype__native_char_getter.call( thisObj )) !== null ) {//IE9 & Opera
				//unfortunately after initKeyboardEvent _Event_prototype__native_char_getter starting to return "null"
				//so save 'true' char in "__char"
			}
			else {
				value = VK__CHARACTER_KEYS__DOWN_UP[_keyCode] || VK__NON_CHARACTER_KEYS[_keyCode];
				value_is_object = value && typeof value == "object";

				if( !value_is_object || value._char === false ) {
					//For special keys event.char is empty string (or "Undeterminade" as in spec)
					value = "";
				}
				else if( value_is_object && value._char !== void 0 ) {
					value = value._char || "";
				}
				else {
					if( "keyIdentifier" in thisObj && _helper_isRight_keyIdentifier( thisObj["keyIdentifier"] ) ) {//webkit
						value = "";
					}
					else {
						/*TODO:: remove this block
						 if( notKeyPress && value_is_object && value._keyCode ) {
						 //_keyCode = value._keyCode;
						 }*/
						value = String.fromCharCode( _keyCode );
						if( notKeyPress && !thisObj.shiftKey ) {
							value = value.toLowerCase();
						}
					}
				}

			}

			__Property_descriptor__["value"] = value;
			_Object_defineProperty(thisObj, "__char", __Property_descriptor__);
			return value;
		}
	} );
	_getter_KeyboardEvent_location = function() {
		var thisObj = this;

		if( _Event_prototype__native_location_getter ) {//IE9
			return _Event_prototype__native_location_getter.call( this );
		}

		if( "__location" in thisObj )return thisObj["__location"];

		if( !(thisObj.type in KEYBOARD_EVENTS) )return;

		var _keyCode = thisObj.which || thisObj.keyCode
			, notKeyPress = thisObj.type != "keypress"
			, value
		;

		/*Not working with _KeyboardEvent function and do we realy need this anyway?
		 if(thisObj.type == "keypress") {
		 //TODO:: tests
		 value = 0;
		 }
		 else */
		if( "keyLocation" in thisObj ) {//webkit
			value = thisObj["keyLocation"];
		}
		else {
			value = notKeyPress && (VK__NON_CHARACTER_KEYS[_keyCode] || VK__CHARACTER_KEYS__DOWN_UP[_keyCode]);
			value = typeof value == "object" && value._location || _DOM_KEY_LOCATION_STANDARD;
		}

		__Property_descriptor__["value"] = value;
		_Object_defineProperty(thisObj, "__location", __Property_descriptor__);
		return value;
	};
	_Object_defineProperty( _KeyboardEvent_prototype, "location", {
		"enumerable": true,
		"configurable": true,
		"get": _getter_KeyboardEvent_location
	} );

	function _keyDownHandler ( e ) {
		var _keyCode = e.which || e.keyCode
			, thisObj = this._this
			, listener
			, _
			, vkNonCharacter
			// There is no keypress event for Ctrl + <any key> and Alt + <any key>
			//  and "char" property for for such a key combination is undefined.
			//  Not even trying to find out "char" value. It's useless
		;

		/*TODO: testing
		 if(canOverwrite_keyCode && vkCommon && vkCommon._keyCode && e.keyCode != vkCommon._keyCode) {
		 ["which", "keyCode", "charCode"].forEach(ovewrite_keyCode_which_charCode, {"e" : e, "k" : vkCommon._keyCode});
		 }*/

		if( // passed event if the is no need to transform it
			e.ctrlKey || e.altKey || e.metaKey//Special events
			|| ((vkNonCharacter = VK__NON_CHARACTER_KEYS[_keyCode]) && vkNonCharacter._key !== 0)
			|| e["__key"] || e.isTrusted === false // Synthetic event
		) {
			listener = this._listener;

			if( typeof listener === "object" ) {
				if( "handleEvent" in listener ) {
					thisObj = listener;
					listener = listener.handleEvent;
				}
			}

			if( listener && listener.apply ) {
				listener.apply( thisObj, arguments );
			}
		}
		else {
			_ = thisObj["_"] || (thisObj["_"] = {});
			_[_shim_event_keyCodeUUID] = _keyCode;

			//Fix Webkit keyLocation bug ("i", "o" and others keys "keyLocation" in 'keypress' event == 3. Why?)
			if( "keyLocation" in e ) {//TODO:: tests
				_["_keyLocation"] = e.keyLocation;
			}
		}
	}

	function _keyDown_via_keyPress_Handler ( e ) {
		var _keyCode
			, _charCode = e.which || e.keyCode
			, thisObj = this
			, _ = thisObj["_"]
			, _event
			, need__stopImmediatePropagation__and__preventDefault
			, vkCharacterKey
			, __key
		;

		if( e["__stopNow"] )return;

		if( _ && _shim_event_keyCodeUUID in _ ) {
			_keyCode = _[_shim_event_keyCodeUUID];
			delete _[_shim_event_keyCodeUUID];

			e["__keyCode"] = _keyCode;//save keyCode from 'keydown' and 'keyup' for 'keypress'

			if( vkCharacterKey = VK__CHARACTER_KEYS__DOWN_UP[_keyCode]) {
				if( IS_NEED_KEYCODE_BUGFIX && vkCharacterKey._keyCode ) {
					_keyCode = vkCharacterKey._keyCode;
				}
			}

			//Fix Webkit keyLocation bug ("i", "o" and others keys "keyLocation" in 'keypress' event == 3. Why?)
			if( "keyLocation" in e && "_keyLocation" in _ ) {//webkit//TODO:: tests
				delete e.keyLocation;
				e.keyLocation = _["_keyLocation"];
			}

			if( __GCC__NEW_KEYBOARD_EVENTS_PROPOSAL__ ) {
				if( _keyCode < 91 && _keyCode > 64 && _charCode != _keyCode && (!VK__CHARACTER_KEYS__DOWN_UP[_keyCode]) ) {
					vkCharacterKey = vkCharacterKey || (VK__CHARACTER_KEYS__DOWN_UP[_keyCode] = {});
					vkCharacterKey._keyCode = _keyCode;
				}
			}

			__key = vkCharacterKey && vkCharacterKey._key || (String.fromCharCode(_keyCode)).toLowerCase();

			e["__key"] = __key;
			e["__char"] = String.fromCharCode(_charCode);

			_event = new global["KeyboardEvent"]( "keydown", e );

			delete _event["keyLocation"];//webkit //TODO: need this???
			delete _event["__location"];

			if( canOverwrite_which ) {//Not Safari
				delete _event["which"];
				_Object_defineProperty( _event, "which", {"value": _keyCode} );
			}
			else {
				_event["__which"] = _keyCode;
			}
			if( canOverwrite_keyCode ) {//Not IE9 | Not Safari
				delete _event["keyCode"];
				_Object_defineProperty( _event, "keyCode", {"value": _keyCode} );
			}
			_event["__location"] = _getter_KeyboardEvent_location.call( _event );

			if( !_Event_prototype__native_key_getter ) {//Not IE9 & Opera 12
				vkCharacterKey = vkCharacterKey || (vkCharacterKey = VK__CHARACTER_KEYS__DOWN_UP[_charCode] = VK__CHARACTER_KEYS__DOWN_UP[_keyCode] = {});

				vkCharacterKey._char = _event["char"];

				if( !__GCC__NEW_KEYBOARD_EVENTS_PROPOSAL__ ) {
					vkCharacterKey._key = vkCharacterKey._char;
				}
			}

			need__stopImmediatePropagation__and__preventDefault = !(e.target || thisObj).dispatchEvent( _event );
			//if need__stopImmediatePropagation__and__preventDefault == true -> preventDefault and stopImmediatePropagation
		}
		else {
			//handle key what not generate character's key
			need__stopImmediatePropagation__and__preventDefault = (
				!e.ctrlKey &&
					(_ = VK__CHARACTER_KEYS__DOWN_UP[_charCode]) && (typeof _ == "object" ? _._key || "" : _).length > 1
				) ?
				2//Only stopImmediatePropagation
				:
				0//Nothing
			;
		}

		if( need__stopImmediatePropagation__and__preventDefault ) {
			if( need__stopImmediatePropagation__and__preventDefault === true ) {
				e.preventDefault();
			}

			if( _Event_has_stopImmediatePropagation ) {
				e.stopImmediatePropagation();
			}
			else {
				e["__stopNow"] = true;
				e.stopPropagation();
			}
		}
	}

	/*
	 var __TEMP_KEY
	 , __TEMP_KEYCODE
	 , __TEMP_CHAR
	 , __TEMP_KEYLOCATION
	 ;

	 document.addEventListener("mousedown", function(e) {
	 //debugger
	 var _keyCode = e.which || e.keyCode
	 , thisObj = this
	 , listener
	 , special = e.ctrlKey || e.altKey
	 , vkCommon = VK__NON_CHARACTER_KEYS[_keyCode]
	 ;

	 if(special || vkCommon && vkCommon._key !== 0 || e["__key"]) {

	 }
	 else {
	 __TEMP_KEYCODE = _keyCode;

	 //Fix Webkit keyLocation bug ("i", "o" and others keys "keyLocation" in 'keypress' event == 3. Why?)
	 if("keyLocation" in e) {//TODO:: tests
	 __TEMP_KEYLOCATION = e.keyLocation;
	 }

	 e.stopImmediatePropagation();
	 }
	 }, true);*/
	if( !_Event_prototype__native_char_getter ) {
		[
			(tmp = global["Document"]) && tmp.prototype || global["document"],
			(tmp = global["HTMLDocument"]) && tmp.prototype,
			(tmp = global["Window"]) && tmp.prototype || global,
			(tmp = global["Node"]) && tmp.prototype,
			(tmp = global["Element"]) && tmp.prototype
		].forEach( function( prototypeToFix ) {
				if(!prototypeToFix || !_hasOwnProperty(prototypeToFix, "addEventListener"))return;
				
				var old_addEventListener = prototypeToFix.addEventListener
					, old_removeEventListener = prototypeToFix.removeEventListener
				;

				if( old_addEventListener ) {					
					prototypeToFix.addEventListener = function( type, listener, useCapture ) {
						var thisObj = this
							, _
							, _eventsUUID
							, _event_UUID
							, _events_countUUID
						;

						if( (type + "").toLowerCase() === "keydown" ) {
							//debugger
							_eventsUUID = _event_eventsUUID + (useCapture ? "-" : "") + type;
							_event_UUID = _eventsUUID + (listener[_event_handleUUID] || (listener[_event_handleUUID] = ++UUID));
							_events_countUUID = _eventsUUID + "__count";

							if( !(_ = this["_"]) )_ = this["_"] = {};

							if( _event_UUID in _ )return;

							if( _[_events_countUUID] === void 0 ) {
								old_addEventListener.call( thisObj, "keypress", _keyDown_via_keyPress_Handler, true );
							}

							_[_events_countUUID] = (_[_events_countUUID] || 0) + 1;

							arguments[1] = _[_event_UUID] = _unSafeBind.call( _keyDownHandler, {_listener: listener, _this: this} );
						}

						return old_addEventListener.apply( thisObj, arguments );
					};

					if( old_removeEventListener )prototypeToFix.removeEventListener = function( type, listener, useCapture ) {
						var thisObj = this
							, _
							, _eventsUUID
							, _event_UUID
							, _events_countUUID
						;

						if( (type + "").toLowerCase() === "keydown" ) {
							_eventsUUID = _event_eventsUUID + (useCapture ? "-" : "") + type;
							_event_UUID = _eventsUUID + listener[_event_handleUUID];
							_events_countUUID = _eventsUUID + "__count";
							_ = thisObj["_"];

							if( _event_UUID && _ && _[_events_countUUID] ) {
								--_[_events_countUUID];

								if( arguments[1] = _[_event_UUID] ) {
									delete _[_event_UUID];
								}
							}
						}

						return old_removeEventListener.apply( thisObj, arguments );
					};
				}
			} );	
	}
	else {
		document.addEventListener("keydown", function(e) {
			var _char = (_Event_prototype__native_char_getter ? _Event_prototype__native_char_getter.call(e) : e["char"])
				, _charCode = _char && _char.charCodeAt(0)
				, _keyCode
				, vkCharacter
				, vkCharacter_key
			;
			if( _charCode && !(VK__CHARACTER_KEYS__DOWN_UP[_charCode += _KEYPRESS_VK__CHARACTER_KEYS__DOWN_UP_DELTA]) ) {
				vkCharacter = VK__CHARACTER_KEYS__DOWN_UP[_charCode] = {};
				_keyCode = e.keyCode;
				if( vkCharacter_key = VK__CHARACTER_KEYS__DOWN_UP[_keyCode] ) {
					_char = typeof vkCharacter_key == "object" && vkCharacter_key._key || vkCharacter_key;
				}
				else {
					_char = String.fromCharCode(_keyCode);
				}
				if(_keyCode > 64 && _keyCode < 91 && _keyCode) {//a-z
					_char = _char.toLowerCase();
				}
				vkCharacter._key = _char;
			}
		}, true);
	}


	//export
	global["KeyboardEvent"] = _KeyboardEvent;

	//cleaning
	_DOM_KEY_LOCATION_LEFT = _DOM_KEY_LOCATION_RIGHT = _DOM_KEY_LOCATION_NUMPAD = _DOM_KEY_LOCATION_MOBILE = _DOM_KEY_LOCATION_JOYSTICK =
		_Object_getOwnPropertyDescriptor = getObjectPropertyGetter = tmp = testKeyboardEvent = _KeyboardEvent = _KeyboardEvent_prototype = __i =
			_Event_prototype = _userAgent_ = _BROWSER = _IS_MAC = null;
}.call( this );
