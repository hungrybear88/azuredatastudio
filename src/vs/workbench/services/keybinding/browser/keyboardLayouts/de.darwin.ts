/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { KeyboardLayoutContribution } from 'vs/workbench/services/keybinding/browser/keyboardLayouts/_.contribution';


KeyboardLayoutContribution.INSTANCE.registerKeyboardLayout({
	layout: { id: 'com.apple.keylayout.German', lang: 'de', localizedName: 'German' },
	secondaryLayouts: [],
	mapping: {
		KeyA: ['a', 'A', 'å', 'Å', 0],
		KeyB: ['b', 'B', '∫', '‹', 0],
		KeyC: ['c', 'C', 'ç', 'Ç', 0],
		KeyD: ['d', 'D', '∂', '™', 0],
		KeyE: ['e', 'E', '€', '‰', 0],
		KeyF: ['f', 'F', 'ƒ', 'Ï', 0],
		KeyG: ['g', 'G', '©', 'Ì', 0],
		KeyH: ['h', 'H', 'ª', 'Ó', 0],
		KeyI: ['i', 'I', '⁄', 'Û', 0],
		KeyJ: ['j', 'J', 'º', 'ı', 0],
		KeyK: ['k', 'K', '∆', 'ˆ', 0],
		KeyL: ['l', 'L', '@', 'ﬂ', 0],
		KeyM: ['m', 'M', 'µ', '˘', 0],
		KeyN: ['n', 'N', '~', '›', 4],
		KeyO: ['o', 'O', 'ø', 'Ø', 0],
		KeyP: ['p', 'P', 'π', '∏', 0],
		KeyQ: ['q', 'Q', '«', '»', 0],
		KeyR: ['r', 'R', '®', '¸', 0],
		KeyS: ['s', 'S', '‚', 'Í', 0],
		KeyT: ['t', 'T', '†', '˝', 0],
		KeyU: ['u', 'U', '¨', 'Á', 4],
		KeyV: ['v', 'V', '√', '◊', 0],
		KeyW: ['w', 'W', '∑', '„', 0],
		KeyX: ['x', 'X', '≈', 'Ù', 0],
		KeyY: ['z', 'Z', 'Ω', 'ˇ', 0],
		KeyZ: ['y', 'Y', '¥', '‡', 0],
		Digit1: ['1', '!', '¡', '¬', 0],
		Digit2: ['2', '"', '“', '”', 0],
		Digit3: ['3', '§', '¶', '#', 0],
		Digit4: ['4', '$', '¢', '£', 0],
		Digit5: ['5', '%', '[', 'ﬁ', 0],
		Digit6: ['6', '&', ']', '^', 8],
		Digit7: ['7', '/', '|', '\\', 0],
		Digit8: ['8', '(', '{', '˜', 0],
		Digit9: ['9', ')', '}', '·', 0],
		Digit0: ['0', '=', '≠', '¯', 0],
		Enter: [],
		Escape: [],
		Backspace: [],
		Tab: [],
		Space: [' ', ' ', ' ', ' ', 0],
		Minus: ['ß', '?', '¿', '˙', 0],
		Equal: ['´', '`', '\'', '˚', 3],
		BracketLeft: ['ü', 'Ü', '•', '°', 0],
		BracketRight: ['+', '*', '±', '', 0],
		Backslash: ['#', '\'', '‘', '’', 0],
		Semicolon: ['ö', 'Ö', 'œ', 'Œ', 0],
		Quote: ['ä', 'Ä', 'æ', 'Æ', 0],
		Backquote: ['<', '>', '≤', '≥', 0],
		Comma: [',', ';', '∞', '˛', 0],
		Period: ['.', ':', '…', '÷', 0],
		Slash: ['-', '_', '–', '—', 0],
		CapsLock: [],
		F1: [],
		F2: [],
		F3: [],
		F4: [],
		F5: [],
		F6: [],
		F7: [],
		F8: [],
		F9: [],
		F10: [],
		F11: [],
		F12: [],
		Insert: [],
		Home: [],
		PageUp: [],
		Delete: [],
		End: [],
		PageDown: [],
		ArrowRight: [],
		ArrowLeft: [],
		ArrowDown: [],
		ArrowUp: [],
		NumLock: [],
		NumpadDivide: ['/', '/', '/', '/', 0],
		NumpadMultiply: ['*', '*', '*', '*', 0],
		NumpadSubtract: ['-', '-', '-', '-', 0],
		NumpadAdd: ['+', '+', '+', '+', 0],
		NumpadEnter: [],
		Numpad1: ['1', '1', '1', '1', 0],
		Numpad2: ['2', '2', '2', '2', 0],
		Numpad3: ['3', '3', '3', '3', 0],
		Numpad4: ['4', '4', '4', '4', 0],
		Numpad5: ['5', '5', '5', '5', 0],
		Numpad6: ['6', '6', '6', '6', 0],
		Numpad7: ['7', '7', '7', '7', 0],
		Numpad8: ['8', '8', '8', '8', 0],
		Numpad9: ['9', '9', '9', '9', 0],
		Numpad0: ['0', '0', '0', '0', 0],
		NumpadDecimal: [',', ',', '.', '.', 0],
		IntlBackslash: ['^', '°', '„', '“', 1],
		ContextMenu: [],
		NumpadEqual: ['=', '=', '=', '=', 0],
		F13: [],
		F14: [],
		F15: [],
		F16: [],
		F17: [],
		F18: [],
		F19: [],
		F20: [],
		AudioVolumeMute: [],
		AudioVolumeUp: ['', '=', '', '=', 0],
		AudioVolumeDown: [],
		NumpadComma: [],
		IntlRo: [],
		KanaMode: [],
		IntlYen: [],
		ControlLeft: [],
		ShiftLeft: [],
		AltLeft: [],
		MetaLeft: [],
		ControlRight: [],
		ShiftRight: [],
		AltRight: [],
		MetaRight: []
	}
});
