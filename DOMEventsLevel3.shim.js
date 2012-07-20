 /** DOM Keyboard Event Level 3 polyfill
  * @license MIT License (c) copyright Egor Halimonenko (termi1uc1@gmail.com) */

// ==ClosureCompiler==
// @compilation_level ADVANCED_OPTIMIZATIONS
// @warning_level VERBOSE
// @jscomp_warning missingProperties
// @output_file_name DOMEventsLevel3.shim.min.js
// @check_types
// ==/ClosureCompiler==
/**
 * @version 0.2
 * TODO::
 * 0. refactoring and JSDoc's
 * 1. Example as http://www.w3.org/2002/09/tests/keys.html
 * 2. Bug fixing:
 *   - FF: {key: "+", location: 0} and {key: "-", location: 0} as {key: "Add", location: 3} and {key: "Subtract", location: 3}
 *   - FF: char "[" (keyCode:91) or "\"(keyCode:92) for key "OS"
 *
 * TODO Links:
 * 1. http://help.dottoro.com/ljlwfxum.php | onkeypress event | keypress event
 * 2. http://api.jquery.com/event.preventDefault/#comment-31391501 | Bug in Opera with keypress
 * 3. http://www.w3.org/TR/DOM-Level-3-Events/#events-keyboard-event-order
 * 4. http://www.quirksmode.org/dom/events/keys.html
 * 5. http://stackoverflow.com/questions/9200589/keypress-malfunction-in-opera
/*
http://www.w3.org/TR/DOM-Level-3-Events/#events-KeyboardEvent
http://dev.w3.org/2006/webapi/DOM-Level-3-Events/html/DOM3-Events.html#events-KeyboardEvent
*/

