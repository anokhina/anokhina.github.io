function notesPlayer(audioElem, visualObjEl) {
	if (ABCJS.synth.supportsAudio()) {
		var synthControl = new ABCJS.synth.SynthController();
    var CursorControl = function() {};
    var cursorControl = new CursorControl();
    var audioParams = { chordsOff: true };
		synthControl.load(audioElem,
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
		createSynth.init({ visualObj: visualObjEl }).then(function () {
			synthControl.setTune(visualObjEl, false, audioParams).then(function () {
				console.log("Audio successfully loaded.")
			}).catch(function (error) {
				console.warn("Audio problem:", error);
			});
		}).catch(function (error) {
			console.warn("Audio problem:", error);
		});
	}
}


function notefile(pathToList, withAudio) {
  const scriptList = document.createElement("script");
  scriptList.src = pathToList;
  scriptList.async = true;
  document.head.appendChild(scriptList);
  scriptList.onload = () => {
    var visualObj = notesin(abc);
    if (withAudio) {
        var div = document.createElement('div');
        document.querySelector('body').appendChild(div);
        notesPlayer(div, visualObj[0]);
    }
  };
}

function notesin(abcString) {
  var div = document.createElement('div');
  document.querySelector('body').appendChild(div);
  return ABCJS.renderAbc(div, abcString, {});
}

function notes(abcString) {
/*
<div class="container">
<main>

<div id="audioshow">&#127911;&#127926;</div>
<div id="audioshowcontent">
  <div class="midi">MIDI</div>
  <div id="audio"></div>
</div>
<div id="paper"></div>

</main>
</div>
*/
{
    var container = document.getElementsByClassName('container')[0];
    container.replaceChildren();
    var main = document.createElement('main');
    container.appendChild(main);
    var audioshowcontent = document.createElement('div');

audioshowcontent
.appendChild(
  Object.assign(
    document.createElement('div'),
    { className: "midi", innerHTML: "MIDI"}
  )
);
audioshowcontent
.appendChild(
  Object.assign(
    document.createElement('div'),
    { id: "audio"}
  )
);

main.appendChild(
  Object.assign(
    document.createElement('div'),
    { id: "audioshow", innerHTML: "&#127911;&#127926;"}
  )
);
main
.appendChild(
  Object.assign(
    audioshowcontent,
    { id: "audioshowcontent"}
  )
);
main
.appendChild(
  Object.assign(
    document.createElement('div'),
    { id: "paper"}
  )
)
}

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

    var paper = document.getElementById('paper');
    var svg = paper.children[0];
    if (svg) {
        var svgWd = paper.children[0].getAttribute("width");
        var hscale = 1;
        if (svgWd &&
            svgWd > self.innerWidth) {
            wscale = (1 * self.innerWidth / (1 * svgWd + 25));
            if ("currentScale" in svg) {
                svg.currentScale = wscale;
            }
        }
    }

    var pageheader = document.getElementById('pageheader');
    var audioshowcontent = document.getElementById('audioshowcontent');
    var audioshow = document.getElementById('audioshow');
    if (audioshowcontent && audioshow) {
        audioshowcontent.style.display="none";
        if (pageheader) pageheader.style.display="none";
        audioshow.addEventListener("click", () => {
            if (audioshowcontent.style.display=="none") {
                audioshowcontent.style.display="block";
                if (pageheader) pageheader.style.display="block";
              } else {
                audioshowcontent.style.display="none";
                if (pageheader) pageheader.style.display="none";
              }
        });
    }

}

function notesIndex(pathToList, prefix) {
  const notesDir = (prefix) ? prefix : "notes/";
  const scriptList = document.createElement("script");
  scriptList.src = pathToList;
  scriptList.async = true;
  document.head.appendChild(scriptList);
  scriptList.onload = () => {

    var abcdownload = document.getElementById('abcdownload');
    abcdownload.style.display="none"
    var abcopen = document.getElementById('abcopen');
    abcopen.style.display="none"

    var noteselect = document.createElement('select');
    noteselect.style.width = "100%";
    noteselect.style.borderColor = "#f1e8e8";
    document.body.appendChild(
      Object.assign(
        noteselect,
        { id: "noteselect", size: 10}
      )
    );
    for (var str of afcfilesStr.split(/\r\n|\r|\n/)) {
      if (!str || /^\s*$/.test(str)) { //isBlank

      } else {
        noteselect.options[noteselect.options.length]=new Option(str.replace(".abc", ""), str);
      }
    }
    noteselect.addEventListener("change", evt => {
      var selectedOption = evt.srcElement.options[evt.srcElement.selectedIndex];
      console.log(selectedOption.value);
      var jsSrc = notesDir + selectedOption.value.replace(' ', '%20');
      const script = document.createElement("script");
      script.src = jsSrc;
      script.async = true;
      document.head.appendChild(script);
      script.onload = () => {
        notes(abc);
        abcdownload.href = jsSrc;
        abcdownload.style.display="inline";
        abcopen.style.display="inline";
        noteselect.style.display="none";
      };
    });
    abcopen.addEventListener("click", evt => {
      evt.preventDefault();
      var container = document.getElementsByClassName('container')[0];
      container.replaceChildren();
      abcopen.style.display="none";
      abcdownload.style.display="none";
      noteselect.style.display="block";
      noteselect.selectedIndex = -1;
    });
  };
}