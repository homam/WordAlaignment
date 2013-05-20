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


#getLeft = (index) -> ((sentences.map (sentence) -> ((sentence.filter (w, i)-> i<index).map (w)->w.width).reduce ((a,b) -> a+b), 0).sort (a,b) -> b-a)[0]

getWidth = (index) -> (
  (sentences.map (sentence) -> sentence[index].element.outerWidth()).sort (a,b) -> b-a)[0]

getLeft = (index) -> if 0==index then 0 else ([0..index-1].map (i) -> getWidth(i)).reduce ((a,b) -> a+b), 0


sentences.forEach (sentence, i) ->
  sentence.forEach (word, j) ->
    console.log word.word, getLeft(j)
    word.element.css {
      'left': getLeft(j)
      'width': getWidth(j)
    }

$sentences.addClass("aligned")