if(!function(global) {
	try {
		return ("key" in new global["KeyboardEvent"]("keyup"));
	}
	catch(__e__) {
		return false;
	}
}(window))(function(global) {

//

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

var _DOM_KEY_LOCATION_STANDARD      = 0x00 // Default or unknown location
  , _DOM_KEY_LOCATION_LEFT          = 0x01 // e.g. Left Alt key
  , _DOM_KEY_LOCATION_RIGHT         = 0x02 // e.g. Right Alt key
  , _DOM_KEY_LOCATION_NUMPAD        = 0x03 // e.g. Numpad 0 or +
  , _DOM_KEY_LOCATION_MOBILE        = 0x04
  , _DOM_KEY_LOCATION_JOYSTICK      = 0x05
  /**
   *Key map based on http://calormen.com/polyfill/keyboard.js
   * @const
   */
  , VK_COMMON = {
		0x03: 'Cancel', // char \x0018 ???
		0x06: 'Help', // ???
		0x08: 'Backspace',
		0x09: 'Tab',
		0X0C: 'Clear', // NumPad Center
		0X0D: 'Enter',

		0x10: 'Shift',
		0x11: 'Control',
		0x12: 'Alt',
		0x13: 'Pause', // TODO:: not in [key-values-list], but usefull
		0x14: 'CapsLock',

		0x15: 'KanaMode', // IME
		0x16: 'HangulMode', // IME
		0x17: 'JunjaMode', // IME
		0x18: 'FinalMode', // IME
		0x19: 'HanjaMode', // IME
		//  0x19: 'KanjiMode', keyLocation: _KeyboardEvent.DOM_KEY_LOCATION_STANDARD, // IME; duplicate on Windows

		0x1B: 'Esc',

		0x1C: 'Convert', // IME
		0x1D: 'Nonconvert', // IME
		0x1E: 'Accept', // IME
		0x1F: 'ModeChange', // IME

		0x20: 'Spacebar',
		0x21: 'PageUp',
		0x22: 'PageDown',
		0x23: 'End',
		0x24: 'Home',
		0x25: 'Left',
		0x26: 'Up',
		0x27: 'Right',
		0x28: 'Down',
		0x29: 'Select',
		//0x2A: 'Print', // ??? not in [key-values-list]
		0x2B: 'Execute',
		0x2C: 'PrintScreen',
		0x2D: 'Insert',
		0x2E: 'Del',
		0x2F: 'Help', // ???

		/*
		Not realy need this | Not working with non-US charset
		0x30: { _char: '0', _charShifted: ')' }, // 0 )
	    0x31: { _char: '1', _charShifted: '!' }, // 1 !
	    0x32: { _char: '2', _charShifted: '@' }, // 2 @
	    0x33: { _char: '3', _charShifted: '#' }, // 3 #
	    0x34: { _char: '4', _charShifted: '$' }, // 4 $
	    0x35: { _char: '5', _charShifted: '%' }, // 5 %
	    0x36: { _char: '6', _charShifted: '^' }, // 6 ^
	    0x37: { _char: '7', _charShifted: '&' }, // 7 &
	    0x38: { _char: '8', _charShifted: '*' }, // 8 *
	    0x39: { _char: '9', _charShifted: '(' }, // 9 (
	    */

		0x5B: { _key : 'OS', _char: false, _location : _DOM_KEY_LOCATION_LEFT }, // Left Windows
		0x5C: { _key : 'OS', _char: false, _location : _DOM_KEY_LOCATION_RIGHT }, // Right Windows
		0x5D: 'Menu',// 'Context Menu' from [OLD key-values-list]

		// TODO: Test in WebKit
		0x6A: { _key : 'Multiply', _char: '*', _location: _DOM_KEY_LOCATION_NUMPAD },// or 'Asterisk' ?
		0x6B: { _key : 'Add', _char: '+', _location: _DOM_KEY_LOCATION_NUMPAD },
		0x6C: { _key : 'Separator', _char: false,  _location: _DOM_KEY_LOCATION_NUMPAD },// ??? NumPad Enter ???
		0x6D: { _key : 'Subtract', _char: '-', _location: _DOM_KEY_LOCATION_NUMPAD },
		0x6E: { _key : 'Decimal', _char: '.', _location: _DOM_KEY_LOCATION_NUMPAD },
		0x6F: { _key : 'Divide', _char: '/', _location: _DOM_KEY_LOCATION_NUMPAD },

		// TODO: Test in WebKit
		0x90: { _key : 'NumLock', _char: false, _location: _DOM_KEY_LOCATION_NUMPAD },
		0x91: 'ScrollLock',

		// NOTE: Not exposed to browsers so we don't need this
		/*
		0xA0: { _key : 'Shift', _char: false, _location: _DOM_KEY_LOCATION_LEFT },
		0xA1: { _key : 'Shift', _char: false, _location: _DOM_KEY_LOCATION_RIGHT },
		0xA2: { _key : 'Control', _char: false, _location: _DOM_KEY_LOCATION_LEFT },
		0xA3: { _key : 'Control', _char: false, _location: _DOM_KEY_LOCATION_RIGHT },
		0xA4: { _key : 'Alt', _char: false, _location: _DOM_KEY_LOCATION_LEFT },
		0xA5: { _key : 'Alt', _char: false, _location: _DOM_KEY_LOCATION_RIGHT },
		*/

		0xB4: 'LaunchMail',
		0xB5: 'SelectMedia',
		0xB6: 'LaunchApplication1',
		0xB7: 'LaunchApplication2',

		/*
		Not working with non-US charset
		0xBA: {_char: ';', _charShifted: ':'}, // ; : (US Standard)
		0xBB: {_char: '=', _charShifted: '+'}, // = +
		0xBC: {_char: ',', _charShifted: '<'}, // , <
		0xBD: {_char: '-', _charShifted: '_'}, // - _
		0xBE: {_char: '.', _charShifted: '>'}, // . >
		0xBF: {_char: '/', _charShifted: '?'}, // / ? (US Standard)
		0xC0: {_char: '`', _charShifted: '~'}, // ` ~ (US Standard)
		0xDB: {_char: '[', _charShifted: '{'}, // [ { (US Standard)
		0xDC: {_char: '\\', _charShifted: '|'}, // \ | (US Standard)
		0xDD: {_char: ']', _charShifted: '}'}, // ] } (US Standard)
		0xDE: {_char: '\'', _charShifted: '"'}, // ' " (US Standard)
		*/

		// TODO: Check keyIdentifier in WebKit
		0xE0: 'Meta', // Apple Command key
		0xE5: 'Process', // IME

		0xF6: 'Attn',
		0xF7: 'Crsel',
		0xF8: 'Exsel',
		0xF9: 'EraseEof',
		0xFB: 'Zoom',
		0xFE: 'Clear'
	}
	, _IS_MAC = !!~(navigator.platform + "").indexOf("Mac")
	, _BROWSER = {}
	, __i
	, _NEED_KEYCODE_BUGFIX
	, _HAS_OPERA_DUBBLE_KEYPRESS_BUG
;
// TODO: Test in WebKit
VK_COMMON[0x60] = 
VK_COMMON[0x61] = 
VK_COMMON[0x62] = 
VK_COMMON[0x63] = 
VK_COMMON[0x64] = 
VK_COMMON[0x65] = 
VK_COMMON[0x66] = 
VK_COMMON[0x67] = 
VK_COMMON[0x68] = 
VK_COMMON[0x69] = { _key: 0, _location: _DOM_KEY_LOCATION_NUMPAD };
// TODO: Test in WebKit
// 0x70 ~ 0x87: 'F1' ~ 'F24'
for(__i = 135 ; __i > 111 ; --__i)
    VK_COMMON[__i] = "F" + (__i - 111);

//Special

if(global["opera"]) {// Opera special cases
	_NEED_KEYCODE_BUGFIX = true;
	_HAS_OPERA_DUBBLE_KEYPRESS_BUG = true;//TODO::

	/*
	VK_COMMON[43] = VK_COMMON[0x6B];	// key:'Add', char:'+'
	VK_COMMON[43]._keyCode = 107;
	VK_COMMON[43]._needkeypress = true;	// instead of _key: 0
	VK_COMMON[45] = VK_COMMON[0x6D];	// key:'Subtract', char:'-'
	VK_COMMON[45]._keyCode = 109;
	VK_COMMON[45]._needkeypress = true;	// instead of _key: 0
	*/
	VK_COMMON[57351] = VK_COMMON[93];	//'Menu'
	VK_COMMON[0x3D] = {_key: 0, _keyCode: 187};	//'=' (US Standard ? need to ckeck it out)
	VK_COMMON[0x6D] = {_key: 0, _keyCode: 189, /*not for 187 keyCode, but for 109 */_location: 3};	//'-' (US Standard ? need to ckeck it out)

	if(_IS_MAC) {
		/*TODO::
		0x11: { keyIdentifier: 'Meta' },
	    0xE030: { keyIdentifier: 'Control' }
	    */
	}
}
else {
	//browser sniffing
	_BROWSER["names"] = navigator.userAgent.toLowerCase().match(/(mozilla|compatible|chrome|webkit|safari)/gi);
	__i = _BROWSER["names"] && _BROWSER["names"].length || 0;
	while(__i-- > 0)_BROWSER[_BROWSER["names"][__i]] = true;

	if(_BROWSER["mozilla"] && !_BROWSER["compatible"] && !_BROWSER["webkit"]) {// Mozilla special cases
		_NEED_KEYCODE_BUGFIX = true;

		VK_COMMON[0x6D] = {_key: 0, _char: '-', _charShifted: '_', _keyCode: 189};//(US Standard ? need to ckeck it out)
		VK_COMMON[0x3D] = VK_COMMON[0x6B] = {_key: 0, _char: '=', _charShifted: '+', _keyCode: 187};//(US Standard ? need to ckeck it out)
	/*
	0x3B: { keyIdentifier: 'U+00BA', keyName: 'Semicolon', keyChar: ';', keyCharShifted: ':' }, // ; : (US Standard)
	// TODO: Check keyIdentifier in WebKit for numpad
	0xBB: { keyIdentifier: 'Add', keyName: 'Add', keyLocation: KeyboardEvent.DOM_KEY_LOCATION_NUMPAD, keyChar: '+' },
	0xBD: { keyIdentifier: 'Subtract', keyName: 'Subtract', keyLocation: KeyboardEvent.DOM_KEY_LOCATION_NUMPAD, keyChar: '-' }
	*/
	}
	else if(_BROWSER["safari"] && !_BROWSER["chrome"]) {// Safari WebKit special cases
		/*TODO::
		0x03: { keyIdentifier: 'Enter', keyName: 'Enter', keyChar: '\u000D' }, // old Safari
		0x0A: { keyIdentifier: 'Enter', keyName: 'Enter', keyLocation: KeyboardEvent.DOM_KEY_LOCATION_MOBILE, keyChar: '\u000D' }, // iOS
		0x19: { keyIdentifier: 'U+0009', keyName: 'Tab', keyChar: '\u0009'} // old Safari for Shift+Tab
		*/
		if(_IS_MAC) {
			/*
			0x5B: { keyIdentifier: 'Meta', keyLocation: KeyboardEvent.DOM_KEY_LOCATION_LEFT },
			0x5D: { keyIdentifier: 'Meta', keyLocation: KeyboardEvent.DOM_KEY_LOCATION_RIGHT },
			0xE5: { keyIdentifier: 'U+0051', keyName: 'Q', keyChar: 'Q'} // On alternate presses, Ctrl+Q sends this
			*/
		}
	}
	else if(_BROWSER["chrome"]) {// Chrome WebKit special cases
		if(_IS_MAC) {
			/*TODO::
			0x5B: { keyIdentifier: 'Meta', keyLocation: KeyboardEvent.DOM_KEY_LOCATION_LEFT },
			0x5D: { keyIdentifier: 'Meta', keyLocation: KeyboardEvent.DOM_KEY_LOCATION_RIGHT }
			*/
		}
	}
}


var FAILED_KEYIDENTIFIER = {
		'U+0008' : void 0,	// -> 'Backspace'
		'U+0009' : void 0,	// -> 'Tab'
		'U+0020' : void 0,	// -> 'Spacebar'
		'U+007F' : void 0,	// -> 'Del'
		'Escape' : void 0,	// from [OLD key-values-list] -> 'Esc'
		'Win' : void 0, 	// from [OLD key-values-list] -> 'OS'
		'Scroll' : void 0,	// from [OLD key-values-list] -> 'ScrollLock'
		'Apps' : void 0,	// from [OLD key-values-list] -> 'Menu'

		'U+0010' : void 0,	// [test this] -> 'Fn' ?? 'Function' ?
		'U+001C' : void 0,	// [test this] -> 'Left'
		'U+001D' : void 0,	// [test this] -> 'Right'
		'U+001E' : void 0,	// [test this] -> 'Up'
		'U+001F' : void 0,	// [test this] -> 'Down'

		//From Opera impl
		'Window' : void 0, 	// from [OLD key-values-list] -> 'OS'
		'ContextMenu' : void 0, // from [OLD key-values-list] -> 'Menu'
		'Mul' : void 0 // from [OLD key-values-list] -> 'Multiply'
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
	}
  /*
  , os
  , browser
  */
;

// NOTE: 'char' is the default character for that key, and doesn't reflect modifier
// states. It is primarily used here to indicate that this is a non-special key
// BUGS:
// do we need some kind of detection ?
/*TODO::
VK_SPECIAL = {
	// Mozilla special cases
	'moz': {
		0x3B: 'U+00BA', keyName: 'Semicolon', keyChar: ';', _charShifted: ':', // ; : (US Standard)
		0x3D: 'U+00BB', keyName: 'Equals', keyChar: '=', _charShifted: '+', // = +
		0x6B: 'U+00BB', keyName: 'Equals', keyChar: '=', _charShifted: '+', // = +
		0x6D: 'U+00BD', keyName: 'Minus', keyChar: '-', _charShifted: '_', // - _
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

		[true]0x3B: 'U+00BA', _keyCode: 186, keyName: 'Semicolon', keyChar: ';', _charShifted: '', // ; : (US Standard)
		[true]0x3D: 'U+00BB', _keyCode: 187, keyName: 'Equals', keyChar: '=', _charShifted: '', // = +

		[no need]0x6D: 'U+00BD', keyName: 'Minus', keyChar: '-', _charShifted: '_'} // - _
	},
	'opera-mac': {
		0x11: 'Meta',
		0xE030: 'Control' }
	}
};
*/

var _Event_prototype = global["Event"].prototype
  , _KeyboardEvent_prototype = global["KeyboardEvent"] && global["KeyboardEvent"].prototype || _Event_prototype
  , _Object_defineProperty = Object.defineProperty
  , KEYBOARD_EVENTS = {
		"keydown" : void 0,
		"keyup" : void 0,
		"keypress" : void 0
	}
  , UUID = 1
	/** @const @type {string} */
  , _event_handleUUID = "_h_9e2"
  	/** @const @type {string} */
  , _event_eventsUUID = "_e_8vj"
  	/** @const @type {string} */
  , _shim_event_keyUUID = _event_handleUUID + "__key"
  	/** @const @type {string} */
  , _shim_event_charUUID = _event_handleUUID + "__char"
  	/** @const @type {string} */
  , _shim_event_keyCodeUUID = _event_handleUUID + "__keyCode"
  	/** @type {number} Previous keyboard index 1 - keydown, 2 - keypress, 3 - keyup */
  , _previous_keyboardEvent_index

  , _keyboardEvent_properties_dictionary = {
  		"char" : "",
  		"key" : "",
  		"location" : _DOM_KEY_LOCATION_STANDARD,
  		"ctrlKey" : false,
  		"shiftKey" : false,
  		"altKey" : false,
  		"metaKey" : false,
  		"repeat" : false,
  		"locale" : "",

  		"detail" : null,
  		"bubbles" : false,
  		"cancelable" : false
    }

    /** @const */
  , _Array_slice = Array.prototype.slice
  
	/** Use native "bind" or unsafe bind for service and performance needs
	 * @const
	 * @param {Object} object
	 * @param {...} var_args
	 * @return {Function} */
  , _unSafeBind = Function.prototype.bind || function(object, var_args) {
		var __method = this,
			args = _Array_slice.call(arguments, 1);
		return function () {
			return __method.apply(object, args.concat(_Array_slice.call(arguments)));
		}
	}

	/** @const */
  , _hasOwnProperty = _unSafeBind.call(Function.prototype.call, Object.prototype.hasOwnProperty)

  , _try_initKeyboardEvent = true
;

/**
 * http://html5labs.com/dom4events/#constructors-keyboardevent
 * @constructor
 * @param {string} type
 * @param {Object=} dict
 */
function _KeyboardEvent(type, dict) {// KeyboardEvent  constructor
	var e;
	try {
		e = document.createEvent("KeyboardEvent");
	}
	catch(err) {
		e = document.createEvent("Event");
	}

	dict = dict || {};

	var localDict = {}
	  , _prop_name
	;

	for(_prop_name in _keyboardEvent_properties_dictionary)if(_hasOwnProperty(_keyboardEvent_properties_dictionary, _prop_name)) {
		localDict[_prop_name] = _prop_name in dict && dict[_prop_name] !== void 0 ?
			dict[_prop_name]
			:
			_keyboardEvent_properties_dictionary[_prop_name]
		;
	}

	var _ctrlKey = localDict["ctrlKey"]
	  , _shiftKey = localDict["shiftKey"]
	  , _altKey = localDict["altKey"]
	  , _metaKey = localDict["metaKey"]
	  , modifiersListArg = ("" + _ctrlKey && "Control" + _shiftKey && " Shift" + _altKey && " Alt" + _metaKey && " Meta").trim()

	  , _key = localDict["key"]
	  , _char = localDict["char"]
	  , _location = localDict["location"]
	  , _keyCode = _key && _key.charCodeAt(0) || 0 //TODO:: more powerfull key to charCode

	  , _bubbles = localDict["bubbles"]
	  , _cancelable = localDict["cancelable"]

	  , success_init = false
	;

	_keyCode = localDict["keyCode"] = localDict["keyCode"] || _keyCode;
	localDict["which"] = localDict["which"] || _keyCode;

	
	if("initKeyEvent" in e) {
		//https://developer.mozilla.org/en/DOM/event.initKeyEvent

		e.initKeyEvent(type, _bubbles, _cancelable, global, 
                        _ctrlKey, _altKey, _shiftKey, _metaKey, 
                        _keyCode, _keyCode);
		success_init = true;
	}
	else if("initKeyboardEvent" in e) {
		//http://msdn.microsoft.com/en-us/library/ie/ff975297(v=vs.85).aspx
		//https://developer.mozilla.org/en/DOM/KeyboardEvent#initKeyboardEvent()

		/*
		http://stackoverflow.com/a/8490774/1437207
		For Webkit-based browsers (Safari/Chrome), the event initialization call should look a bit differently (see https://bugs.webkit.org/show_bug.cgi?id=13368):
		initKeyboardEvent(in DOMString typeArg, 
              in boolean canBubbleArg, 
              in boolean cancelableArg, 
              in views::AbstractView viewArg, 
              in DOMString keyIdentifierArg, 
              in unsigned long keyLocationArg, 
              in boolean ctrlKeyArg, 
              in boolean shiftKeyArg, 
              in boolean altKeyArg, 
              in boolean metaKeyArg, 
              in boolean altGraphKeyArg);
		*/
		if(_try_initKeyboardEvent) {
			try {
				e.initKeyboardEvent(type, _bubbles, _cancelable, global, _char, _key, _location, modifiersListArg, localDict["repeat"], "");			
				success_init = true;
			}
			catch(__e__) {
				_try_initKeyboardEvent = false;
			}
		}
	}
	

	if(!success_init)e.initEvent(type, _bubbles, _cancelable, global);

	for(_prop_name in _keyboardEvent_properties_dictionary)if(_hasOwnProperty(_keyboardEvent_properties_dictionary, _prop_name)) {
		if(e[_prop_name] != localDict[_prop_name]) {
			delete e[_prop_name];
			_Object_defineProperty(e, _prop_name, { writable : true, "value" : localDict[_prop_name] });
		}
	}
	
	if(!("isTrusted" in e))e.isTrusted = false;

	return e;
};
_KeyboardEvent["DOM_KEY_LOCATION_STANDARD"]      = _DOM_KEY_LOCATION_STANDARD; // Default or unknown location
_KeyboardEvent["DOM_KEY_LOCATION_LEFT"]          = _DOM_KEY_LOCATION_LEFT; // e.g. Left Alt key
_KeyboardEvent["DOM_KEY_LOCATION_RIGHT"]         = _DOM_KEY_LOCATION_RIGHT; // e.g. Right Alt key
_KeyboardEvent["DOM_KEY_LOCATION_NUMPAD"]        = _DOM_KEY_LOCATION_NUMPAD; // e.g. Numpad 0 or +
_KeyboardEvent["DOM_KEY_LOCATION_MOBILE"]        = _DOM_KEY_LOCATION_MOBILE;
_KeyboardEvent["DOM_KEY_LOCATION_JOYSTICK"]      = _DOM_KEY_LOCATION_JOYSTICK;
_KeyboardEvent.prototype = _KeyboardEvent_prototype;

function _helper_isRight_keyIdentifier(_keyIdentifier) {
	return _keyIdentifier && !(_keyIdentifier in FAILED_KEYIDENTIFIER) && _keyIdentifier.substring(0, 2) !== "U+";
}

_Object_defineProperty(_KeyboardEvent_prototype, "key", {
	"enumerable" : true,
	"configurable" : true,
	"get" : function() {
		var thisObj = this;

		if("__key" in thisObj)return thisObj["__key"];

		if(!(thisObj instanceof _KeyboardEvent) && !(thisObj.type in KEYBOARD_EVENTS))return;

		var _keyCode = thisObj.which || thisObj.keyCode
		  , notKeyPress = thisObj.type != "keypress"
		  , value
		;

		if("keyIdentifier" in thisObj && _helper_isRight_keyIdentifier(thisObj["keyIdentifier"])) {
			value = thisObj["keyIdentifier"];
		}
		else {
			value = notKeyPress && VK_COMMON[_keyCode];
			value = 
				(typeof value == "object" ? value._key : value) ||
					thisObj["char"]//char getter
			;
		}

		return this["__key"] = value;
	}
});
_Object_defineProperty(_KeyboardEvent_prototype, "char", {
	"enumerable" : true,
	"configurable" : true,
	"get" : function() {
		var thisObj = this;

		if("__char" in thisObj)return thisObj["__char"];

		if(!(thisObj instanceof _KeyboardEvent) && !(thisObj.type in KEYBOARD_EVENTS))return;

		var _keyCode = thisObj.which || thisObj.keyCode
		  , notKeyPress = thisObj.type != "keypress"
		  , value = notKeyPress && VK_COMMON[_keyCode]
		  , hasShifed_and_Unshifed_value = typeof value == "object" && (typeof value._char != "undefined" || typeof value._charShifted != "undefined")
		  , needLowerCase = (notKeyPress || hasShifed_and_Unshifed_value) && !thisObj.shiftKey
		;

		if(value && (typeof value !== "object" || value._char === false)) {
			value = "";
		}
		else if(hasShifed_and_Unshifed_value) {
			value = (needLowerCase ? value._char : value._charShifted || value._char) || "";
		}
		else {
			if("keyIdentifier" in thisObj && _helper_isRight_keyIdentifier(thisObj["keyIdentifier"])) {
				value = "";
			}
			else {
				value = String.fromCharCode(_keyCode);
				if(needLowerCase)value = value.toLowerCase();
			}
		}

		return this["__char"] = value;
	}
});
function _getter_KeyboardEvent_location() {
	var thisObj = this;

	if("__location" in thisObj)return thisObj["__location"];

	if(!(thisObj instanceof _KeyboardEvent) && !(thisObj.type in KEYBOARD_EVENTS))return;

	var _keyCode = thisObj.which || thisObj.keyCode
	  , notKeyPress = thisObj.type != "keypress"
	  , value
	;

	if("keyLocation" in thisObj) {
		value = thisObj["keyLocation"];
	}
	else {
		value = notKeyPress && VK_COMMON[_keyCode];
		value = typeof value == "object" && value._location || _DOM_KEY_LOCATION_STANDARD;
	}

	return this["__location"] = value;
}
_Object_defineProperty(_KeyboardEvent_prototype, "location", {
	"enumerable" : true,
	"configurable" : true,
	"get" : _getter_KeyboardEvent_location
});


function _keyUp_via_keyPress_Handler(e) {
	var thisObj = this
	  , _ = thisObj["_"] || (thisObj["_"] = {})
	;

	_[_shim_event_keyUUID] = e["key"];
	_[_shim_event_charUUID] = e["char"];
}
function _first_keyUp(e) {
	var thisObj = this
	  , _ = thisObj["_"]
	;

	if(_shim_event_keyUUID in _) {
		e["__key"] = _[_shim_event_keyUUID];
		delete _[_shim_event_keyUUID];
	}
	if(_shim_event_charUUID in _) {
		e["__char"] = _[_shim_event_charUUID];
		delete _[_shim_event_charUUID];
	}
}
function _keyDownHandler(e) {
	//debugger
	var _keyCode = e.which || e.keyCode
	  , thisObj = this._this
	  , listener
	  , _
	  , special = e.ctrlKey || e.altKey
	;

	if(special || _keyCode in VK_COMMON && VK_COMMON[_keyCode]._key !== 0 || e["__key"]) {
		listener = this._listener;

		if(typeof listener !== "function") {
			if("handleEvent" in listener) {
				thisObj = listener;
				listener = listener.handleEvent;
			}
		}

		listener.apply(thisObj, arguments);
	}
	else {
		_ = thisObj["_"] || (thisObj["_"] = {});
		_[_shim_event_keyCodeUUID] = _keyCode;
	}
}
function _keyDown_via_keyPress_Handler(e) {
	//debugger
	var _keyCode
	  , thisObj = this
	  , _ = thisObj["_"]
	  , _event
	;

	if(_ && _shim_event_keyCodeUUID in _) {
		_keyCode = _[_shim_event_keyCodeUUID];
		delete _[_shim_event_keyCodeUUID];
		if(_NEED_KEYCODE_BUGFIX && _keyCode in VK_COMMON && VK_COMMON[_keyCode]._keyCode) {
			_keyCode = VK_COMMON[_keyCode]._keyCode;
		}

		_event = new _KeyboardEvent("keydown", e);
		delete _event["which"];
		delete _event["keyCode"];
		delete _event["__location"];
		delete _event["keyLocation"];
		_Object_defineProperty(_event, "which", {"value" : _keyCode});
		_Object_defineProperty(_event, "keyCode", {"value" : _keyCode});
		_event["location"] = _getter_KeyboardEvent_location.call(_event);//forse getter's

		if(!thisObj.dispatchEvent(_event)) {
			e.preventDefault();
		}
	}
}
[global["HTMLDocument"] && global["HTMLDocument"].prototype || global["document"],
 global["Window"] && global["Window"].prototype || global,
 Element.prototype].forEach(function(elementToFix) {
 	var old_addEventListener = elementToFix.addEventListener,
		old_removeEventListener = elementToFix.removeEventListener;

	if(old_addEventListener) {
		elementToFix.addEventListener = function(type, listener, useCapture) {
			var thisObj = this
			  , _
			  , _eventsUUID
			  , _event_UUID
			  , _events_countUUID
			;

			if(type === "keydown" || type === "keyup") {
				//debugger
				_eventsUUID = _event_eventsUUID + (useCapture ? "-" : "") + type;
				_event_UUID = _eventsUUID + (listener[_event_handleUUID] || (listener[_event_handleUUID] = ++UUID));
				_events_countUUID = _eventsUUID + "__count";
									
				if(!(_ = this["_"]))_ = this["_"] = {};
				
				if(_event_UUID in _)return;

				_[_events_countUUID] = (_[_events_countUUID] || 0) + 1;

				if(type === "keydown") {
					listener = _[_event_UUID] = _unSafeBind.call(_keyDownHandler, {_listener : listener, _this : this});

					if(_[_events_countUUID] == 1) {
						old_addEventListener.call(thisObj, "keypress", _keyDown_via_keyPress_Handler, true);
					}
				}
				else if(type === "keyup") {
					if(_[_events_countUUID] == 1) {
						old_addEventListener.call(thisObj, "keypress", _keyUp_via_keyPress_Handler, true);
						old_addEventListener.call(thisObj, "keyup", _first_keyUp, true);
					}
				}
			}

			return old_addEventListener.call(thisObj, type, listener, useCapture);
		};

		if(old_removeEventListener)elementToFix.removeEventListener = function(type, listener, useCapture) {
			var thisObj = this
			  , _
			  , _eventsUUID
			  , _event_UUID
			  , _events_countUUID
			;

			if(type === "keydown" || type === "keyup") {
				_eventsUUID = _event_eventsUUID + (useCapture ? "-" : "") + type;
				_event_UUID = _eventsUUID + listener[_event_handleUUID];
				_events_countUUID = _eventsUUID + "__count";
				_ = thisObj["_"];

				if(_event_UUID && _ && _[_events_countUUID]) {
					--_[_events_countUUID];

					if(type === "keydown") {
						if(listener = _[_event_UUID]) {
							delete _[_event_UUID];

							return old_removeEventListener.call(thisObj, type, listener, useCapture);
						}
					}
					else if(type === "keyup") {
						if(_[_events_countUUID] == 0) {
							old_removeEventListener.call(thisObj, "keypress", _keyUp_via_keyPress_Handler, true);
							old_removeEventListener.call(thisObj, "keyup", _first_keyUp, true);
						}
					}
				}
			}

			return old_removeEventListener.call(this, type, listener, useCapture);
		};
	}
})

//cleaning
_DOM_KEY_LOCATION_LEFT = _DOM_KEY_LOCATION_RIGHT = _DOM_KEY_LOCATION_NUMPAD = _DOM_KEY_LOCATION_MOBILE = _DOM_KEY_LOCATION_JOYSTICK = void 0;

//export
global["KeyboardEvent"] = _KeyboardEvent;

})(window);