function notes(abcString) {

	var visualOptions = { };
	var visualObj = ABCJS.renderAbc("paper", abcString, visualOptions);

	var midi = ABCJS.synth.getMidiFile(abcString);
	var midiButton = document.querySelector(".midi");
	midiButton.innerHTML = midi;

	var CursorControl = function() {
		this.beatSubdivisions = 2;
		this.onStart = function() {
			console.log("The tune has started playing.");
			var svg = document.querySelector("#paper svg");
			var cursor = document.createElementNS("http://www.w3.org/2000/svg", "line");
			cursor.setAttribute("class", "abcjs-cursor");
			cursor.setAttributeNS(null, 'x1', 0);
			cursor.setAttributeNS(null, 'y1', 0);
			cursor.setAttributeNS(null, 'x2', 0);
			cursor.setAttributeNS(null, 'y2', 0);
			svg.appendChild(cursor);
		}
		this.onFinished = function() {
			console.log("The tune has stopped playing.");
			var els = document.querySelectorAll("svg .highlight");
			for (var i = 0; i < els.length; i++ ) {
				els[i].classList.remove("highlight");
			}
			var cursor = document.querySelector("#paper svg .abcjs-cursor");
			if (cursor) {
				cursor.setAttribute("x1", 0);
				cursor.setAttribute("x2", 0);
				cursor.setAttribute("y1", 0);
				cursor.setAttribute("y2", 0);
			}
		}
		this.onBeat = function(beatNumber) {
			console.log("Beat " + beatNumber + " is happening.");
		}
		this.onEvent = function(ev) {
			console.log("An event is happening", ev);
			if (ev.measureStart && ev.left === null)
				return; // this was the second part of a tie across a measure line. Just ignore it.

			var lastSelection = document.querySelectorAll("#paper svg .highlight");
			for (var k = 0; k < lastSelection.length; k++)
				lastSelection[k].classList.remove("highlight");

			var cursor = document.querySelector("#paper svg .abcjs-cursor");
			if (cursor) {
				cursor.setAttribute("x1", ev.left - 2);
				cursor.setAttribute("x2", ev.left - 2);
				cursor.setAttribute("y1", ev.top);
				cursor.setAttribute("y2", ev.top + ev.height);
			}

		}
	}
	var cursorControl = new CursorControl();
	var audioParams = { chordsOff: true };

	if (ABCJS.synth.supportsAudio()) {
		var synthControl = new ABCJS.synth.SynthController();
		synthControl.load("#audio",
			cursorControl,
			{
				displayLoop: true,
				displayRestart: true,
				displayPlay: true,
				displayProgress: true,
				displayWarp: true
			}
		);

		var createSynth = new ABCJS.synth.CreateSynth();
		createSynth.init({ visualObj: visualObj[0] }).then(function () {
			synthControl.setTune(visualObj[0], false, audioParams).then(function () {
				console.log("Audio successfully loaded.")
			}).catch(function (error) {
				console.warn("Audio problem:", error);
			});
		}).catch(function (error) {
			console.warn("Audio problem:", error);
		});
	} else {
		document.querySelector("#audio").innerHTML =
			"Audio is not supported in this browser.";
	}

}