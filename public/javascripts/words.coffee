sentences = [
  ['I', 'am', 'a', 'very', 'happy', 'person'],
  ['You', 'are', 'a', 'very', 'happy and joyful', 'person'],
  ['You and me', 'are', '', 'very', 'happy', 'co-workers'],
]

highlighIndex = 1

$sentences = $(".sentences")
sentences = sentences.map (sentence) ->
  $s = $('<div class="sentence"></div>').appendTo $sentences
  sentence.map (word) ->
    $w = $('<span class="word"></span>').text(word).appendTo($s)
    {word: word, element: $w}



getWidth = (index) -> (
  (sentences.map (sentence) -> sentence[index].element.outerWidth()).sort (a,b) -> b-a)[0]

getLeft = (index) -> if 0==index then 0 else ([0..index-1].map (i) -> getWidth(i)).reduce ((a,b) -> a+b), 0


groups = [];
sentences.forEach (sentence, i) ->
  sentence.forEach (word, j) ->
    if !groups[j] 
        groups[j] = {words: [word.word], pos: {width: getWidth(j), left: getLeft(j)}} 
    else 
        groups[j].words.push(word.word)
    word.element.css {
      'left': getLeft(j)
      'width': getWidth(j)
    }

$sentences.addClass("aligned")

$rsentence = $(".rotating-sentence");
groups.forEach (g, wordIndex) ->
    $ws = $('<span class="words"></span>').css {
      'left': g.pos.left
      'width': g.pos.width
    }
    $holder = $ws.append('<span class="holder"></span>').find(".holder")
    $rsentence.append $ws
    g.words.forEach (w,i) ->
      $holder.append $('<span class="word"></span>').text(w).attr('data-row', i).addClass(if highlighIndex == wordIndex then 'highlighted' else null)
    $holder.prepend $holder.children().last().clone()




current = 1;
next = () ->
  $(".words").each () ->
    $ws = $(this)
    $ws.children().first().remove()
    $ws.append $ws.children().first().clone()
  current++;
  top = current*-100
  console.log "translate3d(0, " + top + "%, 0)"
  $rsentence.find(".word").css "-webkit-transform", "translate3d(0, " + top + "%, 0)"
  null