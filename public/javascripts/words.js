var $rsentence, $sentences, current, getHeight, getLeft, getWidth, groups, height, highlighIndex, next, sentences;

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

getHeight = function() {
  return (($sentences.find(".word").map(function() {
    return $(this).outerHeight();
  })).sort(function(a, b) {
    return b - a;
  }))[0];
};

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

height = getHeight();

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

groups.forEach(function(g, wordIndex) {
  var $holder, $ws;

  $ws = $('<span class="words"></span>').css({
    'left': g.pos.left,
    'width': g.pos.width
  });
  $holder = $ws.append('<span class="holder"></span>').find(".holder").css('height', height).css("-webkit-transform", "translate3d(0, 0px, 0)");
  $rsentence.append($ws);
  g.words.forEach(function(w, i) {
    return $holder.append($('<span class="word"></span>').text(w).attr('data-row', i).addClass(highlighIndex === wordIndex ? 'highlighted' : null).css('height', height).css('top', i * height));
  });
  return $holder.prepend($holder.children().last().clone().css('top', -height));
});

current = 0;

next = function() {
  var top;

  $(".words .holder").each(function() {
    var $ws, lastTop;

    $ws = $(this);
    $ws.children().first().remove();
    lastTop = parseFloat($ws.children().last().css('top'));
    return $ws.append($ws.children().first().clone().css('top', lastTop + height));
  });
  current++;
  top = current * -height;
  console.log("translate3d(0, " + top + "%, 0)");
  $rsentence.find(".holder").css("-webkit-transform", "translate3d(0, " + top + "px, 0)");
  return null;
};
