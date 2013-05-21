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


getHeight = () ->
    (($sentences.find(".word").map () -> $(this).outerHeight()).sort (a,b) -> b-a)[0]

getWidth = (index) -> (
  (sentences.map (sentence) -> sentence[index].element.outerWidth()).sort (a,b) -> b-a)[0]

getLeft = (index) -> if 0==index then 0 else ([0..index-1].map (i) -> getWidth(i)).reduce ((a,b) -> a+b), 0

height = getHeight()

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
    $holder = $ws.append('<span class="holder"></span>').find(".holder").css('height', height).css "-webkit-transform", "translate3d(0, 0px, 0)"
    $rsentence.append $ws
    g.words.forEach (w,i) ->
      $holder.append $('<span class="word"></span>').text(w)
      .attr('data-row', i).addClass(if highlighIndex == wordIndex then 'highlighted' else null)
      .css('height', height).css('top', i*height)
    $holder.prepend $holder.children().last().clone().css('top', -height)




current = 0;
next = () ->
  current++
  top = current*-height
  $(".words .holder").each () ->
    $holder = $(this)
    $holder.children().first().remove()
    lastTop = parseFloat $holder.children().last().css('top')
    $holder.append $holder.children().first().clone().css('top', lastTop + height)
    $holder.css "-webkit-transform", "translate3d(0, " + top + "px, 0)"
  null
  
 back = () ->
  current--
  top = current*-height
  $(".words .holder").each () ->
    $holder = $(this)
    $holder.children().last().remove()
    firstTop = parseFloat $holder.children().first().css('top')
    $holder.prepend $holder.children().last().clone().css('top', firstTop - height)
    $holder.css "-webkit-transform", "translate3d(0, " + top + "px, 0)"
  null