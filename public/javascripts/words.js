var $rsentence, $sentences, back, current, getHeight, getLeft, getWidth, groups, height, highlighIndex, next, sentences;

sentences = [['I', 'do', 'my', 'homework'], ['You', 'do', 'your', 'homework'], ['She', 'does', 'her', 'homework'], ['He', 'does', 'his', 'homework'], ['We', 'do', 'our', 'homeworks'], ['They', 'do', 'their', 'homeworks']];

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
  }))[0] * 1.05;
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
      return groups[j] = {
        words: [word.word],
        pos: {
          width: getWidth(j),
          left: getLeft(j)
        }
      };
    } else {
      return groups[j].words.push(word.word);
    }
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
  $ws.addClass(highlighIndex === wordIndex ? 'highlighted' : null);
  $holder = $ws.append('<span class="holder"></span>').find(".holder").css('height', height).css("-webkit-transform", "translate3d(0, 0px, 0)");
  $rsentence.append($ws);
  g.words.forEach(function(w, i) {
    return $holder.append($('<span class="word"></span>').text(w).attr('data-row', i).css('height', height).css('top', i * height));
  });
  return $holder.prepend($holder.children().last().clone().css('top', -height));
});

current = 0;

next = function() {
  var top;

  current++;
  top = current * -height;
  $(".words .holder").each(function() {
    var $current, $holder, $next, lastTop;

    $holder = $(this);
    $current = $holder.find(".word:nth-child(2)");
    $next = $current.next();
    if ($next.text() !== $current.text()) {
      console.log($current.text(), $next.text(), $next.addClass('flash'));
      setTimeout((function() {
        return $next.removeClass('flash');
      }), 1000);
    }
    $holder.children().first().remove();
    lastTop = parseFloat($holder.children().last().css('top'));
    $holder.append($holder.children().first().clone().css('top', lastTop + height));
    return $holder.css("-webkit-transform", "translate3d(0, " + top + "px, 0)");
  });
  return null;
};

back = function() {
  var top;

  current--;
  top = current * -height;
  $(".words .holder").each(function() {
    var $current, $holder, $prev, firstTop;

    $holder = $(this);
    $current = $holder.find(".word:nth-child(2)");
    $prev = $current.prev();
    if ($prev.text() !== $current.text()) {
      console.log($current.text(), $prev.text(), $prev.addClass('flash'));
      setTimeout((function() {
        return $prev.removeClass('flash');
      }), 1200);
    }
    $holder.children().last().remove();
    firstTop = parseFloat($holder.children().first().css('top'));
    $holder.prepend($holder.children().last().clone().css('top', firstTop - height));
    return $holder.css("-webkit-transform", "translate3d(0, " + top + "px, 0)");
  });
  return null;
};

Hammer(document.body).on('swipeup', function() {
  return next();
});

Hammer(document.body).on('swipedown', function() {
  return back();
});

$(document.body).on('keydown', function(e) {
  if (38 === e.which) {
    return back();
  } else {
    if (40 === e.which) {
      return next();
    } else {
      return $.noop();
    }
  }
});

document.ontouchmove = function(e) {
  return e.preventDefault();
};

document.body.ontouchmove = function(e) {
  return e.preventDefault();
};

document.getElementById("viewport").ontouchmove = function(e) {
  return e.preventDefault();
};

$(".highlighted").removeClass('highlighted');
