var $rsentence, $sentences, getLeft, getWidth, groups, highlighIndex, sentences;

sentences = [['I', 'am', 'a', 'very', 'happy', 'person'], ['You', 'are', 'a', 'very', 'happy and joyful', 'person'], ['You and me', 'are', '', 'very', 'happy', 'co-workers']];

highlighIndex = 1;

$sentences = $(".sentences");

sentences = sentences.map(function(sentence) {
  var $s;

  $s = $('<div class="sentence"></div>').appendTo($sentences);
  return sentence.map(function(word) {
    var $w;

    $w = $('<span class="word"></span>').text(word).appendTo($s);
    return {
      word: word,
      element: $w
    };
  });
});

getWidth = function(index) {
  return ((sentences.map(function(sentence) {
    return sentence[index].element.outerWidth();
  })).sort(function(a, b) {
    return b - a;
  }))[0];
};

getLeft = function(index) {
  var _i, _ref, _results;

  if (0 === index) {
    return 0;
  } else {
    return ((function() {
      _results = [];
      for (var _i = 0, _ref = index - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; 0 <= _ref ? _i++ : _i--){ _results.push(_i); }
      return _results;
    }).apply(this).map(function(i) {
      return getWidth(i);
    })).reduce((function(a, b) {
      return a + b;
    }), 0);
  }
};

groups = [];

sentences.forEach(function(sentence, i) {
  return sentence.forEach(function(word, j) {
    if (!groups[j]) {
      groups[j] = {
        words: [word.word],
        pos: {
          width: getWidth(j),
          left: getLeft(j)
        }
      };
    } else {
      groups[j].words.push(word.word);
    }
    return word.element.css({
      'left': getLeft(j),
      'width': getWidth(j)
    });
  });
});

$sentences.addClass("aligned");

$rsentence = $(".rotating-sentence");

groups.forEach(function(g) {
  var $ws;

  $ws = $('<span class="words"></span>').css({
    'left': g.pos.left,
    'width': g.pos.width
  });
  $rsentence.append($ws);
  return g.words.forEach(function(w) {
    return $ws.append($('<span class="word"></span>').text(w));
  });
});
